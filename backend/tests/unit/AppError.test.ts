import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../src/utils/AppError';

describe('AppError', () => {
  it('sets message and statusCode correctly', () => {
    const err = new AppError('something went wrong', 422);
    expect(err.message).toBe('something went wrong');
    expect(err.statusCode).toBe(422);
  });

  it('defaults isOperational to true', () => {
    const err = new AppError('oops', 500);
    expect(err.isOperational).toBe(true);
  });

  it('allows isOperational to be set false for programmer errors', () => {
    const err = new AppError('bug', 500, false);
    expect(err.isOperational).toBe(false);
  });

  it('is an instance of Error', () => {
    const err = new AppError('test', 400);
    expect(err).toBeInstanceOf(Error);
  });
});

describe('AppError factory methods', () => {
  it('BadRequestError returns 400', () => {
    const err = BadRequestError('bad input');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('bad input');
  });

  it('BadRequestError uses default message', () => {
    expect(BadRequestError().message).toBe('Bad request');
  });

  it('UnauthorizedError returns 401', () => {
    expect(UnauthorizedError().statusCode).toBe(401);
  });

  it('ForbiddenError returns 403', () => {
    expect(ForbiddenError().statusCode).toBe(403);
  });

  it('NotFoundError returns 404', () => {
    expect(NotFoundError().statusCode).toBe(404);
  });

  it('ConflictError returns 409', () => {
    expect(ConflictError().statusCode).toBe(409);
  });

  it('all factory errors are operational', () => {
    const errors = [
      BadRequestError(),
      UnauthorizedError(),
      ForbiddenError(),
      NotFoundError(),
      ConflictError(),
    ];
    errors.forEach((err) => expect(err.isOperational).toBe(true));
  });
});
