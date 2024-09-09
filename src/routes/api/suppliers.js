import express from 'express';
import SuppliersController from '../../controllers/SuppliersController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, isAdmin } from '../../middlewares';
import supplierValidations from '../../helpers/validators/supplierValidate';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  isAdmin,
  supplierValidations.supplierCreation,
  asyncHandler(SuppliersController.createSupplier),
);
router.get(
  '/',
  verifyToken,
  // isAdmin,
  asyncHandler(SuppliersController.fetchSuppliers),
);
router.get(
  '/:id/details',
  asyncHandler(SuppliersController.fetchSupplierDetails),
);

export default router;
