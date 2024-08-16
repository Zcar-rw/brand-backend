import { Create, FindOne, Update } from '../database/queries'
import StationService from './StationServices'
import 'dotenv/config'
import db from '../database/models'
import * as helper from '../helpers'
import { DriverServices } from '../services'

export default class RideService {
  static async updateCoveringAreas(rideId, stationId) {
    try {
      const response = await FindOne('Ride', { id: rideId })
      const station = await StationService.getStationNameById(stationId)
      const stationValues = Object.values(station)
      response.coveringAreas =
        response.coveringAreas == null ? '' : response.coveringAreas
      response.coveringAreas += stationValues.join(',')
      response.coveringAreas = Array.from(
        new Set(response.coveringAreas.split(','))
      ).join(',')
      response.coveringAreas += ','
      await response.update({
        coveringAreas: response.coveringAreas,
      })
      return response
    } catch (error) {
      console.log(error.message)
    }
  }

  static async checkSeatAvailability(id) {
    const condition = {
      id,
    }
    const include = [
      {
        model: db.UserRide,
        as: 'riders',
      },
    ]
    const ride = await FindOne('Ride', condition, include)
    if (ride.numberOfSeats > 0) {
      return true
    }
    return false
  }
  static async Pay(userId, rideId, riderWalletId, price) {
    //1. update rider wallet
    const wallet = await FindOne('RiderWallet', {
      id: riderWalletId,
      userId,
    })
    const newBalance = wallet.balance - price
    const riderWallet = await wallet.update({ balance: newBalance })

    //2. create transit wallet record

    const data = {
      userId,
      rideId,
      riderWalletId,
      amount: price,
      method: 'credited',
      type: 'transit',
    }
    const transitWallet = await Create('TransitWallet', data)

    //3. record a transaction
    const { driverWalletId } = await DriverServices.getDriverWalletIdByRideId(
      rideId
    )

    const transData = {
      userId,
      rideId,
      riderWalletId,
      driverWalletId,
      transitWalletId: transitWallet.id,
      tax: 0,
      amount: price,
      type: 'ride',
      transactionCode: helper.generator.transactionCode('ride'),
      LOCAR_NET_INCOME: 0,
    }
    const transaction = await Create('Transactions', transData)
    return {
      riderWallet,
      transitWallet,
      transaction,
    }
  }

  static async getRidePrice(userId, rideId) {
    try {
      // 1. get pickupPrice from user ride and pickup
      const condition = {
        rideId,
        userId,
        status: 'pending',
      }
      const response = await FindOne('UserRide', condition)
      if (Object.keys(response).length === 0) {
        return false
      } else {
        const stationResponse = await FindOne('RidePickupStation', {
          id: response.pickupId,
        })
        return {
          price: stationResponse.price,
        }
      }
    } catch (error) {
      return false
    }
  }

  static async updatingNumberOfSeats(rideId, action) {
    try {
      const response = await FindOne('Ride', { id: rideId })
      switch (action) {
        case 'decrease':
          if (response.numberOfSeats !== 0) {
            await response.update({
              numberOfSeats: --response.numberOfSeats,
            })
          }
          break
        case 'increase':
          await response.update({
            numberOfSeats: ++response.numberOfSeats,
          })
          break
        default:
      }
    } catch (error) {
      console.log(error)
    }
  }

  static async isStationOnRideDropffStation(_rideId, _stationId, _userId) {
    try {
      const condition = {
        userId: _userId,
        id: _rideId,
      }
      const include = [
        {
          model: db.RideDropoffStation,
          as: 'rideDropoff',
          where: { stationId: _stationId },
        },
      ]
      const response = await FindOne('Ride', condition, include)
      if (Object.keys(response).length) {
        return true
      }
      return false
    } catch (error) {
      console.log(error)
    }
  }

  static async isStationOnRidePickupStation(_rideId, _stationId, _userId) {
    try {
      const condition = {
        userId: _userId,
        id: _rideId,
      }
      const include = [
        {
          model: db.RidePickupStation,
          as: 'ridePickup',
          where: { stationId: _stationId },
        },
      ]

      const response = await FindOne('Ride', condition, include)
      if (!Object.keys(response).length) {
        return false
      }
      return true
    } catch (error) {
      console.log(error)
    }
  }

  static async setDateOfRide(_rideId, dateTime) {
    try {
      const data = {
        dateOfRide: dateTime,
      }
      const response = await Update('Ride', data, { id: _rideId })

      return response
    } catch (error) {
      return false
    }
  }

  static async getRideInfo(rideId) {
    const condition = {
      id: rideId,
    }

    const include = [
      {
        model: db.User,
        as: 'user',
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Profile,
            as: 'user',
          },
        ],
      },
      {
        model: db.UserRide,
        as: 'riders',
        include: [
          {
            model: db.RidePickupStation,
            as: 'pickUp',
          },
        ],
      },
    ]

    const ride = await FindOne('Ride', condition, include)
    return ride
  }
}
