import { Injectable, inject, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import type { CommandResult } from '../api/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17-client';
import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store } from '../state/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.store';

/** Pushes backend domain events (SignalR hub) into the store. */
@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly store = inject(AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Store);
  private connection?: signalR.HubConnection;
  readonly connected = signal(false);

  async start(hubUrl = '/hubs/domain-events'): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();
    this.connection.on('ReceiveDomainEvent', (event: CommandResult) => this.store.receive(event));
    await this.connection.start();
    this.connected.set(true);
  }

  async stop(): Promise<void> {
    await this.connection?.stop();
    this.connected.set(false);
  }
}
