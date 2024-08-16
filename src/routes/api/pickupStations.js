import express from 'express'
import PickupControllers from '../../controllers/RideStationController'
import asyncHandler from '../../middlewares/asyncHandler'
import { verifyToken } from '../../middlewares'
import isRideExist from '../../middlewares/checkExist/isRideExist'

const router = express.Router()

router.get(
  '/:rideId',
  isRideExist,
  asyncHandler(PickupControllers.getAllRidePickupStations)
)
router.post(
  '/:rideId',
  verifyToken,
  isRideExist,
  asyncHandler(PickupControllers.createRidePickupStation)
)
router.post(
  '/:rideId/pickin',
  verifyToken,
  isRideExist,
  asyncHandler(PickupControllers.createRidePickInStation)
)

export default router
