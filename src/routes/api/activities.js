import express from 'express'
import asyncHandler from '../../middlewares/asyncHandler'
import { isAdmin, verifyToken } from '../../middlewares'
import ActivitiesController from '../../controllers/ActivitiesController'
import isDriver from '../../middlewares/isDriver'

const router = express.Router()

router.get('/admin', verifyToken, isAdmin, asyncHandler(ActivitiesController.getActivitiesByAdmin))

export default router;
