import { Router } from 'express';
import userRouter from './user/user.route';


const router = Router();

router.use('/users', userRouter);
// router.use('/orgs', );

export default router;