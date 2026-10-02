import { describe, expect, it, vi } from 'vitest';
import { ApiError, COMMANDS, createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client } from './autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-client';

function fakeFetch(status: number, body: unknown) {
  return vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));
}

describe('AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17 API client', () => {
  it('exposes one method per domain command', () => {
    expect(COMMANDS).toEqual(['process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17']);
  });

  it('posts the command with tenant and idempotency headers', async () => {
    const fetch = fakeFetch(201, { type: 'ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed', aggregateId: 'agg-1', version: 1 });
    const client = createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client({ baseUrl: 'https://api.test/', tenantId: 'acme', fetch });

    const result = await client.processAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17('agg-1', { amount: 100 }, { idempotencyKey: 'key-1' });

    expect(result).toEqual({ type: 'ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed', aggregateId: 'agg-1', version: 1 });
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('https://api.test/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/agg-1/process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17');
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>)['X-Tenant-Id']).toBe('acme');
    expect((init?.headers as Record<string, string>)['X-Idempotency-Key']).toBe('key-1');
    expect(JSON.parse(String(init?.body))).toEqual({ amount: 100 });
  });

  it('raises ApiError with the server detail on failure', async () => {
    const client = createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client({ fetch: fakeFetch(422, { detail: 'Command id is required' }) });
    await expect(client.execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17')).rejects.toEqual(new ApiError(422, 'Command id is required'));
  });
});
