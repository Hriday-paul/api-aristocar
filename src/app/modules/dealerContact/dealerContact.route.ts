import { Router } from 'express';
import { dealerContactController } from './dealerContact.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/create-dealerContact',
  dealerContactController.createdealerContact,
);

// router.patch('/update/:id', dealerContactController.updatedealerContact);

router.delete(
  '/:id',
  auth(USER_ROLE?.dealer),
  dealerContactController.deletedealerContact,
);

router.get(
  '/get-dealerContact',
  auth(USER_ROLE?.dealer),
  dealerContactController.getDealerContact,
);

router.get(
  '/:id',
  auth(USER_ROLE?.dealer),
  dealerContactController.getdealerContactById,
);

router.get(
  '/',
  auth(USER_ROLE?.dealer),
  dealerContactController.getAlldealerContact,
);

export const dealerContactRoutes = router;
