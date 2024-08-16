import express from 'express'
import GeneralInquiryController from '../../controllers/GeneralInquiryController'
import asyncHandler from '../../middlewares/asyncHandler'

const router = express.Router()

router.post('/', asyncHandler(GeneralInquiryController.createInquiry))

export default router
