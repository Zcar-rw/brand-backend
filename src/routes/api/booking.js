import express from 'express';
import BookingController from '../../controllers/BookingController';
import asyncHandler from '../../middlewares/asyncHandler';
import { isAdmin, verifyToken } from '../../middlewares';
import bookingValidations from '../../helpers/validators/bookingValidate';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  bookingValidations.bookingCreation,
  asyncHandler(BookingController.createBooking),
);
router.post(
  '/create/multiple',
  verifyToken,
  bookingValidations.multipleBookingCreation,
  bookingValidations.bookingInfoCreation,
  asyncHandler(BookingController.createMultipleBookings),
);
router.get('/', verifyToken, asyncHandler(BookingController.getBookings));
router.get('/:id', asyncHandler(BookingController.getBooking));
router.get(
  '/customer/:id',
  verifyToken,
  asyncHandler(BookingController.getBookingsByCustomer),
);
router.get(
  '/company/:id',
  verifyToken,
  asyncHandler(BookingController.getBookingByCompany),
);
router.patch(
  '/:id/update',
  verifyToken,
  bookingValidations.bookingStatusUpdate,
  asyncHandler(BookingController.updateBooking),
);
router.patch(
  '/:id/admin-review',
  verifyToken,
  isAdmin,
  asyncHandler(BookingController.adminReviewBooking),
);
router.patch(
  '/:id/client-review',
  verifyToken,
  asyncHandler(BookingController.clientReviewBooking),
);

export default router;
