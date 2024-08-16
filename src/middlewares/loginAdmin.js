import status from '../config/status'
import { FindOne } from '../database/queries'
/**
 * @param {object} req Request to the route
 * @param {object} res Response from server
 * @param {object} next middleware called to pass after success
 * @returns {object} returned response
 */
export default async (req, res, next) => {
    const user = await FindOne('User', {
      email: req.body.email,
      status: 'active',
      // role: 'admin',
    })
    if (!Object.keys(user).length) {
      return res.status(status.UNAUTHORIZED).json({
        error: `Account with '${req.body.email}' might not have the right permissions to login here`,
      })
    }
    req.auth = user.get()
    next()
}
