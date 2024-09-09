import status from '../config/status';
import db from '../database/models';
import _ from 'lodash';
import { FindOne } from '../database/queries';

export default async (req, res, next) => {
  const include = [
    {
      model: db.Role,
      as: 'role',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  ];
  const user = await FindOne(
    'User',
    {
      email: req.body.email,
      status: 'active',
    },
    include,
  );
  if (_.isEmpty(user)) {
    return res.status(status.UNAUTHORIZED).json({
      error: `Account with '${req.body.email}' email do not exist`,
    });
  }
  req.auth = user.get();
  next();
};
