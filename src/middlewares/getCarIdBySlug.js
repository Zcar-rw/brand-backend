import status from '../config/status'
import { FindOne } from '../database/queries'
import db from '../database/models'

export default async (req, res, next) => {
  const include = [
    {
      model: db['CarType'],
      as: 'carType',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
    {
      model: db['CarMake'],
      as: 'carMake',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
    {
      model: db['CarMeta'],
      as: 'carMeta',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
    {
      model: db['RentingInformation'],
      as: 'RentingInformation',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
    {
      model: db.Galleries,
      as: 'Galleries',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
    {
      model: db['Profile'],
      as: 'owner',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: db['User'],
        as: 'profile',
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    },
  ]
  const car = await FindOne('Car', { slug: req.params.slug }, include)
  if (car.errors || !Object.keys(car).length > 0) {
    return res.status(status.BAD_REQUEST).json({
      error: 'The car you are looking for can not be found at this moment.',
    })
  }
  req.car = car
  req.body.carId = car.id
  next()
}
