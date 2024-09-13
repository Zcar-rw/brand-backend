import express from 'express';
import InquiryController from '../../controllers/InquiryController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, isAdmin, isCompanyAdmin } from '../../middlewares';
import inquiryValidations from '../../helpers/validators/inquiryValidate';

const router = express.Router();

router.post(
  '/create',
  inquiryValidations.inquiryCreation,
  asyncHandler(InquiryController.createInquiry),
);
router.get(
  '/admin',
  verifyToken,
  isAdmin,
  asyncHandler(InquiryController.fetchInquiries),
);
router.get(
  '/company',
  verifyToken,
  isCompanyAdmin,
  asyncHandler(InquiryController.fetchCompanyInquiries),
);

export default router;
