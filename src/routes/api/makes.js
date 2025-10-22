import express from 'express';
import CarMakesController from '../../controllers/CarMakesController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, isAdmin } from '../../middlewares';
import carMakeValidations from '../../helpers/validators/carMakeValidate';

const router = express.Router();

router.get('/', asyncHandler(CarMakesController.getAllMakes));

router.post(
	'/create',
	verifyToken,
	isAdmin,
	carMakeValidations.carMakeCreation,
	asyncHandler(CarMakesController.createMake)
);

export default router;
