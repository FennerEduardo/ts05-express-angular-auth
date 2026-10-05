import { describe, expect, it, vi } from 'vitest';
import { ApiError, COMMANDS, createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client, newTraceparent } from './autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-client';

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

  it('sends a W3C traceparent that starts a new trace per request', async () => {
    const fetch = fakeFetch(201, { type: 'ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed', aggregateId: 'agg-1', version: 1 });
    const client = createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client({ fetch });

    await client.execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17');
    await client.execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17');

    const sent = fetch.mock.calls.map(([, init]) => (init?.headers as Record<string, string>).traceparent);
    for (const traceparent of sent) expect(traceparent).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
    expect(sent[0]).not.toBe(sent[1]);
    expect(newTraceparent()).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
  });

  it('propagates the caller trace context or none when disabled', async () => {
    const traced = fakeFetch(201, {});
    const parent = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';
    await createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client({ fetch: traced, traceparent: () => parent }).execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17');
    expect((traced.mock.calls[0][1]?.headers as Record<string, string>).traceparent).toBe(parent);

    const untraced = fakeFetch(201, {});
    await createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client({ fetch: untraced, traceparent: false }).execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17');
    expect((untraced.mock.calls[0][1]?.headers as Record<string, string>).traceparent).toBeUndefined();
  });

  it('raises ApiError with the server detail on failure', async () => {
    const client = createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client({ fetch: fakeFetch(422, { detail: 'Command id is required' }) });
    await expect(client.execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17')).rejects.toEqual(new ApiError(422, 'Command id is required'));
  });
});
