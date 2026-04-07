import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import {
  createDropHandler,
  getMyDropsHandler,
  updateDropHandler,
} from './drop.controller';

const router = Router();

router.use(authenticate, authorize('SELLER'));

router.post('/', createDropHandler);
router.get('/me', getMyDropsHandler);
router.patch('/:id', updateDropHandler);

export default router;
