import express from 'express';
import InsuranceController from '../../controllers/InsuranceController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, getCarIdBySlug } from '../../middlewares'

const router = express.Router();

router.post(
  '/:slug',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(InsuranceController.createInsurance)
);
router.get(
  '/:slug/active',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(InsuranceController.getActiveInsuranceByCar)
);

export default router;
