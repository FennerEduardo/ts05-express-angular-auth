import { Component, inject, signal } from '@angular/core';
import { COMMANDS } from './api/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-client';
import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store } from './state/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.store';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <section aria-label="Autenticación con JWT Middleware en Express.js y Functional Interceptor en Angular 17">
      <h1>Autenticación con JWT Middleware en Express.js y Functional Interceptor en Angular 17</h1>
      <label>
        Aggregate id
        <input data-test="aggregate-id" [value]="aggregateId()" (input)="aggregateId.set($any($event.target).value)" />
      </label>
      @for (command of commands; track command) {
        <button [attr.data-test]="command" [disabled]="!aggregateId() || store.loading()" (click)="store.execute(aggregateId(), command)">{{ command }}</button>
      }
      @if (store.error()) {
        <p role="alert">{{ store.error() }}</p>
      }
      <ul aria-label="events">
        @for (e of store.events(); track e.aggregateId + '-' + e.version) {
          <li>{{ e.type }} v{{ e.version }}</li>
        }
      </ul>
    </section>
  `
})
export class AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17PanelComponent {
  readonly store = inject(AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store);
  readonly commands = COMMANDS;
  readonly aggregateId = signal('');
}
