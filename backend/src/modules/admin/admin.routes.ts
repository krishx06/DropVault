import { Router } from 'express';
import {
  getPendingSellersHandler,
  getAllSellersHandler,
  updateSellerStatusHandler,
  getAllUsersHandler,
  deactivateUserHandler,
} from './admin.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/sellers', getAllSellersHandler);
router.get('/sellers/pending', getPendingSellersHandler);
router.patch('/sellers/:id/status', updateSellerStatusHandler);

router.get('/users', getAllUsersHandler);
router.patch('/users/:id/deactivate', deactivateUserHandler);

import { approveProductHandler } from '../products/product.controller';
router.patch('/products/:id/approve', approveProductHandler);

import { moderateReviewHandler } from '../reviews/review.controller';
import { getPendingReviewsHandler } from './admin.controller';
router.get('/reviews/pending', getPendingReviewsHandler);
router.patch('/reviews/:id/status', moderateReviewHandler);

export default router;
