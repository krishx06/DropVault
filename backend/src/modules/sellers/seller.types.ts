import { SellerStatus } from '@prisma/client';

export interface SellerProfileResponse {
  id: string;
  userId: string;
  status: SellerStatus;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}
