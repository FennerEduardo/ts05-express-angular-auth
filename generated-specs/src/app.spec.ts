import request from 'supertest';
import { createApp, type CommandPort } from './app';
import { DomainValidationError } from './domain/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.aggregate';
import { signJwt, TENANT_CLAIM } from './auth/jwt';
import type { CommandRequest } from './runtime/command-service';

const SECRET = 'unit-test-secret-with-at-least-32-chars';
process.env.JWT_SECRET = SECRET;

describe('HTTP API', () => {
  const calls: CommandRequest[] = [];
  const port: CommandPort = {
    async handle(req) {
      calls.push(req);
      if (req.command === 'does_not_exist') throw new DomainValidationError(`Unknown command ${req.command}`);
      return { status: req.idempotencyKey === 'seen' ? 'replayed' : 'created', aggregateId: req.aggregateId, eventType: 'ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed', version: 1 };
    }
  };
  const app = createApp(port);
  const bearer = (claims: Record<string, unknown>) => `Bearer ${signJwt(claims, SECRET)}`;

  it('reports health', async () => {
    await request(app).get('/health').expect(200, { status: 'ok' });
  });

  it('runs a command for the token tenant', async () => {
    const res = await request(app)
      .post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17')
      .set('authorization', bearer({ [TENANT_CLAIM]: 'acme' }))
      .set('x-tenant-id', 'someone-else')
      .send({ source: 'api-test' })
      .expect(202);
    expect(res.body).toMatchObject({ status: 'created', aggregateId: 'agg-api' });
    expect(calls[calls.length - 1]).toMatchObject({ tenantId: 'acme', command: 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17', payload: { source: 'api-test' } });
  });

  it('returns 200 for an idempotent replay', async () => {
    await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17').set('authorization', bearer({ [TENANT_CLAIM]: 'acme' })).set('idempotency-key', 'seen').expect(200);
  });

  it('rejects requests without a token, with X-Tenant-Id only, or without a tenant claim', async () => {
    await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17').expect(401);
    await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17').set('x-tenant-id', 'acme').expect(401);
    await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17').set('authorization', bearer({ sub: 'u1' })).expect(401);
    await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17').set('authorization', `Bearer ${signJwt({ [TENANT_CLAIM]: 'acme' }, 'wrong')}`).expect(401);
  });

  it('maps domain validation errors to 422', async () => {
    await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/does_not_exist').set('authorization', bearer({ [TENANT_CLAIM]: 'acme' })).expect(422);
  });
});
