import express from 'express'
import asyncHandler from '../../middlewares/asyncHandler'
import { isAdmin, verifyToken, allowAny } from '../../middlewares'
import ContactUsController from '../../controllers/ContactUsController'

const router = express.Router()

router.post('/', allowAny, asyncHandler(ContactUsController.createMessage))
router.get('/', verifyToken, isAdmin, asyncHandler(ContactUsController.getAllMessagesByAdmin))

export default router;
