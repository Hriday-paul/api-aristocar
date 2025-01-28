import { Router } from 'express';
import { termsController } from './terms.controller';

const router = Router();

router.post('/create-terms', termsController.createterms);

router.patch('/update/:id', termsController.updateterms);

router.delete('/:id', termsController.deleteterms);

router.get('/:id', termsController.gettermsById);
router.get('/', termsController.getAllterms);

export const termsRoutes = router;
