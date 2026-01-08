import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  loginSchema,
  paginationSchema,
} from '../../utils/validators';

const router = Router();

// Public routes
router.post('/register', validateBody(createUserSchema), UserController.register);
router.post('/login', validateBody(loginSchema), UserController.login);

// Protected routes (require authentication)
router.post('/logout', authenticate, UserController.logout);
router.get('/me', authenticate, UserController.getProfile);
router.put('/me', authenticate, validateBody(updateUserSchema), UserController.updateProfile);
router.put('/me/password', authenticate, validateBody(changePasswordSchema), UserController.changePassword);
router.delete('/me', authenticate, UserController.deleteAccount);
router.post('/me/verify', authenticate, UserController.verifyEmail);

// Admin routes (add role check middleware as needed)
router.get('/', authenticate, validateQuery(paginationSchema), UserController.listUsers);
router.get('/:id', authenticate, UserController.getUserById);

export default router;