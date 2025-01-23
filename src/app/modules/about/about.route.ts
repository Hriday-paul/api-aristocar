import { Router } from 'express';
import { aboutController } from './about.controller';

const router = Router();

// Create About
router.post('/create-about', aboutController.createabout);

// Update About
router.patch('/update/:id', aboutController.updateabout);

// Delete About
// router.delete('/:id', aboutController.deleteabout);

// Get About by ID
router.get('/:id', aboutController.getaboutById);

// Get All About
// router.get('/', aboutController.getAllabout);

export const aboutRoutes = router;
