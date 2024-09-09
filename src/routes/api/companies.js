import express from 'express';
import CompaniesController from '../../controllers/CompaniesController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, isAdmin } from '../../middlewares';

const router = express.Router();

router.get(
  '/',
  verifyToken,
  isAdmin,
  asyncHandler(CompaniesController.fetchCompanies),
);
router.get(
  '/:id/details',
  asyncHandler(CompaniesController.fetchCompanyDetails),
);

export default router;
