import { Order, OrderStatus, Drop, Product } from '@prisma/client';

export interface OrderWithDetails extends Order {
  drop: Drop & { product: Product };
}

export interface CreateOrderData {
  userId: string;
  dropId: string;
  quantity: number;
  totalAmount: number;
}

export interface IOrderRepository {
  create(data: CreateOrderData): Promise<Order>;
  findById(id: string): Promise<OrderWithDetails | null>;
  findByUserId(userId: string): Promise<OrderWithDetails[]>;
  findByDropId(dropId: string): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}
