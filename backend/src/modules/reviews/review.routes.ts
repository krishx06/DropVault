import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  submitReviewHandler,
  getProductReviewsHandler,
  getMyReviewsHandler,
} from './review.controller';

const router = Router();

router.get('/product/:productId', getProductReviewsHandler);

router.post('/', authenticate, submitReviewHandler);
router.get('/me', authenticate, getMyReviewsHandler);

export default router;
