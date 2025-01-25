import { Router } from 'express';
import { authControllers } from './auth.controller';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { authValidation } from './auth.validation';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidation.loginZodValidationSchema),
  authControllers.login,
);

router.post(
  '/admin/login',
  validateRequest(authValidation.loginZodValidationSchema),
  authControllers.adminLogin,
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.patch(
  '/change-password',
  auth(USER_ROLE.dealer, USER_ROLE.admin, USER_ROLE.user),
  authControllers.changePassword,
);

router.patch('/forgot-password', authControllers.forgotPassword);
router.patch('/reset-password', authControllers.resetPassword);
export const authRoutes = router;
