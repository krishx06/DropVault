import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service';
import { sendSuccess } from '../../utils/response';

export async function placeOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await orderService.placeOrder(req.user!.userId, req.body);
    sendSuccess(res, order, 'Order placed successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function getMyOrdersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await orderService.getMyOrders(req.user!.userId);
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
}

export async function cancelOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await orderService.cancelOrder(req.user!.userId, req.params.id as string);
    sendSuccess(res, order, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
}
