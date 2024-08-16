import express from 'express'
import AuthLocalController from '../../controllers/AuthLocalController'
import asyncHandler from '../../middlewares/asyncHandler'
import verifyToken from '../../middlewares/verifyToken'
import { loginAdmin, loginUser, isInactiveEmail } from '../../middlewares'
import resetPasswordValidations from '../../helpers/validators/resetPassword'

const router = express.Router()

router.post('/signup', asyncHandler(AuthLocalController.signup))
router.post(
  '/register/email',
  isInactiveEmail,
  asyncHandler(AuthLocalController.registerEmail)
)
router.post(
  '/register/verify-otp',
  asyncHandler(AuthLocalController.registerVerify) // check time validity
)
router.post(
  '/register/complete',
  asyncHandler(AuthLocalController.registerComplete)
)

// user login route
router.post('/login/public', loginUser, AuthLocalController.login)
router.post('/login/admin', loginAdmin, AuthLocalController.login)
router.get('/user', verifyToken, AuthLocalController.getUser)

// Reset password
router.post(
  '/reset-password', 
  resetPasswordValidations.resetPassword, 
  asyncHandler(AuthLocalController.initiatePasswordReset)
);
router.post(
  '/reset-password/verify-reset-code', 
  resetPasswordValidations.verifyResetCode, 
  asyncHandler(AuthLocalController.verifyResetCode)
);
router.patch(
  '/reset-password/update-password',
  // resetPasswordValidations.updatePassword,
  asyncHandler(AuthLocalController.updatePassword)
);

// router.get('/reset/:token', asyncHandler(AuthLocalController.reset));
// router.post('/reset', asyncHandler(AuthLocalController.sendEmail));
// router.patch('/reset/:token', asyncHandler(AuthLocalController.updatePassword));

export default router
