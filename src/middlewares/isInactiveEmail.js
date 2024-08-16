import status from '../config/status';
import { FindOne } from '../database/queries';
/**
 * @param {object} req Request to the route
 * @param {object} res Response from server
 * @param {object} next middleware called to pass after success
 * @returns {object} returned response
 */
export default async (req, res, next) => {
  const user = await FindOne('User', {
    email: req.body.email,
  });
  if (user && user.status === 'active') {
    return res.status(status.EXIST).json({
      error: `Account with '${req.body.email}' is already active`,
    });
  }
  next();
};
