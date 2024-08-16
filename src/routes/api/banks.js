import express from 'express';
import BanksController from '../../controllers/BanksController';
import asyncHandler from '../../middlewares/asyncHandler';

const router = express.Router();

router.get('/', asyncHandler(BanksController.getAllBanks));

export default router;
