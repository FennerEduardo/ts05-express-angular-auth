import express, { NextFunction, Request, Response } from 'express';
import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate, AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Command, AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17DomainEvent, DomainValidationError } from './domain/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.aggregate';

type Handler = (aggregate: AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate, command: AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Command) => AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17DomainEvent;

const COMMANDS: Record<string, Handler> = {
  process_autenticacion_con_jwt_middleware_en_express_js_y_functional_interceptor_en_angular17: (a, c) => a.processAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17(c),
};

/** Builds the Express app. The in-memory store is a placeholder for a repository + outbox. */
export function createApp(): express.Express {
  const app = express();
  const store = new Map<string, AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate>();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17/:id/:command', (req: Request<{ id: string; command: string }>, res: Response, next: NextFunction) => {
    const handler = COMMANDS[req.params.command];
    if (!handler) {
      res.status(404).json({ detail: `Unknown command ${req.params.command}` });
      return;
    }
    try {
      const id = req.params.id;
      const aggregate = store.get(id) ?? new AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate(id);
      store.set(id, aggregate);
      const event = handler(aggregate, { id, payload: req.body ?? {} });
      res.status(201).json({ type: event.type, aggregateId: event.aggregateId, version: event.version });
    } catch (err) {
      if (err instanceof DomainValidationError) {
        res.status(422).json({ detail: err.message });
        return;
      }
      next(err);
    }
  });

  return app;
}
