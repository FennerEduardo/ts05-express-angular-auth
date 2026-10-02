import { AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate, DomainValidationError } from './autenticacion-con-jwt-middleware-en-express-js-y-functional-interceptor-en-angular17.aggregate';

describe('AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate', () => {
  it('starts in the initial state with no events', () => {
    const aggregate = new AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate('agg-1');
    expect(aggregate.state).toBe('PENDING');
    expect(aggregate.version).toBe(0);
    expect(aggregate.pendingEvents).toHaveLength(0);
  });

  it('rejects an aggregate without id', () => {
    expect(() => new AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate('')).toThrow(DomainValidationError);
  });

  it('processAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17 records ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed and bumps the version', () => {
    const aggregate = new AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate('agg-1');
    const event = aggregate.processAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17({ id: 'agg-1', payload: { source: 'test' } });
    expect(event.type).toBe('ProcessAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Completed');
    expect(event.version).toBe(1);
    expect(aggregate.version).toBe(1);
    expect(aggregate.pendingEvents).toEqual([event]);
  });

  it('processAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17 rejects a command without id', () => {
    const aggregate = new AutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17Aggregate('agg-1');
    expect(() => aggregate.processAutenticacionConJwtMiddlewareEnExpressJsYFunctionalInterceptorEnAngular17({ id: '' })).toThrow(DomainValidationError);
    expect(aggregate.pendingEvents).toHaveLength(0);
  });
});
