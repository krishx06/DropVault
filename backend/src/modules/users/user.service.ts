import prisma from '../../config/db';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { SafeUser } from '../../repositories/interfaces/IUserRepository';
import { UpdateProfileInput } from './user.types';
import { BadRequestError, NotFoundError } from '../../utils/AppError';
import { logger } from '../../utils/logger';

const userRepository = new PrismaUserRepository();

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<SafeUser> {
  if (input.name !== undefined && input.name.trim().length < 2) {
    throw BadRequestError('Name must be at least 2 characters');
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw NotFoundError('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name: input.name?.trim() ?? user.name },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  logger.info(`Profile updated: userId=${userId}`);
  return updated;
}
