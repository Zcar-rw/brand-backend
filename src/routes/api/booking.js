import express from 'express'
import BookingController from '../../controllers/BookingController'
import asyncHandler from '../../middlewares/asyncHandler'
import { verifyToken, isAdmin } from '../../middlewares'

const router = express.Router()

router.post('/', asyncHandler(BookingController.createBooking))
router.get(
  '/admin',
  verifyToken,
  isAdmin,
  asyncHandler(BookingController.getAllBookings)
)
router.get(
  '/user',
  verifyToken,
  asyncHandler(BookingController.getBookingsByUser)
)
router.get(
  '/admin/:id/details',
  verifyToken,
  asyncHandler(BookingController.getBookingDetails)
)
router.get(
  '/user/:id/details',
  verifyToken,
  asyncHandler(BookingController.getBookingDetailsByUser)
)

export default router
