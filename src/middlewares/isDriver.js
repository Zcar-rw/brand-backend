import status from '../config/status';
import db from '../database/models';
import { FindOne } from '../database/queries';

export default async (req, res, next) => {
  const { userId } = req.body;
  const user = await FindOne('User', { id: userId }, [
    {
      model: db.Role,
      as: 'role',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  ]);
  if (!user || Object.keys(user)?.length === 0) {
    return res.status(status.BAD_REQUEST).json({
      status: 'error',
      message: 'User not found',
    });
  }
  if (user.role.name === 'driver') {
    next();
  } else {
    return res.status(status.UNAUTHORIZED).json({
      error: `Only Driver is allowed to perform this action`,
    });
  }
};
