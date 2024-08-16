import express from 'express'
import DropoffControllers from '../../controllers/RideStationController'
import asyncHandler from '../../middlewares/asyncHandler'
import { verifyToken } from '../../middlewares'
import isRideExist from '../../middlewares/checkExist/isRideExist'

const router = express.Router()

router.get('/:rideId', isRideExist,asyncHandler(DropoffControllers.getRideDropOffStation))
router.post('/:rideId', verifyToken, isRideExist,asyncHandler(DropoffControllers.createRideDropOffStation))

export default router
