import { InjectionToken } from '@angular/core';
import { createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client, AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client } from './autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-client';

/** Swap the API client per environment or in tests. */
export const AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT = new InjectionToken<AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client>('AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client', {
  providedIn: 'root',
  factory: () => createAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Client()
});
