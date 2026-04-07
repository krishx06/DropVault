import { Request, Response, NextFunction } from 'express';
import * as dropService from './drop.service';
import { sendSuccess } from '../../utils/response';

export async function createDropHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const drop = await dropService.createDrop(userId, req.body);
    sendSuccess(res, drop, 'Drop scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function getMyDropsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const drops = await dropService.getMyDrops(userId);
    sendSuccess(res, drops);
  } catch (error) {
    next(error);
  }
}

export async function updateDropHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const dropId = req.params.id as string;
    const drop = await dropService.updateDrop(userId, dropId, req.body);
    sendSuccess(res, drop, 'Drop updated successfully');
  } catch (error) {
    next(error);
  }
}
