import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../utils/AppError';


export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(
        ForbiddenError(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
        ),
      );
    }

    next();
  };
}
