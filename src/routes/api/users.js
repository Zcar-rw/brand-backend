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
  '/register/client',
  userValidations.registerClientUser,
  asyncHandler(UserController.registerClientUser),
);

export default router;
