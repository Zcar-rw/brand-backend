import status from '../config/status';
import { FindOne } from '../database/queries';

export default async (req, res, next) => {
  // find admin role
  const user = await FindOne('Role', { name: 'admin' });
  const { role } = req.user;
    next();
  // if (user.id === role.id && user.name === 'company-owner') {
  //   next();
  // } else {
  //   return res.status(status.UNAUTHORIZED).json({
  //     error: `You are not authorized to perform this action`,
  //   });
  // }
};
