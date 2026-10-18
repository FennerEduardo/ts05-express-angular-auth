import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { createApp } from './app';
import { CommandService } from './runtime/command-service';
import { DEFAULT_TOPOLOGY, brokerConfigured, connectBroker, type Broker } from './runtime/broker';
import { OutboxRelay } from './runtime/outbox-relay';

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const port = Number(process.env.PORT) || 3000;
  const server = createApp(new CommandService(pool)).listen(port, () => console.log(`listening on :${port}`));

  let timer: NodeJS.Timeout | undefined;
  let broker: Broker | undefined;
  if (brokerConfigured()) {
    // runtime/broker.ts: GHK_BROKER, AMQP_URL, PUBSUB_*, SERVICEBUS_*
    broker = await connectBroker();
    await broker.declare(DEFAULT_TOPOLOGY);
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
      void Promise.allSettled([broker?.close(), pool.end()]).then(() => process.exit(0));
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

void main();
