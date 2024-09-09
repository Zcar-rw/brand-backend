import express from 'express';
import RolesController from '../../controllers/RolesController';
// import { verifyToken } from '../../middlewares';

const router = express.Router();

router.get(
  '/all',
  // verifyToken,
  RolesController.getAllRoles,
);
// router.get(
//   '/user/:id',
//   // verifyToken,
//   RolesController.getUserRoles,
// );
// router.post('/user/create', verifyToken, RolesController.createUserRole);

export default router;
