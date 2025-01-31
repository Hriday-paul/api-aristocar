import { Router } from 'express';
import { carsController } from './cars.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import validateRequest from '../../middleware/validateRequest';
import { updateCarSchema } from './cars.validation';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create',
  auth(USER_ROLE?.dealer),
  upload.fields([{ name: 'images', maxCount: 25 }]),
  parseData(),
  carsController.createcars,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE?.dealer, USER_ROLE.admin),
  upload.fields([
    { name: 'images', maxCount: 25 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  parseData(),
  carsController.updatecars,
);

router.delete(
  '/:id',
  auth(USER_ROLE?.dealer, USER_ROLE.admin),
  carsController.deletecars,
);

router.get('/bestdeal', carsController.getBestDeals);
router.get('/most-wanted', carsController.getMostWantedCars);
router.get(
  '/count',
  auth(USER_ROLE.dealer, USER_ROLE.admin),
  carsController.getcarsCountBycreatorId,
);

router.get(
  '/views-for-user',
  auth(USER_ROLE.dealer, USER_ROLE.admin),
  carsController.getUserCarViewsByYear,
);

router.get('/creator/:creatorID', carsController.getcarsByCreatorId);

router.get('/:id', carsController.getcarsById);

router.get('/', carsController.getAllcars);

export const carsRoutes = router;
