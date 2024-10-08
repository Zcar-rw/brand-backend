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

export default router;
