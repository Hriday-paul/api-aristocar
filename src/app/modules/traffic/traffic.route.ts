import { Router } from 'express';
import { trafficController } from './traffic.controller';

const router = Router();

router.get('/', trafficController.getAllSTraffic);
router.get('/day/:date', trafficController.getTrafficForDay);
router.get('/month/:year/:month', trafficController.getTrafficForMonth);
router.get('/year/:year', trafficController.getTrafficForYear);

export const trafficRoutes = router;
