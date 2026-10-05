import { randomUUID } from 'crypto';
import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import type { Pool } from 'pg';
import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate, DomainValidationError, type AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Command, type AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17DomainEvent, type AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17State } from '../domain/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.aggregate';
import { schemaName } from './schema';
import { contextFrom, traceparentOf, tracer } from './telemetry';

const AGGREGATE_TYPE = 'AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17';

const COMMANDS: Record<string, (aggregate: AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate, command: AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Command) => AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17DomainEvent> = {
  process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17: (a, c) => a.processAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17(c)
};

export interface CommandRequest {
  tenantId: string;
  aggregateId: string;
  command: string;
  payload?: Record<string, unknown>;
  idempotencyKey?: string;
  /** Incoming W3C traceparent (e.g. from the HTTP request). */
  traceparent?: string;
}

export interface CommandResult {
  status: 'created' | 'replayed' | 'in-progress';
  aggregateId: string;
  eventType?: string;
  version?: number;
}

/**
 * Executes a command in one transaction: idempotency claim, aggregate load (FOR UPDATE),
 * domain logic, aggregate save and outbox insert. A domain error rolls everything back.
 */
export class CommandService {
  private readonly s: string;

  constructor(private readonly pool: Pool, schema = 'public') {
    this.s = schemaName(schema);
  }

  async handle(req: CommandRequest): Promise<CommandResult> {
    if (!req.tenantId) throw new DomainValidationError('tenantId is required');
    const parent = contextFrom(req.traceparent);
    const span = tracer().startSpan(`AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17.${req.command}`, {
      kind: SpanKind.INTERNAL,
      attributes: { 'tenant.id': req.tenantId, 'aggregate.id': req.aggregateId }
    }, parent);
    const ctx = trace.setSpan(parent, span);
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      if (req.idempotencyKey) {
        const claim = await client.query(`INSERT INTO ${this.s}.ghk_idempotency (tenant_id, key, status) VALUES ($1, $2, 'PROCESSING') ON CONFLICT DO NOTHING`, [req.tenantId, req.idempotencyKey]);
        if (claim.rowCount === 0) {
          const { rows } = await client.query(`SELECT status, response FROM ${this.s}.ghk_idempotency WHERE tenant_id = $1 AND key = $2`, [req.tenantId, req.idempotencyKey]);
          await client.query('COMMIT');
          if (rows[0]?.status === 'COMPLETED') return { ...(JSON.parse(rows[0].response) as CommandResult), status: 'replayed' };
          return { status: 'in-progress', aggregateId: req.aggregateId };
        }
      }
      const { rows } = await client.query(`SELECT state, version FROM ${this.s}.ghk_aggregates WHERE tenant_id = $1 AND aggregate_type = $2 AND id = $3 FOR UPDATE`, [req.tenantId, AGGREGATE_TYPE, req.aggregateId]);
      const aggregate = rows[0]
        ? AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate.restore(req.aggregateId, rows[0].state as AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17State, Number(rows[0].version))
        : new AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate(req.aggregateId);
      const handler = COMMANDS[req.command];
      if (!handler) throw new DomainValidationError(`Unknown command ${req.command}`);
      const event = handler(aggregate, { id: req.aggregateId, payload: req.payload ?? {} });

      await client.query(
        `INSERT INTO ${this.s}.ghk_aggregates (tenant_id, aggregate_type, id, state, version) VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (tenant_id, aggregate_type, id) DO UPDATE SET state = EXCLUDED.state, version = EXCLUDED.version, updated_at = now()`,
        [req.tenantId, AGGREGATE_TYPE, req.aggregateId, aggregate.state, aggregate.version]
      );
      await client.query(
        `INSERT INTO ${this.s}.ghk_outbox (id, tenant_id, aggregate_id, event_type, payload, traceparent) VALUES ($1, $2, $3, $4, $5, $6)`,
        [randomUUID(), req.tenantId, req.aggregateId, event.type, JSON.stringify(event), traceparentOf(ctx) ?? null]
      );
      const result: CommandResult = { status: 'created', aggregateId: req.aggregateId, eventType: event.type, version: event.version };
      if (req.idempotencyKey) {
        await client.query(`UPDATE ${this.s}.ghk_idempotency SET status = 'COMPLETED', response = $3 WHERE tenant_id = $1 AND key = $2`, [req.tenantId, req.idempotencyKey, JSON.stringify(result)]);
      }
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => undefined);
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message });
      throw err;
    } finally {
      client.release();
      span.end();
    }
  }

  /** The aggregate as tenant `tenantId` sees it (undefined for other tenants' aggregates). */
  async load(tenantId: string, aggregateId: string): Promise<{ state: string; version: number } | undefined> {
    const { rows } = await this.pool.query(`SELECT state, version FROM ${this.s}.ghk_aggregates WHERE tenant_id = $1 AND aggregate_type = $2 AND id = $3`, [tenantId, AGGREGATE_TYPE, aggregateId]);
    return rows[0] ? { state: rows[0].state, version: Number(rows[0].version) } : undefined;
  }
}
