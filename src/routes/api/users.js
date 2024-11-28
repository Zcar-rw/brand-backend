import express from 'express';
import UserController from '../../controllers/UserController';
import { isAdmin, verifyToken, isCompanyAdmin } from '../../middlewares';
import asyncHandler from '../../middlewares/asyncHandler';
import userValidations from '../../helpers/validators/userValidate';

const router = express.Router();

router.get('/', verifyToken, isAdmin, UserController.getAllUsers);
router.get(
  '/company/:id/users',
  verifyToken,
  isCompanyAdmin,
  UserController.getAllCompanyUsers,
);
router.get(
  '/drivers',
  verifyToken,
  isAdmin,
  asyncHandler(UserController.getDrivers),
);
router.post(
  '/register/internal-user',
  verifyToken,
  isAdmin,
  userValidations.registerInternalUser,
  asyncHandler(UserController.registerInternalUser),
);
router.post(
  '/register/company-user',
  verifyToken,
  userValidations.registerCompanyUser,
  asyncHandler(UserController.registerCompanyUser),
);
router.post(
  '/register/client', // create corporate and individual user
  userValidations.registerClientUser,
  asyncHandler(UserController.registerClientUser),
);
router.put(
  '/:id/update/internal-user',
  verifyToken,
  isAdmin,
  asyncHandler(UserController.updateUser),
);
router.get(
  '/customers',
  verifyToken,
  asyncHandler(UserController.getCustomers),
);

export default router;
