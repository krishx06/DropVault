import { Request, Response, NextFunction } from 'express';
import * as sellerService from './seller.service';
import * as orderService from '../orders/order.service';
import { sendSuccess } from '../../utils/response';

export async function getPublicSellersHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sellers = await sellerService.getPublicSellers();
    sendSuccess(res, sellers);
  } catch (error) {
    next(error);
  }
}

export async function getMySellerProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await sellerService.getMySellerProfile(req.user!.userId);
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
}

export async function getSellerOrdersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await orderService.getOrdersForSeller(req.user!.userId);
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
}

export async function confirmSellerOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await orderService.confirmOrderBySeller(req.user!.userId, req.params.id as string);
    sendSuccess(res, order, 'Order confirmed');
  } catch (error) {
    next(error);
  }
}
