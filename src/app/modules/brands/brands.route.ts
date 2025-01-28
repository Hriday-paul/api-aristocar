import { Router } from 'express';
import { brandsController } from './brands.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-brands',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  brandsController.createbrands,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  brandsController.updatebrands,
);

router.get('/homebrand', brandsController.getHomeShow);
router.delete('/:id', brandsController.deletebrands);

router.get('/:id', auth(USER_ROLE.admin), brandsController.getbrandsById);
router.get('/', brandsController.getAllbrands);

export const brandsRoutes = router;
