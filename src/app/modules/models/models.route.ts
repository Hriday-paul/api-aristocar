import { Router } from 'express';
import { modelsController } from './models.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-models',
  auth(USER_ROLE.admin),
  modelsController.createmodels,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  modelsController.updatemodels,
);

router.delete('/:id', auth(USER_ROLE.admin), modelsController.deletemodels);

router.get('/:id', modelsController.getModelsByBrand);

router.get('/', modelsController.getAllmodels);

export const modelsRoutes = router;
