import express from 'express'
import OwnerController from '../../controllers/OwnerController'
import asyncHandler from '../../middlewares/asyncHandler'
import verifyToken from '../../middlewares/verifyToken'

const router = express.Router()

// Public: Register a new owner (creates User + Owner)
router.post('/register', asyncHandler(OwnerController.registerOwner))

// Create or update current user's owner profile
router.post('/', verifyToken, asyncHandler(OwnerController.upsertMyOwner))

// Get current user's owner profile
router.get('/me', verifyToken, asyncHandler(OwnerController.getMyOwner))

// Get cars for current owner
router.get('/me/cars', verifyToken, asyncHandler(OwnerController.getMyCars))

// Get bookings for current owner (bookings created by this user)
router.get('/me/bookings', verifyToken, asyncHandler(OwnerController.getMyBookings))

// Admin: Get all owners
router.get('/', verifyToken, asyncHandler(OwnerController.getAllOwners))

export default router
