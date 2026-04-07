import { ProductStatus } from '@prisma/client';

export interface CreateProductInput {
  sellerId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  status?: ProductStatus;
}
