import { Seller, SellerStatus } from '@prisma/client';

export interface SellerWithUser extends Seller {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export interface ISellerRepository {
  create(userId: string): Promise<Seller>;
  findByUserId(userId: string): Promise<Seller | null>;
  findById(id: string): Promise<SellerWithUser | null>;
  findAll(): Promise<SellerWithUser[]>;
  findByStatus(status: SellerStatus): Promise<SellerWithUser[]>;
  updateStatus(id: string, status: SellerStatus): Promise<Seller>;
}
