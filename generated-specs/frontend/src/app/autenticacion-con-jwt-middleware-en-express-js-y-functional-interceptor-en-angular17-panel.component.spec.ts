import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent } from './autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-panel.component';
import { AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT } from './api/client.token';

describe('AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent', () => {
  it('executes a command and lists the resulting event', async () => {
    const execute = vi.fn().mockResolvedValue({ type: 'ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed', aggregateId: 'agg-1', version: 1 });
    TestBed.configureTestingModule({ imports: [AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent], providers: [provideZonelessChangeDetection(), { provide: AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT, useValue: { execute } }] });
    const fixture = TestBed.createComponent(AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-test="aggregate-id"]');
    input.value = 'agg-1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-test="process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17"]').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed v1');
    expect(execute).toHaveBeenCalledWith('agg-1', 'process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17', undefined, expect.objectContaining({ idempotencyKey: expect.any(String) }));
  });

  it('disables commands until an aggregate id is entered', () => {
    TestBed.configureTestingModule({ imports: [AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent], providers: [provideZonelessChangeDetection(), { provide: AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT, useValue: { execute: vi.fn() } }] });
    const fixture = TestBed.createComponent(AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-test="process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17"]').disabled).toBe(true);
  });
});
