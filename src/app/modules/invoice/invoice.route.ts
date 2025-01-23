import { Router } from 'express';
import { invoiceController } from './invoice.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/create', auth(USER_ROLE.dealer), invoiceController.createInvoice);

router.patch('/update/:id', invoiceController.updateInvoice);

router.delete('/delete/:id', invoiceController.deleteInvoice);

router.get('/:id', invoiceController.getInvoiceById);

router.get('/', invoiceController.getAllInvoices);

export const invoiceRoutes = router;
