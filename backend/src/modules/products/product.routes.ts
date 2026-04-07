import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import {
  createProductHandler,
  getMyProductsHandler,
  updateProductHandler,
} from './product.controller';

const router = Router();

// Seller Routes
router.use(authenticate, authorize('SELLER'));

router.post('/', createProductHandler);
router.get('/me', getMyProductsHandler);
router.patch('/:id', updateProductHandler);

// Note: Admin approval route will be wired into the /api/admin paths

export default router;
