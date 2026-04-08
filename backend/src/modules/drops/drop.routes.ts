import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import {
  createDropHandler,
  getMyDropsHandler,
  updateDropHandler,
  getPublicDropsHandler,
  getDropByIdHandler,
} from './drop.controller';

const router = Router();

// Seller-only routes (defined first so /me doesn't match /:id)
router.post('/', authenticate, authorize('SELLER'), createDropHandler);
router.get('/me', authenticate, authorize('SELLER'), getMyDropsHandler);
router.patch('/:id', authenticate, authorize('SELLER'), updateDropHandler);

// Public routes
router.get('/', getPublicDropsHandler);
router.get('/:id', getDropByIdHandler);

export default router;
