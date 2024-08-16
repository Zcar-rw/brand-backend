import express from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { isAdmin, verifyToken } from '../../middlewares';
import WalletController from '../../controllers/WalletsController';

const router = express.Router();

router.post('/', verifyToken, asyncHandler(WalletController.create));
router.post('/top-up/:id', verifyToken, asyncHandler(WalletController.topUp));
router.post('/pay/:id', verifyToken, asyncHandler(WalletController.pay));
router.get('/', verifyToken, isAdmin, asyncHandler(WalletController.findAll));
router.get('/:id', verifyToken, asyncHandler(WalletController.findOne));
router.post('/payout/:id', verifyToken, isAdmin, asyncHandler(WalletController.driverPayout));

export default router;
