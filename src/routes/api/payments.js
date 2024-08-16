import express from 'express'
import PaymentController from '../../controllers/PaymentController'
import asyncHandler from '../../middlewares/asyncHandler'
import { verifyToken, isAdmin } from '../../middlewares'

const router = express.Router()

router.post('/', verifyToken, asyncHandler(PaymentController.processPayment))
router.get(
  '/admin',
  verifyToken,
  isAdmin,
  asyncHandler(PaymentController.getAdminPayments)
)
router.get(
  '/user',
  verifyToken,
  asyncHandler(PaymentController.getUserPayments)
)
// router.get(
//   '/tx/:id',
//   verifyToken,
//   asyncHandler(PaymentController.getPaymentDetails)
// )
router.get(
  '/tx/:transactionCode',
  verifyToken,
  isAdmin,
  asyncHandler(PaymentController.getPaymentDetailPerTransactionCode)
)

export default router
