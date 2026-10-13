import { randomUUID } from 'crypto';
import * as amqp from 'amqplib';
import { Pool } from 'pg';
import { createApp } from './app';
import { CommandService } from './runtime/command-service';
import { DEFAULT_TOPOLOGY, OutboxRelay, declareTopology } from './runtime/outbox-relay';

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const port = Number(process.env.PORT) || 3000;
  const server = createApp(new CommandService(pool)).listen(port, () => console.log(`listening on :${port}`));

  let timer: NodeJS.Timeout | undefined;
  let connection: Awaited<ReturnType<typeof amqp.connect>> | undefined;
  if (process.env.AMQP_URL) {
    connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createConfirmChannel();
    await declareTopology(channel);
    const relay = new OutboxRelay(pool, channel, DEFAULT_TOPOLOGY.exchange);
    const workerId = `autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-${randomUUID()}`;
    let running = false;
    timer = setInterval(() => {
      if (running) return;
      running = true;
      relay.publishBatch(workerId).catch(err => console.error('outbox relay failed', err)).finally(() => { running = false; });
    }, 1000);
  } else {
    console.warn('AMQP_URL is not set: outbox events are stored but not published.');
  }

  const shutdown = () => {
    if (timer) clearInterval(timer);
    server.close(() => {
      void Promise.allSettled([connection?.close(), pool.end()]).then(() => process.exit(0));
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

void main();
