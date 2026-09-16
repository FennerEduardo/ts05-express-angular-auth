// Angular 17+ NgRx Signal Store Generator (Modern Signals Default)
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export enum TransactionStatus {
  PENDING = 'PENDING',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATED = 'COMPENSATED'
}

export interface OriginAllocation {
  originId: string;
  amount: number;
  currency: string;
}

export interface DestinationAllocation {
  destinationId: string;
  amount: number;
}

export interface AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17TransactionItem {
  id: string;
  referenceCode: string;
  status: TransactionStatus;
  amount: number;
  origins: OriginAllocation[];
  destinations: DestinationAllocation[];
  currentSagaStep: string;
  createdAt: string;
}

export interface AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17State {
  items: AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17TransactionItem[];
  activeTransaction: AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17TransactionItem | null;
  loading: boolean;
  error: string | null;
  tenantId: string | null;
}

const initialState: AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17State = {
  items: [],
  activeTransaction: null,
  loading: false,
  error: null,
  tenantId: null
};

export const AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17SignalStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    totalCount: computed(() => store.items().length),
    completedCount: computed(() => store.items().filter(i => i.status === TransactionStatus.COMPLETED).length),
    executingCount: computed(() => store.items().filter(i => i.status === TransactionStatus.EXECUTING).length),
    isLoading: computed(() => store.loading()),
    hasError: computed(() => store.error() !== null)
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    loadTransactions: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => {
          const tenant = store.tenantId();
          const headers = tenant ? new HttpHeaders().set('X-Tenant-ID', tenant) : undefined;
          return http.get<AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17TransactionItem[]>(`/api/v1/autenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17`, { headers }).pipe(
            tap({
              next: (items) => patchState(store, { items, loading: false }),
              error: (err) => patchState(store, { error: err.message, loading: false })
            })
          );
        })
      )
    ),
    executeCommand(commandData: any, idempotencyKey?: string) {
      patchState(store, { loading: true });
      let headers = new HttpHeaders();
      if (idempotencyKey) {
        headers = headers.set('X-Idempotency-Key', idempotencyKey);
      }
      return http.post(`/api/v1/autenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17/commands`, commandData, { headers }).subscribe({
        next: (res: any) => patchState(store, { loading: false }),
        error: (err) => patchState(store, { error: err.message, loading: false })
      });
    },
    onRealtimeStatusUpdate(updatedItem: AutenticaciónConJWTMiddlewareEnExpress.jsYFunctionalInterceptorEnAngular17TransactionItem) {
      const current = store.items();
      const idx = current.findIndex(i => i.id === updatedItem.id);
      if (idx >= 0) {
        const copy = [...current];
        copy[idx] = updatedItem;
        patchState(store, { items: copy, activeTransaction: updatedItem });
      } else {
        patchState(store, { items: [updatedItem, ...current] });
      }
    }
  }))
);
