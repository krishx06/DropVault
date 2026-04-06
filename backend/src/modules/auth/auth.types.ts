import { Role } from '@prisma/client';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    sellerStatus?: string | null;
  };
  token: string;
}
