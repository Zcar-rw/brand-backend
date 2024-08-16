import 'dotenv/config'
import * as helper from '../helpers'
import status from '../config/status'
import { FindAndCount, FindOne } from '../database/queries'
import db from '../database/models'
import { DriverServices } from '../services'
import { ActivitiesServices } from '../services'
// /**
//  * A class to handle user local authentication
//  */
export default class UserController {
  static async getAllUsers(req, res) {
    let { page, limit } = req.query
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      })
    }

    limit = limit || 5
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit

    const include = [
      {
        model: db.Profile,
        as: 'user',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ]
    const condition = {}
    const { response, meta } = await FindAndCount(
      'User',
      condition,
      include,
      limit,
      offset
    )
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No booking found!',
      })
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Users can not be retrieved at this moment, try again later',
        })
      : res.status(status.OK).json({
          response,
          meta: helper.generator.meta(
            meta.count,
            limit,
            parseInt(page, 10) || 1
          ),
        })
  }

  static async BecomeADriver(req, res) {
    const { id: userId } = req.user
    const { drivingLicenseNumber, drivingLicenseExpireDate, ID } = req.body
    const data = {
      drivingLicenseNumber,
      drivingLicenseExpireDate,
      ID,
    }
    const response = await DriverServices.approveADriver(userId, data)
    if (!response) {
      return res.status(status.OK).json({
        message: 'You are already a driver!',
      })
    }

    //Note activity
    await ActivitiesServices.BecomeDriverActivity(userId)

    return res.status(status.OK).json({
      message: 'You have become a driver successfully!',
      response,
    })
  }

  static async getUserProfile(req, res) {
    const include = [
      {
        model: db.Profile,
        as: 'user',
      },
      {
        model: db.RiderWallet,
        as: 'riderwallet',
      },
      {
        model: db.DriverWallet,
        as: 'driverwallet',
      },
    ]

    const { userId } = req.params

    const condition = {
      id: userId,
    }

    const response = await FindOne('User', condition, include)
    if (!Object.keys(response).length) {
      return res.status(status.NOT_FOUND).json({
        error: 'User of this id not found',
      })
    }
    delete response.get().password
    return res.status(status.OK).json({
      response: response,
    })
  }

  static async updateUserRoleByAdmin(req, res){
    const { role, status: userStatus } = req.body
    const { userId } = req.params


    const allowedRoles = ['admin', 'super', 'normal']
    if(role && !allowedRoles.includes(role)){
      return res.status(status.BAD_REQUEST).json({
        error: `Role '${role}' is not allowed, only ${allowedRoles.join(',')} are allowed!`
      })
    }
    const allowedStatus = ['active', 'inactive']
    if( userStatus && !allowedStatus.includes(userStatus)){
      return res.status(status.BAD_REQUEST).json({
        error: `Status '${userStatus}' is not allowed, only ${allowedStatus.join(',')} are allowed!`
      })
    }

    const condition = {
      id: userId
    }

    const include = [
      {
        model: db.Profile,
        as: 'user',
      },
    ]

    const response = await FindOne('User', condition, include)
    if (!Object.keys(response).length) {
      return res.status(status.NOT_FOUND).json({
        error: 'User of this id not found',
      })
    }

    // check role and status existence
    if(role && userStatus && response.get().role === role && response.get().status === userStatus){
      return res.status(status.EXIST).json({
        error: `User already has this role '${role}' and status '${userStatus}'`
      })
    }
    else if(!userStatus && response.get().role === role ){
      return res.status(status.EXIST).json({
        error: `User already has this role '${role}'`
      })
    }
    else if(!role && response.get().status === userStatus ){
      return res.status(status.EXIST).json({
        error: `User already has this status '${userStatus}'`
      })
    }

    // update user info
    const updatedUserInfo = await response.update({
      role,
      status: userStatus
    })

    return res.status(status.OK).json({
      response: updatedUserInfo,
    })
  }
}
