import status from '../config/status'
import * as helper from '../helpers'
import db from '../database/models'
import { FindOne } from '../database/queries'

export default async (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided!' })
  }
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ errors: { authentication: 'Please, login first.' } })
  }

  const decodedToken = helper.token.decode(token)

  if (decodedToken.errors || !decodedToken) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ error: 'Sorry, we fail to authenticate you.' })
  }
  const include = [
    {
      model: db.Profile,
      as: 'user',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  ]
  const user = await FindOne('User', { id: decodedToken.id }, include)

  
  // const wallet = await FindOne('RiderWallet', {
  //   userId: user.id,
  // })
  // const driverWallet = await FindOne('DriverWallet', {
  //   userId: user.id,
  // })
  console.log('user', user)
  if (user) {
    delete user.password
    req.user = user.get()
    req.body.userId = req.user.id
    // req.user.riderWalletId = wallet.id
    // req.user.driverWalletId = driverWallet.id
  } else {
    return res
      .status(status.ACCESS_DENIED)
      .json({ error: 'Sorry, we fail to authenticate you.' })
  }
  return next()
}
