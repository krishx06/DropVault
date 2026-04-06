import prisma from '../../config/db';
import { User, Role } from '@prisma/client';
import {
  IUserRepository,
  CreateUserData,
  SafeUser,
  UserWithSeller,
} from '../interfaces/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role ?? 'CUSTOMER',
      },
    });
  }

  async findByEmail(email: string): Promise<UserWithSeller | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { seller: true },
    });
  }

  async findById(id: string): Promise<UserWithSeller | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { seller: true },
    });
  }

  async findAll(): Promise<SafeUser[]> {
    return prisma.user.findMany({
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
  }

  async updateRole(id: string, role: Role): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async deactivate(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
