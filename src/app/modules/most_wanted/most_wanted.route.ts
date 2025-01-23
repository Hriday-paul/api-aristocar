import { Router } from 'express';
import { mostWantedController } from './most_wanted.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  mostWantedController.createMostWanted,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  mostWantedController.updateMostWanted,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  mostWantedController.deleteMostWanted,
);
router.get('/:id', mostWantedController.getMostWantedById);
router.get('/', mostWantedController.getAllMostWanted);

export const most_wantedRoutes = router;
