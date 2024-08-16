import express from 'express'
import GalleriesController from '../../controllers/GalleriesController'
import asyncHandler from '../../middlewares/asyncHandler'
import { verifyToken, getCarIdBySlug } from '../../middlewares'

const router = express.Router()

router.post(
  '/:slug',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(GalleriesController.createGallery)
)
router.get(
  '/cars/:slug/details',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(GalleriesController.getGalleriesByCar)
)
router.get(
  '/cars/all',
  verifyToken,
  asyncHandler(GalleriesController.getAllGalleries)
)
router.delete(
  '/:id',
  verifyToken,
  asyncHandler(GalleriesController.deleteGallery)
)

export default router
