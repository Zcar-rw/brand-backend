import express from 'express';
import InvoiceController from '../../controllers/TransactionController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken } from '../../middlewares';
// import invoiceValidations from '../../helpers/validators/invoiceValidate';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  // isAdmin,
  // invoiceValidations.invoiceCreation,
  asyncHandler(InvoiceController.createTransaction),
);
router.get('/', verifyToken, asyncHandler(InvoiceController.getTransactions));
router.get('/:id', asyncHandler(InvoiceController.getTransaction));
router.get(
  '/invoice/:id',
  asyncHandler(InvoiceController.getTransactionByInvoice),
);

export default router;
