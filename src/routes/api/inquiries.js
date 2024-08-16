import express from 'express';
import InquiryController from '../../controllers/InquiryController';
import asyncHandler from '../../middlewares/asyncHandler';
import isInquiryExist from '../../middlewares/checkExist/isInquiryExist';
import { verifyToken, isAdmin, getCarIdBySlug } from '../../middlewares'

const router = express.Router();

router.get('/', verifyToken, asyncHandler(InquiryController.getAllInquiries));
router.get(
  '/user/:id/details',
  verifyToken,
  isInquiryExist,
  asyncHandler(InquiryController.getInquiryById)
);
router.get(
  '/user/latest',
  verifyToken,
  asyncHandler(InquiryController.getInquiriesByUser)
);
router.get(
  '/admin',
  verifyToken,
  isAdmin,
  asyncHandler(InquiryController.getAllInquiries)
);
router.get(
  '/admin/:id',
  verifyToken,
  isAdmin,
  isInquiryExist,
  asyncHandler(InquiryController.getInquiryById)
);
router.post(
  '/admin/:id/approve',
  verifyToken,
  isAdmin,
  isInquiryExist,
  asyncHandler(InquiryController.approveInquiryById)
);
router.post(
  '/:slug',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(InquiryController.createInquiry)
);
router.put(
  '/:id',
  verifyToken,
  isInquiryExist,
  asyncHandler(InquiryController.updateInquiry)
);

// general inquiries
router.post(
  '/general-inquiries',
  asyncHandler(InquiryController.createInquiry)
);
router.get(
  '/general-inquiries',
  verifyToken,
  isAdmin,
  asyncHandler(InquiryController.getAllInquiries)
);

export default router;
