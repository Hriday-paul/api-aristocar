import { Router } from 'express';
import { subscriptionController } from './subscription.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.dealer),
  subscriptionController.createSubscription,
);

// router.patch(
//   '/:id',
//   auth(USER_ROLE.dealer),
//   subscriptionController.updateSubscription,
// );

// router.delete(
//   '/:id',
//   auth(USER_ROLE.admin),
//   subscriptionController.deleteSubscription,
// );

router.get(
  '/user/:userId',
  auth(USER_ROLE.dealer, USER_ROLE.admin),
  subscriptionController.getSubscriptionByUserId,
);
router.get(
  '/my-subscriptions',
  auth(USER_ROLE.dealer),
  subscriptionController.getMySubscription,
);
router.get(
  '/personalsubscription',
  auth(USER_ROLE.dealer),
  subscriptionController.getSubscriptionById,
);
router.get(
  '/',
  auth(USER_ROLE.admin),
  subscriptionController.getAllSubscription,
);

export const subscriptionRoutes = router;
