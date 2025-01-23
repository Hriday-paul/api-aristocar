import { Router } from 'express';
import { contactController } from './contact.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-contact',
  auth(USER_ROLE.dealer, USER_ROLE.user),
  contactController.createcontact,
);

// router.patch('/update/:id', contactController.updatecontact);

// router.delete('/:id', contactController.deletecontact);
// router.get('/user/:id', contactController.getcontactByUserId);
router.get('/:id', contactController.getcontactById);
router.get('/', contactController.getAllcontact);

export const contactRoutes = router;
