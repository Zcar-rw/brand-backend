import status from '../config/status';
import { FindOne } from '../database/queries';

export default async (req, res, next) => {
  // find admin role
  const admin = await FindOne('Role', { name: 'admin' });
  const { role } = req.user;
  if (admin.id === role.id) {
    next();
  } else {
    return res.status(status.UNAUTHORIZED).json({
      error: `You are not authorized to perform this action`,
    });
  }
};
