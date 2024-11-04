import status from '../config/status';
import db from '../database/models';
import _ from 'lodash';
import { FindAll, FindOne } from '../database/queries';

export default async (req, res, next) => {
  try {
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
        // verified: true
      },
      include,
    );
    if (!_.isEmpty(user)) {
      req.auth = user.get();
      next();
    } else {
      return res.status(status.UNAUTHORIZED).json({
        error: `Account with '${req.body.email}' email do not exist`,
      });
    }
  } catch (error) {
    return res.status(status.UNAUTHORIZED).json({
      error: `Account with '${req.body.email}' email do not exist`,
    });
  }
};
