import express from 'express';
import PriceListController from '../../controllers/PriceListController';
import asyncHandler from '../../middlewares/asyncHandler';
import { isAdmin, verifyToken } from '../../middlewares';
// import priceListValidations from '../../helpers/validators/priceListValidate';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  isAdmin,
  // priceListValidations.priceListCreation,
  asyncHandler(PriceListController.createPriceList),
);
router.get('/', verifyToken, asyncHandler(PriceListController.getPriceLists));
router.get('/:id', asyncHandler(PriceListController.getPriceList));
router.get(
  '/company/:id',
  verifyToken,
  asyncHandler(PriceListController.getPriceListsByCompany),
);
router.get(
  '/company/:companyId/carType/:carTypeId',
  verifyToken,
  asyncHandler(PriceListController.getPriceListsByCompanyAndCarType),
);

export default router;
