import express from 'express'
import StationsController from '../../controllers/StationsController'
import asyncHandler from '../../middlewares/asyncHandler'
import { verifyToken, isAdmin } from '../../middlewares'

const router = express.Router()

// POPULAR PLACES
router.get(
  '/popular-places',
  verifyToken,
  asyncHandler(StationsController.fetchPopularPlaces)
)
router.post(
  '/popular-places',
  verifyToken,
  isAdmin,
  asyncHandler(StationsController.createPopularPlaces)
)
// MY PLACES
router.get('/search', asyncHandler(StationsController.SearchStations))
router.post('/', verifyToken, isAdmin, asyncHandler(StationsController.create))
router.get('/', asyncHandler(StationsController.findAll))
router.get('/:id/details', asyncHandler(StationsController.findOne))

export default router
