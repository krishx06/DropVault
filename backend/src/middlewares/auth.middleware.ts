import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/AppError';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';


export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const userRepository = new PrismaUserRepository();

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw UnauthorizedError('Access token is required');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw UnauthorizedError('User no longer exists');
    }
    if (!user.isActive) {
      throw UnauthorizedError('Account has been deactivated');
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
