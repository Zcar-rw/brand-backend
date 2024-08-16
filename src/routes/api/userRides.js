import express from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { isAdmin, verifyToken, isDriver } from '../../middlewares';
import UserRides from '../../controllers/UserRidesController';
// import isDriver from '../../middlewares/isDriver';

const router = express.Router();

router.get('/', verifyToken, isAdmin, asyncHandler(UserRides.getAllUserRides));
router.get('/pending-requests/driver', verifyToken, isDriver, asyncHandler(UserRides.getAllUserRidesRequests))
router.post('/:userRideId/reject/driver', verifyToken, isDriver, asyncHandler(UserRides.rejectRequestByDriver))
router.get('/rider', verifyToken, asyncHandler(UserRides.getAllUserRidesRequestsByRider))
router.post('/:userRideId/cancel/rider', verifyToken, asyncHandler(UserRides.cancelUserRideByRider) )
router.post('/:userRideId/approve/driver', verifyToken, isDriver, asyncHandler(UserRides.approveUserRideRequest))
router.get('/joined/rider', verifyToken, isDriver, asyncHandler(UserRides.getJoinedRides))
router.get('/joined/admin', verifyToken, isAdmin, asyncHandler(UserRides.getAcceptedUserRidesByAdmin))
router.get('/rider/upcoming', verifyToken, asyncHandler(UserRides.getUpcomingRidesByRider))

export default router;
