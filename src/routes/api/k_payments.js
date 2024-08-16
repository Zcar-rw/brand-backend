import express from 'express'
import asyncHandler from '../../middlewares/asyncHandler'
import KPaymentsController from '../../controllers/Reach/KPay/KPaymentsController'
import verifyToken from '../../middlewares/verifyToken'
import { ALLOWED_CALLBACK_URLS } from '../../helpers'
const router = express.Router()

router.post('/', verifyToken, asyncHandler(KPaymentsController.TopUp))
router.post('/callback', ALLOWED_CALLBACK_URLS, asyncHandler(KPaymentsController.TopUpCallBack))

export default router
