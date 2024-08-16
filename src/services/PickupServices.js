/* eslint-disable require-jsdoc */
import 'dotenv/config'
import db from '../database/models'
import {
  BulkCreate,
  FindOne,
} from '../database/queries'

export default class PickUpServices {
    static async checkPickupOnRide(id, rideId){
        const condition = {
          id,
          rideId
        }
        const include= [
          {
            model: db.Station,
            as: 'station',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ]

        const pickup = await FindOne('RidePickupStation', condition, include)
        if(Object.keys(pickup).length === 0){
          return false
        }else{
          return pickup
        }
  
    }

    static async pickupPrice(id, rideId){
        const condition = {
          id,
          rideId
        }
        const include= [
          {
            model: db.Station,
            as: 'station',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ]

        const pickup = await FindOne('RidePickupStation', condition, include)
        if(Object.keys(pickup).length === 0){
          return false
        }else{
          return {
            price: pickup.price
          }
        }
    }

    static async savePickUps(rideId, userId, pickup){
      const pickupStations = pickup.map(({ stationId, type, departureTime, price, note }) => {
        return { stationId, type, departureTime, price,note, rideId, userId };
      });

      try {
        const response = await BulkCreate('RidePickupStation', pickupStations)
        return response
      } catch (error) {
        return { error: error.message }
      }
    }

    static async getRidePickupById(pickupId){
      const condition = {
        id: pickupId
      }
      const include= [
        {
          model: db.Station,
          as: 'station',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Ride,
          as: 'ridePickup',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'user',
              include: [
                {
                  model: db.Profile,
                  as: 'user'
                }
              ]
            }
          ]
        },
      ]

      const pickup = await FindOne('RidePickupStation', condition, include)
      return pickup
    }

}
