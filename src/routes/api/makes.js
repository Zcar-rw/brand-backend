import express from 'express';
import CarMakesController from '../../controllers/CarMakesController';
import asyncHandler from '../../middlewares/asyncHandler';

const router = express.Router();

router.get('/', asyncHandler(CarMakesController.getAllMakes));

export default router;
