import express from 'express'
import asyncHandler from '../../middlewares/asyncHandler'
import { isAdmin, verifyToken } from '../../middlewares'
import TransactionsController from '../../controllers/transactionsController'
import isDriver from '../../middlewares/isDriver'

const router = express.Router()

router.get('/rider', verifyToken, asyncHandler(TransactionsController.getTransactionsByRider))
router.get('/driver', verifyToken, isDriver, asyncHandler(TransactionsController.getTransactionsByDriver))
router.get('/admin', verifyToken, isAdmin, asyncHandler(TransactionsController.getTransactionsByAdmin))
router.get('/:id', verifyToken, asyncHandler(TransactionsController.FindOne))
router.get('/', verifyToken, asyncHandler(TransactionsController.FindAll))
router.get('/:userId/admin', verifyToken, isAdmin, asyncHandler(TransactionsController.getUserTransactions))

export default router;
