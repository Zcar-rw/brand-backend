import express from 'express';
import InvoiceController from '../../controllers/InvoiceController';
import asyncHandler from '../../middlewares/asyncHandler';
import { isAdmin, verifyToken } from '../../middlewares';
// import invoiceValidations from '../../helpers/validators/invoiceValidate';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  isAdmin,
  // invoiceValidations.invoiceCreation,
  asyncHandler(InvoiceController.createInvoice),
);
router.get('/', verifyToken, asyncHandler(InvoiceController.getInvoices));
router.get('/:id', asyncHandler(InvoiceController.getInvoice));
router.patch(
  '/update/:id',
  verifyToken,
  asyncHandler(InvoiceController.updateInvoice),
);

export default router;
