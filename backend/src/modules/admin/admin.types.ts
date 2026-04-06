import { SellerStatus } from '@prisma/client';

export interface UpdateSellerStatusInput {
  sellerId: string;
  status: SellerStatus;
}
