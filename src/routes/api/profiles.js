import express from 'express';
import ProfilesController from '../../controllers/ProfilesController';
import asyncHandler from '../../middlewares/asyncHandler';
import { verifyToken } from '../../middlewares'

const router = express.Router();

router.post('/', verifyToken, asyncHandler(ProfilesController.createProfile));
router.get('/', verifyToken, asyncHandler(ProfilesController.getAllProfiles));
router.get(
  '/search',
  verifyToken,
  asyncHandler(ProfilesController.searchProfiles)
);
router.get('/:id', verifyToken, asyncHandler(ProfilesController.getOneProfile));
router.patch('/update', verifyToken, asyncHandler(ProfilesController.updateProfile));

export default router;
