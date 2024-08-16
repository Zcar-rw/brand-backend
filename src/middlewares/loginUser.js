import status from '../config/status'
import _ from 'lodash'
import { FindOne } from '../database/queries'

export default async (req, res, next) => {
  console.log('user', req.body.email)
  const user = await FindOne('User', {
    email: req.body.email,
    status: 'active',
  })

  if (_.isEmpty(user)) {
    return res.status(status.UNAUTHORIZED).json({
      error: `Account with '${req.body.email}' email do not exist`,
    })
  }
  req.auth = user.get()
  next()
}
