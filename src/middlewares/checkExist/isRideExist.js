import 'dotenv/config'
import status from '../../config/status'
import db from '../../database/models'
import { FindOne } from '../../database/queries'

export default async (req, res, next) => {
  const where = {
    id: req.params.rideId,
  }
  const include = [
    {
      model: db['User'],
      as: 'user',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: db['Profile'],
        as: 'user',
      },
    },
    {
      model: db.Car,
      as: 'car',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  ]

  const ride = await FindOne('Ride', where, include)
  if (Object.keys(ride).length === 0) {
    return res.status(status.NOT_FOUND).send({
      error: 'Ride not found',
    })
  }
  req.ride = ride
  return next()
}
