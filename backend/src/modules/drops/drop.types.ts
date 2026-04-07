import { DropStatus } from '@prisma/client';

export interface CreateDropInput {
  productId: string;
  startTime: Date;
  endTime: Date;
  stock: number;
}

export interface UpdateDropInput {
  startTime?: Date;
  endTime?: Date;
  stock?: number;
  status?: DropStatus;
}
