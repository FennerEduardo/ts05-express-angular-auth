import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, type Mock } from 'vitest';
import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store } from './autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.store';
import { AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT } from '../api/client.token';

describe('AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store', () => {
  function setup(execute: Mock) {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), { provide: AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT, useValue: { execute } }] });
    return TestBed.inject(AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store);
  }

  it('records the event returned by the backend', async () => {
    const result = { type: 'ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed', aggregateId: 'agg-1', version: 1 };
    const store = setup(vi.fn().mockResolvedValue(result));
    await store.execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17');
    expect(store.events()).toEqual([result]);
    expect(store.error()).toBeNull();
  });

  it('keeps the error message when the command fails', async () => {
    const store = setup(vi.fn().mockRejectedValue(new Error('Command id is required')));
    await store.execute('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17');
    expect(store.error()).toBe('Command id is required');
  });
});
