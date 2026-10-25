import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { createApp } from './app';
import { CommandService } from './runtime/command-service';
import { DEFAULT_TOPOLOGY, brokerConfigured, connectBroker, type Broker } from './runtime/broker';
import { OutboxRelay } from './runtime/outbox-relay';
import { migrate, pgConnectionString } from './runtime/schema';
import { startTelemetry, stopTelemetry } from './runtime/otel';

async function main(): Promise<void> {
  // OTLP export when OTEL_EXPORTER_OTLP_ENDPOINT is set (runtime/otel.ts).
  startTelemetry();
  const pool = new Pool({ connectionString: pgConnectionString() });
  // The kernel's tables, before serving or relaying (idempotent, serialized across replicas).
  // GHK_MIGRATE=false when a migration job owns the schema.
  if (process.env.GHK_MIGRATE !== 'false') await migrate(pool);
  const port = Number(process.env.PORT) || 3000;
  const server = createApp(new CommandService(pool)).listen(port, () => console.log(`listening on :${port}`));

  let timer: NodeJS.Timeout | undefined;
  let broker: Broker | undefined;
  if (brokerConfigured()) {
    // runtime/broker.ts: GHK_BROKER, AMQP_URL, PUBSUB_*, SERVICEBUS_*
    broker = await connectBroker();
    // GHK_DECLARE_TOPOLOGY=false when infrastructure as code owns the topology (least-privilege credentials).
    if (process.env.GHK_DECLARE_TOPOLOGY !== 'false') await broker.declare(DEFAULT_TOPOLOGY);
    const relay = new OutboxRelay(pool, await broker.publisher(DEFAULT_TOPOLOGY.exchange));
    const workerId = `autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-${randomUUID()}`;
    let running = false;
    timer = setInterval(() => {
      if (running) return;
      running = true;
      relay.publishBatch(workerId).catch(err => console.error('outbox relay failed', err)).finally(() => { running = false; });
    }, 1000);
  } else {
    console.warn('No event broker is configured (AMQP_URL, PUBSUB_PROJECT_ID or SERVICEBUS_*): outbox events are stored but not published.');
  }

  const shutdown = () => {
    if (timer) clearInterval(timer);
    server.close(() => {
      void Promise.allSettled([broker?.close(), pool.end(), stopTelemetry()]).then(() => process.exit(0));
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

void main();
