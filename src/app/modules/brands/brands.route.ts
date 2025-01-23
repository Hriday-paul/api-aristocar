import { Router } from 'express';
import { brandsController } from './brands.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-brands',
  auth(USER_ROLE.admin),
  brandsController.createbrands,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  brandsController.updatebrands,
);

router.delete('/:id', auth(USER_ROLE.admin), brandsController.deletebrands);

router.get('/:id', auth(USER_ROLE.admin), brandsController.getbrandsById);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.user),
  brandsController.getAllbrands,
);

export const brandsRoutes = router;
