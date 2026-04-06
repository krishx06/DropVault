import { User, Role, Seller } from '@prisma/client';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export type SafeUser = Omit<User, 'password'>;

export interface UserWithSeller extends User {
  seller: Seller | null;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<UserWithSeller | null>;
  findById(id: string): Promise<UserWithSeller | null>;
  findAll(): Promise<SafeUser[]>;
  updateRole(id: string, role: Role): Promise<User>;
  deactivate(id: string): Promise<User>;
}
