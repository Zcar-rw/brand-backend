import express from 'express';
import CarsController from '../../controllers/CarsController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, isAdmin, getCarIdBySlug, getCarById } from '../../middlewares';
import carValidations from '../../helpers/validators/carValidate';

const router = express.Router();

// router.post('/', verifyToken, asyncHandler(CarsController.createCar));
router.post(
  '/create',
  verifyToken,
  carValidations.carCreation,
  asyncHandler(CarsController.createCar),
);
router.get('/search', asyncHandler(CarsController.searchCars));
router.get(
  '/view/admin/:slug',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(CarsController.getAdminOneCar),
);
router.get(
  '/view/public/:carId',
  getCarById,
  asyncHandler(CarsController.getOneCar),
);
router.patch(
  '/:slug',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(CarsController.updateCar),
);
router.get(
  '/admin',
  verifyToken,
  isAdmin,
  asyncHandler(CarsController.getAdminsCars),
);
router.get(
  '/public',
  // verifyToken,
  asyncHandler(CarsController.getPublicCars),
);
router.get(
  '/owner/:id',
  verifyToken,
  asyncHandler(CarsController.getCarsByOwner),
);
router.post(
  '/admin/:slug/publish',
  verifyToken,
  isAdmin,
  getCarIdBySlug,
  asyncHandler(CarsController.adminPublishCar),
);
router.post(
  '/admin/:slug/decline',
  verifyToken,
  isAdmin,
  getCarIdBySlug,
  asyncHandler(CarsController.adminDeclineCar),
);
router.get(
  '/:userId/admin',
  verifyToken,
  isAdmin,
  asyncHandler(CarsController.getUserCars),
);
router.get(
  '/:supplierId/supplier',
  verifyToken,
  asyncHandler(CarsController.getCarsBySupplier),
)

export default router;
