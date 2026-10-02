import request from 'supertest';
import { createApp } from './app';

describe('HTTP API', () => {
  const app = createApp();

  it('reports health', async () => {
    await request(app).get('/health').expect(200, { status: 'ok' });
  });

  it('executes a domain command and returns the event', async () => {
    const res = await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17').send({ source: 'api-test' }).expect(201);
    expect(res.body).toEqual({ type: 'ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed', aggregateId: 'agg-api', version: 1 });
  });

  it('returns 404 for unknown commands', async () => {
    await request(app).post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-api/does_not_exist').expect(404);
  });
});
