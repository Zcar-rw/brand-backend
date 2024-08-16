import express from 'express';
import MetaController from '../../controllers/MetaController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken, getCarIdBySlug } from '../../middlewares'

const router = express.Router();

router.post(
  '/:slug',
  verifyToken,
  getCarIdBySlug,
  asyncHandler(MetaController.createMeta)
);

export default router;
