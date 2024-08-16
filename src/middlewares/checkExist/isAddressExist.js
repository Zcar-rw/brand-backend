import 'dotenv/config';
import status from '../../config/status';
import { FindOne } from '../../database/queries';

export default async (req, res, next) => {
  const where = {
    id: req.params.id
  };
  const include = [];
  const address = await FindOne('Address', where, include);
  if (Object.keys(address).length === 0) {
    return res.status(status.BAD_REQUEST).send({
      error: 'Address not found',
    });
  }
  return next();
};
