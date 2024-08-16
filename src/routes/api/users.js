import express from 'express'
import UserController from '../../controllers/UserController'
import { isAdmin, verifyToken } from '../../middlewares'
import asyncHandler from '../../middlewares/asyncHandler'

const router = express.Router()

router.get(
  '/',
  // verifyToken,
  UserController.getAllUsers
)
router.put('/user/become-a-driver', verifyToken, UserController.BecomeADriver)
router.get(
  '/:userId/admin',
  verifyToken,
  isAdmin,
  UserController.getUserProfile
)
router.patch(
  '/:userId/update-user-info',
  verifyToken,
  isAdmin,
  UserController.updateUserRoleByAdmin
)

export default router
