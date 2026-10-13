import express, { NextFunction, Request, Response } from 'express';
import { DomainValidationError } from './domain/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.aggregate';
import type { CommandRequest, CommandResult } from './runtime/command-service';
import { tenantFromAuthorization } from './auth/jwt';

/** What the HTTP layer needs from the runtime kernel (CommandService implements it). */
export interface CommandPort {
  handle(request: CommandRequest): Promise<CommandResult>;
}

const STATUS: Record<CommandResult['status'], number> = { created: 202, replayed: 200, 'in-progress': 409 };

// ghk:implements AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17
export function createApp(commands: CommandPort): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // One route per feature of the service; each names its aggregate type.
  const routes: [string, string][] = [['/api/v1/autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17', 'AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17']];
  for (const [route, aggregateType] of routes) app.post(`${route}/:id/:command`, async (req: Request<{ id: string; command: string }>, res: Response, next: NextFunction) => {
    // The tenant comes only from the validated token, never from a header such as X-Tenant-Id.
    const tenantId = tenantFromAuthorization(req.headers.authorization);
    if (!tenantId) {
      res.status(401).json({ detail: 'A valid bearer token with a tenant is required' });
      return;
    }
    try {
      const result = await commands.handle({
        tenantId,
        aggregateType,
        aggregateId: req.params.id,
        command: req.params.command,
        payload: req.body ?? {},
        idempotencyKey: req.header('idempotency-key') ?? undefined,
        traceparent: req.header('traceparent') ?? undefined
      });
      res.status(STATUS[result.status]).json(result);
    } catch (err) {
      // By name: every feature's domain module declares its own DomainValidationError class.
      if (err instanceof DomainValidationError || (err as Error)?.name === 'DomainValidationError') {
        res.status(422).json({ detail: (err as Error).message });
        return;
      }
      next(err);
    }
  });

  return app;
}
