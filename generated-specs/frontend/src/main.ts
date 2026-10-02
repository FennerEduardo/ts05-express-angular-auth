import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent } from './app/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-panel.component';

bootstrapApplication(AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent, { providers: [provideZonelessChangeDetection()] }).catch(err => console.error(err));
