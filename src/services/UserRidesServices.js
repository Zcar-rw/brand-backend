import { FindAll, Create, FindOne, Update } from '../database/queries'
import 'dotenv/config'
import { Op } from 'sequelize'
import db from '../database/models'
import RiderWalletServices from './RiderWalletServices'
import TransitWalletServices from './TransitWalletServices'
import * as helper from '../helpers'
import RideService from './RideServices'

export default class UserRideService{
    static async changeToAcceptedStatus(id, newStatus){
        const data ={
            status: newStatus,
            joinedTime: Date.now()
        }
        const condition = {
            id,
            status: {[Op.not]: 'accepted'}
        }
        const response = await Update('UserRide', data, condition)
        return response || {}
    }

    static async updateStatus(id, newStatus){
        const response = await FindOne('UserRide', {userId, rideId})
        await response.update({
            status: newStatus
        })
    }

    static async getOneUserRide(id){
        const response = await FindOne('UserRide', {id})
        return response
    }

    static async getUserRideId(userId, rideId){
        const response = await FindOne('UserRide', {userId, rideId})
        return {userRideId: response.id}
    }

    static async ListAllRequests(userId){
        const condition ={
            status: 'pending',
        }
        const include = [
            {
                model: db.Ride,
                as: 'rides',
                where: { userId }
            },
        ]

        const response = await FindAll('UserRide', condition, include)
        return response
    }

    static async RejectARequest(userId, userRideId){
        try {
            const condition = {
                id: userRideId,
                status: 'pending'
            }
            const include = [
                {
                    model: db.Ride,
                    as: 'riders',
                    where: { userId }
                },
                {
                    model: db.User,
                    as: 'user',
                    include: [
                        {
                            model: db.RiderWallet,
                            as: 'riderwallet'
                        },
                        {
                        model: db.TransitWallet,
                        as: 'transitwallet',
                        }
                    ]
                }
            ]
            const response = await FindOne('UserRide', condition)
            // when userRide is not on my ride
            if(!Object.keys(response).length){
                return false
            }

            const riderWallet = await RiderWalletServices.getRiderWalletByUser(response.userId)
        
            const transitWallet = await TransitWalletServices.getTransitWallet(response.userId, response.rideId, 'credited')
        
            //2 return back fund to rider wallet
            if(transitWallet && riderWallet){
                // credit rider wallet
                const updated = await riderWallet.update({
                    balance: riderWallet.balance + transitWallet.amount
                })
                //3 debit transit wallet
                const debitTransit = await Create('TransitWallet', {
                    userId: transitWallet.userId,
                    amount: transitWallet.amount,
                    type: 'transit',
                    method: 'debited'
                })

                //4 record a transaction
                const schema = helper.schema.rideTransactionSchema('ride')
                const transaction =  await Create('Transactions', {
                    userId: transitWallet.userId,
                    rideId: response.rideId,
                    riderWalletId: riderWallet.id,
                    transitWalletId: debitTransit.id,
                    amount: transitWallet.amount,
                    ...schema
                })

                // change status of user ride to rejected
                if(updated && debitTransit && transaction){
                    await response.update({
                        status: 'rejected',
                        rejectedTime: Date.now()
                    })
                }
            }
            return response

        } catch (error) {
            return error
        }
    }

    static async cancelUserRide(id, _userId){
        try {
          const condition = {
            id,
            userId: _userId,
            status: 'pending'
          }
          const include = [
            {
              model: db.RidePickupStation,
              as: 'pickUp'
            }
          ]
          const response = await FindOne('UserRide', condition, include)
          if(!Object.keys(response).length){
            return false
          }

          // change status of a userRide
          await response.update({
            status: 'cancelled',
            cancelledTime: Date.now()
          })
  
          return response
          
        } catch (error) {
          console.log(error)
        }
        
      }

    static async listUserRides(userId, rideId){
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
        ]
        const response = await FindOne('UserRide', {userId, rideId}, include)
        return Object.keys(response).length > 0 ? response : undefined
    }

    static async ListJoinedRides(userId){
        const condition = {
            status: 'accepted',
        }

        const include = [
            {
                model: db.Ride,
                as: 'rides',
                where: { userId }
            },
        ]

        const response = await FindAll('UserRide', condition, include)
        return response
    }

    static async getAcceptedUserRidesByAdmin(){
        const condition = {
            status: 'accepted',
        }

        const include = [
            {
                model: db.Ride,
                as: 'rides',
            },
        ]

        const response = await FindAll('UserRide', condition, include)
        return response
    } 

    static async ListUpcomingRides(userId){
        const condition = {
            status: {
                [Op.or]: ['pending', 'joined'] 
            },
            userId
        }

        const NOW = new Date()

        const include = [
            {
                model: db.Ride,
                as: 'rides',
                where: { 
                    status: { 
                        [Op.or]: ['unstarted', 'active'] 
                    },
                    dateOfRide: {
                        [Op.gte]: NOW,
                    },
                },
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
                    {
                        model: db.Car,
                        as: 'car',
                        include: [
                            {
                              model: db.CarType,
                              as: 'carType',
                            },
                            {
                              model: db.CarMake,
                              as: 'carMake',
                            },
                          ],
                    },
                ]
            },
            {
                model: db.RidePickupStation,
                as: 'pickUp',
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

        const { response } = await FindAll('UserRide', condition, include)
        
        if(!response.length){
            return false
        }else{
            const { rides: ride, pickUp } = response[0]
            
            // remove ride code
            delete ride.get().rideCode
            
            return { response }
        }
    }
}
