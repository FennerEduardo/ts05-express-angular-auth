import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CommandName, CommandResult } from '../api/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-client';
import { AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT } from '../api/client.token';

interface AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17StateModel {
  events: CommandResult[];
  loading: boolean;
  error: string | null;
}

const newKey = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

export const AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store = signalStore(
  { providedIn: 'root' },
  withState<AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17StateModel>({ events: [], loading: false, error: null }),
  withMethods((store, client = inject(AUTENTICACION_CON_JWT_MIDDLEWARE_EN_EXPRESS_JS_Y_FUNCTIONAL_INTERCEPTOR_EN_ANGULAR17_CLIENT)) => ({
    async execute(id: string, command: CommandName, payload?: Record<string, unknown>): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const event = await client.execute(id, command, payload, { idempotencyKey: newKey() });
        patchState(store, { events: [...store.events(), event], loading: false });
      } catch (err) {
        patchState(store, { loading: false, error: err instanceof Error ? err.message : 'Request failed' });
      }
    },
    /** Applies an event pushed by the backend (SignalR). */
    receive(event: CommandResult): void {
      patchState(store, { events: [...store.events(), event] });
    }
  }))
);
