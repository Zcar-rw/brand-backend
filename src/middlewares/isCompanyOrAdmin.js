import status from '../config/status';
import { FindOne } from '../database/queries';

export default async (req, res, next) => {
  // find admin role
  // const admin = await FindOne('Role', { name: 'admin' });
  const response = await FindOne('Role', { type: 'company' });
  const { role } = req.user;
  if (response.id === role.id) {
    next();
  } else {
    return res.status(status.UNAUTHORIZED).json({
      error: `You are not authorized to perform this action`,
    });
  }
};
