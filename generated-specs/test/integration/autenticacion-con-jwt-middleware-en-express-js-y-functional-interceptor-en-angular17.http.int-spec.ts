// HTTP contract of the application layer against PostgreSQL. Requires DATABASE_URL.
import { randomUUID } from 'crypto';
import request from 'supertest';
import { Pool } from 'pg';
import { createApp } from '../../src/app';
import { CommandService } from '../../src/runtime/command-service';
import { migrate, pgConnectionString } from '../../src/runtime/schema';
import { signJwt, TENANT_CLAIM } from '../../src/auth/jwt';

const SECRET = 'integration-test-secret-with-32-chars!';
process.env.JWT_SECRET = SECRET;

describe('AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17 HTTP application layer', () => {
  const pool = new Pool({ connectionString: pgConnectionString() });
  const app = createApp(new CommandService(pool));
  const tenant = `tenant-${randomUUID()}`;

  beforeAll(() => migrate(pool));
  afterAll(() => pool.end());

  it('runs a command into the outbox for the token tenant, idempotently', async () => {
    const id = randomUUID();
    const key = randomUUID();
    const send = () => request(app)
      .post(`/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/${id}/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17`)
      .set('authorization', `Bearer ${signJwt({ [TENANT_CLAIM]: tenant }, SECRET)}`)
      .set('idempotency-key', key)
      .set('x-tenant-id', 'someone-else')
      .send({});
    await send().expect(202);
    const replay = await send().expect(200);
    expect(replay.body.status).toBe('replayed');
    const { rows } = await pool.query('SELECT tenant_id FROM ghk_outbox WHERE aggregate_id = $1', [id]);
    expect(rows).toEqual([{ tenant_id: tenant }]);
  });
});
