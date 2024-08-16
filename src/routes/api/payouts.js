import express from 'express';
import PayoutMethodsControllers from '../../controllers/PayoutMethodsControllers';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, isAdmin } from '../../middlewares'

const router = express.Router();

router.post('/', verifyToken, asyncHandler(PayoutMethodsControllers.createPayoutMethod));
router.get('/user', verifyToken, asyncHandler(PayoutMethodsControllers.getPayoutMethod));
router.get('/admin', verifyToken, isAdmin, asyncHandler(PayoutMethodsControllers.getAllPayoutMethodsByAdmin));

export default router;