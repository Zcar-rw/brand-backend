import status from '../config/status';
import * as helper from '../helpers';
import db from '../database/models';
import { FindOne } from '../database/queries';

export default async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader ? authHeader.split(' ')[1] : null;

  if (token) {
    const decodedToken = helper.token.decode(token);

    if (decodedToken.errors || !decodedToken) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: 'Sorry, we fail to authenticate you.' });
    }

    const include = [];

    const user = await FindOne('User', { id: decodedToken.id }, include);
    const wallet = await FindOne('RiderWallet', { userId: user.id });
    const driverWallet = await FindOne('DriverWallet', { userId: user.id });

    if (user) {
      delete user.password;
      req.user = user.get();
      req.body.userId = req.user.id;
      req.user.riderWalletId = wallet.id;
      req.user.driverWalletId = driverWallet.id;
    }
  } else {
    // If there's no token, set req.user's id to null
    req.user = { id: null };
  }

  return next();
};
