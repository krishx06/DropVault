import { Request, Response, NextFunction } from 'express';
import * as reviewService from './review.service';
import { sendSuccess } from '../../utils/response';

export async function submitReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const review = await reviewService.submitReview(req.user!.userId, req.body);
    sendSuccess(res, review, 'Review submitted for moderation', 201);
  } catch (error) {
    next(error);
  }
}

export async function getProductReviewsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId as string);
    sendSuccess(res, reviews);
  } catch (error) {
    next(error);
  }
}

export async function getMyReviewsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const reviews = await reviewService.getMyReviews(req.user!.userId);
    sendSuccess(res, reviews);
  } catch (error) {
    next(error);
  }
}

export async function moderateReviewHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const review = await reviewService.moderateReview(
      req.params.id as string,
      req.body.status,
    );
    sendSuccess(res, review, `Review ${req.body.status.toLowerCase()} successfully`);
  } catch (error) {
    next(error);
  }
}
