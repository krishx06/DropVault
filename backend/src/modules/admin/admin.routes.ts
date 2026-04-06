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

export default router;
