import express from 'express'
import asyncHandler from '../../middlewares/asyncHandler'
import { verifyToken } from '../../middlewares'
import RidesController from '../../controllers/RidesController'

import isRideExist from '../../middlewares/checkExist/isRideExist'
import isDriver from '../../middlewares/isDriver'
import isAdmin from '../../middlewares/isAdmin'

const router = express.Router()

router.post(
  '/create',
  verifyToken,
  isDriver,
  asyncHandler(RidesController.createRide)
)
router.post(
  '/:carId',
  verifyToken,
  asyncHandler(RidesController.createRideByDriver)
  )
  router.post(
  '/ride-routes/:rideId',
  verifyToken,
  asyncHandler(RidesController.createRidesRoutes)
)
router.get(
  '/driver',
  verifyToken,
  isDriver,
  asyncHandler(RidesController.getRidesByDriver)
)
router.get(
  '/driver/upcoming',
  verifyToken,
  isDriver,
  asyncHandler(RidesController.getUpcomingRidesDriver)
)

router.get(
  '/admin',
  verifyToken,
  isAdmin,
  asyncHandler(RidesController.getRidesByAdmin)
)
router.get(
  '/detail/:rideId/driver',
  verifyToken,
  isDriver,
  isRideExist,
  asyncHandler(RidesController.getRideDetailByDriver)
)
router.get(
  '/detail/:rideId/rider',
  verifyToken,
  isRideExist,
  asyncHandler(RidesController.getRideDetailByRider)
)
router.get(
  '/detail/:rideId/admin',
  verifyToken,
  isRideExist,
  isAdmin,
  asyncHandler(RidesController.getRideDetailByAdmin)
)
router.put(
  '/:rideId',
  verifyToken,
  asyncHandler(RidesController.updateRideByDriver)
)
router.get('/rider', verifyToken, asyncHandler(RidesController.getRidesByUser))
router.get('/search', verifyToken, asyncHandler(RidesController.searchRides))
router.post('/:rideId/create/complete', verifyToken, isDriver, isRideExist, asyncHandler(RidesController.CompleteRideInfoByDriver))
router.post('/:rideId/request/ask/:pickupId', verifyToken, isRideExist, asyncHandler(RidesController.RequestToJoinRide))
router.post('/:rideId/request/approve/:userRideId', verifyToken, isRideExist, asyncHandler(RidesController.ApproveJoiningRideByDriver))
router.post('/:rideId/pay-ride', verifyToken, isRideExist, asyncHandler(RidesController.payRide))
router.post('/:rideId/go/start', verifyToken, isDriver, isRideExist, asyncHandler(RidesController.startRideByDriver))
router.post('/:rideId/go/entercar/rider', verifyToken, isRideExist, asyncHandler(RidesController.joinCarByRider))
router.post('/:rideId/go/complete', verifyToken, isRideExist, asyncHandler(RidesController.CompleteRideGoByDriver))
router.get('/:userId/admin', verifyToken, isAdmin, asyncHandler(RidesController.getRidesOfUserByAdmin))
router.patch('/:rideId/cancel/driver', verifyToken, isDriver, isRideExist, asyncHandler(RidesController.cancelRideByDriver))
router.get('/shareable/public/:shareId', asyncHandler(RidesController.CheckRideByShareId))

export default router
