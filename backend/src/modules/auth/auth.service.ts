import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../utils/AppError';
import {
  BCRYPT_SALT_ROUNDS,
  PASSWORD_MIN_LENGTH,
  NAME_MIN_LENGTH,
} from '../../utils/constants';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { PrismaSellerRepository } from '../../repositories/prisma/PrismaSellerRepository';
import { RegisterInput, LoginInput, AuthResponse } from './auth.types';
import { JwtPayload } from '../../middlewares/auth.middleware';
import { logger } from '../../utils/logger';

const userRepository = new PrismaUserRepository();
const sellerRepository = new PrismaSellerRepository();

function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

function validateRegisterInput(input: RegisterInput): void {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length < NAME_MIN_LENGTH) {
    errors.push(`Name must be at least ${NAME_MIN_LENGTH} characters`);
  }

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push('Valid email is required');
  }

  if (!input.password || input.password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }

  if (input.role && !['CUSTOMER', 'SELLER'].includes(input.role)) {
    errors.push('Role must be CUSTOMER or SELLER');
  }

  if (errors.length > 0) {
    throw BadRequestError(errors.join('. '));
  }
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  validateRegisterInput(input);

  const existingUser = await userRepository.findByEmail(input.email);
  if (existingUser) {
    throw ConflictError('An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

  const role = input.role === 'SELLER' ? 'SELLER' : 'CUSTOMER';

  const user = await userRepository.create({
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    password: hashedPassword,
    role,
  });

  let sellerStatus: string | null = null;
  if (role === 'SELLER') {
    const seller = await sellerRepository.create(user.id);
    sellerStatus = seller.status;
    logger.info('New seller registration (pending approval)', {
      userId: user.id,
      email: user.email,
    });
  } else {
    logger.info('New customer registration', {
      userId: user.id,
      email: user.email,
    });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      sellerStatus,
    },
    token,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  if (!input.email || !input.password) {
    throw BadRequestError('Email and password are required');
  }

  const user = await userRepository.findByEmail(input.email.toLowerCase().trim());
  if (!user) {
    throw UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw UnauthorizedError('Account has been deactivated');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw UnauthorizedError('Invalid email or password');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info('User logged in', { userId: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      sellerStatus: user.seller?.status ?? null,
    },
    token,
  };
}

export async function getProfile(userId: string): Promise<AuthResponse['user']> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw NotFoundError('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    sellerStatus: user.seller?.status ?? null,
  };
}
