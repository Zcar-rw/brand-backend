import status from '../config/status';
import { FindOne } from '../database/queries';

export default async (req, res, next) => {
  const { userId } = req.body;
  const profile = await FindOne('User', { id: userId });

  if (profile && profile.driver === 'approved') {
    next();
  } else {
    return res.status(status.UNAUTHORIZED).json({
      error: `Only Driver is allowed to perform this action`,
    });
  }
};
