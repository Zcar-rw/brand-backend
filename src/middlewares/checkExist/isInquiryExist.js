import 'dotenv/config'
import status from '../../config/status'
import db from '../../database/models'
import { FindOne } from '../../database/queries'

export default async (req, res, next) => {
  const where = {
    id: req.params.id,
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
      model: db['Car'],
      as: 'car',
      include: [
        {
          model: db['CarMeta'],
          as: 'carMeta',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
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
      ],
    },
  ]
  const inquiry = await FindOne('Inquiry', where, include)
  if (Object.keys(inquiry).length === 0) {
    return res.status(status.NO_CONTENT).send({
      error: 'Inquiry not found',
    })
  }
  req.inquiry = inquiry
  return next()
}
