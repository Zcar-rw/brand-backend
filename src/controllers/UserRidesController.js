/* eslint-disable require-jsdoc */
import 'dotenv/config';
import status from '../config/status';
import db from '../database/models';
import { FindAll, FindOne, FindAndCount } from '../database/queries';
import {
  UserRideService, 
  TransitWalletServices, 
  RideService,
  NotificationServices
} from '../services'
import { Op } from 'sequelize';
import * as helper from '../helpers'

export default class UserRides {
  static async getAllUserRides(req, res) {
    try {
      const response = await FindAll('UserRide');
      return res.status(status.OK).send({
        response,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      });
    }
  }

  static async getAllUserRidesRequests(req, res){
    const {id} = req.user

    const {response} = await UserRideService.ListAllRequests(id)
    if(response.length === 0){
      return res.status(status.OK).json({
        message: 'Pending requests not found at this moment',
      })
    }
    return res.status(status.OK).json({
      message: 'Pending requests',
      response
    })
  }

  static async rejectRequestByDriver(req, res){
    try {
      const {userRideId} = req.params
      const {id: userId} = req.user
      
      const response = await UserRideService.RejectARequest(userId, userRideId)
      if(!response){
        return res.status(status.NOT_FOUND).json({
          message: 'Ride request not found'
        })
      }

       // # Notify Rider that was requesting to join a ride.
       await NotificationServices.sendPushNotification(
        [response.userId],
        'Driver has rejected your request of joining a ride.',
        'Join Request Rejected'
      );
      
      return res.status(status.OK).json({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).json({
        error: error.message
      })
    }
  }

  static async getAllUserRidesRequestsByRider(req, res){
    const {id} = req.user
    const condition = {
      userId: id,
    }
    const include = [
      {
        model: db.RidePickupStation,
        as: 'pickUp',
        include: [
          {
            model: db.Station,
            as: 'station',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
      
      {
        model: db.Ride,
        as: 'rides',
        attributes: { exclude: ['rideCode'] },
        include: [
          {
            model: db.RideDropoffStation,
            as: 'rideDropoff',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
              {
                model: db.Station,
                as: 'station',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
        ]
      },
      {
        model: db.Car,
        as: 'car',
        include: [
          {
            model: db.CarType,
            as: 'carType'
          }
        ]
      }
    ]

    try {
      const {response} = await FindAll('UserRide', condition, include)
      if (response.length > 0) {
        return res.status(status.OK).json({
          message: 'User Rides requests',
          response
        })
      } else {
        return res.status(status.NOT_FOUND).json({
          message: 'No User-rides found for this user, Please request to join a ride',
        })
      }
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message
      });
    }
  }

  

  static async cancelUserRideByRider(req, res){
    const {userRideId} = req.params
    const {id: userId, riderWalletId} = req.user
    const response = await UserRideService.cancelUserRide(userRideId, userId)
    if(!response){
      return res.status(status.NOT_FOUND).json({
        message: 'UserRide not found, Please request to join a ride!',
      })
    }

    if(response.status === 'cancelled'){
     
      await TransitWalletServices.refundMoney(riderWalletId,response.pickUp.price,userId, response.rideId)
      
      await RideService.updatingNumberOfSeats(response.rideId, 'increase')

      return res.status(status.OK).json({
        message: 'UserRide cancelled successfully',
        response,
      })
    }
    return res.status(status.OK).json({
      message: 'UserRide cancelling failed',
    })
  }

  static async getJoinedRides(req, res){
    const { id } = req.user

    const {response} = await UserRideService.ListJoinedRides(id)
    if(response.length === 0){
      return res.status(status.OK).json({
        message: 'No Joined rides found at this moment',
      })
    }
    return res.status(status.OK).json({
      message: 'Joined Rides',
      response
    })
  }

  static async getUpcomingRidesByRider(req, res){
    const { id } = req.user

    const { response } = await UserRideService.ListUpcomingRides(id)
    if(!response){
      return res.status(status.OK).json({
        message: 'No Upcoming ride found at this moment',
      })
    }
    return res.status(status.OK).json({
      message: 'Upcoming Ride',
      response,
    })
  }

  static async approveUserRideRequest(req, res){
    const { userRideId } = req.params

    const response = await UserRideService.changeToAcceptedStatus(
      userRideId,
      'accepted'
    )
    return res.status(status.OK).json({
      message: 'Approving Successfully!',
      response,
    })
  }

  static async getAcceptedUserRidesByAdmin(req, res){
    const {response} = await UserRideService.getAcceptedUserRidesByAdmin()
    if(response.length === 0){
      return res.status(status.OK).json({
        message: 'No Joined rides found at this moment',
      })
    }
    return res.status(status.OK).json({
      response
    })
  }
  
}
