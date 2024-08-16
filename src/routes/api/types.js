import express from 'express';
import CarTypesController from '../../controllers/CarTypesController';
import asyncHandler from '../../middlewares/asyncHandler';

const router = express.Router();

router.get('/', asyncHandler(CarTypesController.getAllTypes));

export default router;
