import { Router } from 'express';
import userRoutes from './user/user.routes';
import orgRoutes from './org/org.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/orgs', orgRoutes);

export default router;