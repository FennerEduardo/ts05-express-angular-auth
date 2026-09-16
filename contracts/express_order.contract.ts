import { Request, Response, NextFunction } from 'express';

export interface ExpressOrderPayload {
  readonly customerId: string;
  readonly amount: number;
  readonly currency: string;
  readonly idempotencyKey: string;
}

export interface ExpressAuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: string[];
  };
  body: ExpressOrderPayload;
}

export interface IExpressOrderControllerContract {
  createOrder(req: ExpressAuthRequest, res: Response, next: NextFunction): Promise<void>;
  validateIdempotencyMiddleware(req: Request, res: Response, next: NextFunction): void;
}
