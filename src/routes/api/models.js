import express from 'express';
import CarModelController from '../../controllers/CarModelController';
import { isAdmin, verifyToken } from '../../middlewares';
import asyncHandler from '../../middlewares/asyncHandler';
import carModelValidations from '../../helpers/validators/carModelValidate';

const router = express.Router();

router.get(
  '/list',
  verifyToken,
  isAdmin,
  asyncHandler(CarModelController.getAllModels),
);
router.post(
  '/create',
  verifyToken,
  isAdmin,
  carModelValidations.carModelCreation,
  asyncHandler(CarModelController.createModel),
);
router.put(
  '/:id/update',
  verifyToken,
  isAdmin,
  asyncHandler(CarModelController.updateModel),
);
router.put(
  '/:id/status',
  verifyToken,
  isAdmin,
  asyncHandler(CarModelController.updateModelStatus),
);
// router.get(
//   '/:id/type',
//   verifyToken,
//   isAdmin,
//   asyncHandler(CarModelController.listModelsByCars),
// );

export default router;
