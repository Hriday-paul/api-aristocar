import { Router } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidation } from './user.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constants';
import parseData from '../../middleware/parseData';
import fileUpload from '../../middleware/fileUpload';
import multer, { memoryStorage } from 'multer';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create',
  upload.single('image'),
  parseData(),
  validateRequest(userValidation?.guestValidationSchema),
  userController.createUser,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  userController.updateUser,
);

router.patch(
  '/update-my-profile',
  auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.dealer),
  upload.single('image'),
  parseData(),
  userController.updateMyProfile,
);

router.get(
  '/by-year-month/:year',
  auth(USER_ROLE.admin, USER_ROLE.dealer),
  userController.getAllUserByYearandmonth,
);

router.get('/dealer', auth(USER_ROLE.admin), userController.getAllDealers);

router.get(
  '/dealer-requests',
  auth(USER_ROLE.admin),
  userController.getAllDealerRequests,
);

router.patch(
  '/dealer-requests/:dealerId',
  auth(USER_ROLE.admin),
  userController.handleDealerRequest,
);

router.delete(
  '/delete-my-account',
  auth(USER_ROLE.admin),
  userController.deleteMYAccount,
);
router.delete('/:id', auth(USER_ROLE.admin), userController.deleteUser);

router.get(
  '/my-profile',
  auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.dealer),
  userController.getMyProfile,
);

router.get('/:id', userController.getUserById);

router.get('/', auth(USER_ROLE.admin), userController.getAllUser);

export const userRoutes = router;
