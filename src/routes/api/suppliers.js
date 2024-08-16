import express from 'express';
import SuppliersController from '../../controllers/SuppliersController';
import asyncHandler from '../../middlewares/asyncHandler';
// import { verifyToken } from '../../middlewares';
import supplierValidations from '../../helpers/validators/supplierValidate';

const router = express.Router();

router.post(
  '/create',
  // verifyToken,
  supplierValidations.supplierCreation,
  asyncHandler(SuppliersController.createSupplier)
);
router.get('/', asyncHandler(SuppliersController.fetchSuppliers));

export default router;
