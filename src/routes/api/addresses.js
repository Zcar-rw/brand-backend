import express from 'express';
import AddressController from '../../controllers/AddressController';
import { verifyToken } from '../../middlewares'
import asyncHandler from '../../middlewares/asyncHandler';
import isAddressExist from '../../middlewares/checkExist/isAddressExist';

const router = express.Router();

router.post('/', verifyToken, asyncHandler(AddressController.createAddress));
router.post('/set-default/:id', verifyToken, asyncHandler(AddressController.setDefaultAddress));
router.get('/', asyncHandler(AddressController.getAllAddresses));
router.get('/user', verifyToken, asyncHandler(AddressController.getAddressByUser));
router.get('/default',verifyToken, asyncHandler(AddressController.getDefaultAddress));
router.get('/:id', verifyToken, isAddressExist, asyncHandler(AddressController.getAddressById));
router.put('/:id', verifyToken, isAddressExist, asyncHandler(AddressController.updateAddress));
router.delete('/:id', verifyToken, isAddressExist, asyncHandler(AddressController.deleteAddress));

export default router;
