/* eslint-disable require-jsdoc */
import 'dotenv/config'
import { Op } from 'sequelize'
import db from '../database/models'
import { Create, Update, FindOne, FindAndCount } from '../database/queries'
import * as helper from '../helpers'
import status from '../config/status'
import RideServices from '../services/RideServices'
import RiderWalletServices from '../services/RiderWalletServices'
import {
  UserRideService,
  TransitWalletServices,
  PickUpServices,
  DropOffServices,
  CarServices,
  ActivitiesServices,
  DriverServices,
  NotificationServices,
} from '../services'
import calculateIncome from '../helpers/formulas'

export default class RidesController {
  static async createRideByDriver(req, res) {
    const data = req.body
    data.carId = req.params.carId
    data.rideCode = helper.generator.rideCode()
    data.shareId = helper.generator.generateRideShareId()
    try {
      const response = await Create('Ride', data)
      return res.status(status.CREATED).send({
        message: 'Ride created successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
        message: error.message,
      })
    }
  }

  static async createRide(req, res) {
    const { carId, dropoff, pickup, seats } = req.body
    req.body.rideCode = helper.generator.rideCode()

    const { id: userId } = req.user

    let newCreatedRide

    try {
      // Check Car
      const carResponse = await CarServices.getMyCarById(carId, userId)
      if (!carResponse) {
        return res.status(404).json({ error: 'Car not found' })
      }

      // Check dropoff location
      if (!dropoff || !dropoff.stationId) {
        return res
          .status(400)
          .json({ error: 'Ride must have a dropoff location' })
      }

      // # StationIds must be different
      const allStationIds = [
        ...new Set([dropoff.stationId, ...pickup.map((p) => p.stationId)]),
      ]
      if (allStationIds.length !== pickup.length + 1) {
        return res.status(409).json({
          error: 'stationId must be unique for dropoff and each pickup',
        })
      }

      // Check starting pickup location
      const startingPickups = pickup.filter(
        (pickup) => pickup.type === 'starting'
      )
      if (startingPickups.length !== 1) {
        return res
          .status(400)
          .json({ error: 'Ride must have one starting pickup location' })
      }

      // Check if seats is between 1 and 7
      if (seats < 1 || seats > 7) {
        return res.status(400).json({ error: 'seats must be between 1 and 7' })
      }

      // Check carMeta seats and ride seats
      if (seats > carResponse.carMeta.seats) {
        return res.status(400).json({
          error: "seats must not be higher than car's available seats",
        })
      }

      // Create Ride
      const response = await Create('Ride', {
        carId,
        userId,
        numberOfSeats: seats,
        rideCode: helper.generator.rideCode(),
        shareId: helper.generator.generateRideShareId(),
        isCompleted: true,
      })

      // Create RidePickups
      const pickupResponse = await PickUpServices.savePickUps(
        response.id,
        userId,
        pickup
      )
      if (pickupResponse.error) {
        return res.status(400).json({ error: pickupResponse.error })
      }

      // Create Dropoff
      const dropoffResponse = await DropOffServices.saveDropoff(
        response.id,
        userId,
        dropoff
      )

      if (dropoffResponse.error) {
        return res.status(400).json({ error: dropoffResponse.error })
      }

      // update covering areas of a ride
      for (const stationId of allStationIds) {
        newCreatedRide = await RideServices.updateCoveringAreas(
          response.id,
          stationId
        )
      }

      // set dateOfRide
      newCreatedRide = await RideServices.setDateOfRide(
        response.id,
        startingPickups[0].departureTime
      )

      // combine all responses(ride, pickup, and dropoff)
      const ride = {
        ...newCreatedRide,
        pickup: pickupResponse,
        dropoff: dropoffResponse,
      }

      // Note activity
      await ActivitiesServices.RideCreationActivity(
        userId,
        startingPickups[0],
        ride.dropoff
      )

      return res.status(201).json({ response: ride })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
        message: error.message,
      })
    }
  }

  static async createRidesRoutes(req, res) {
    const data = req.body
    data.rideId = req.params.rideId
    try {
      const response = await Create('RideRoute', data)
      return res.status(status.CREATED).send({
        message: 'Ride route created successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async getRidesByDriver(req, res) {
    // manage pagination
    let { page, limit } = req.query
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      })
    }
    limit = limit || 5
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit

    const { id } = req.user
    const include = [
      {
        model: db.Car,
        as: 'car',
        include: [
          {
            model: db.CarType,
            as: 'carType',
          },
        ],
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'userId',
            'ownerId',
            'carMakeId',
            'businessType',
            'businessTags',
            'video',
            'cover',
            'province',
            'district',
            'VIN',
          ],
        },
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
        model: db.UserRide,
        as: 'riders',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
            include: {
              model: db.Profile,
              as: 'user',
            },
          },
        ],
      },
    ]
    const condition = {
      userId: id,
    }
    const { response, meta } = await FindAndCount(
      'Ride',
      condition,
      include,
      limit,
      offset
    )

    // const response = await FindAll('Ride', where, include)
    if (response.length === 0) {
      return res.status(status.NOT_FOUND).send({
        message: 'No ride found',
      })
    }
    response.forEach((ride) => {
      ride.get().riders = ride.riders.filter(
        (rider) =>
          rider.status === 'pending' ||
          rider.status === 'accepted' ||
          rider.status === 'joined'
      )
    })
    return res.status(status.OK).send({
      response,
      meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
    })
  }
  static async getUpcomingRidesDriver(req, res) {
    // manage pagination
    let { page, limit } = req.query
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      })
    }
    limit = limit || 5
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit

    const { id } = req.user
    const include = [
      {
        model: db.Car,
        as: 'car',
        include: [
          {
            model: db.CarType,
            as: 'carType',
          },
        ],
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'userId',
            'ownerId',
            'carMakeId',
            'businessType',
            'businessTags',
            'video',
            'cover',
            'province',
            'district',
            'VIN',
          ],
        },
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
        model: db.UserRide,
        as: 'riders',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
            include: {
              model: db.Profile,
              as: 'user',
            },
          },
        ],
      },
    ]
    const NOW = new Date()

    const condition = {
      userId: id,
      // status: 'unstarted'
      status: {
        [Op.or]: ['unstarted', 'active'],
      },
      dateOfRide: {
        [Op.gte]: NOW,
      },
    }
    const { response, meta } = await FindAndCount(
      'Ride',
      condition,
      include,
      limit,
      offset
    )
    if (response.length === 0) {
      return res.status(status.NOT_FOUND).send({
        message: 'No upcoming rides found',
      })
    }
    return res.status(status.OK).send({
      response,
      meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
    })
  }

  static async getRidesByAdmin(req, res) {
    // manage pagination
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
        model: db.User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        include: {
          model: db.Profile,
          as: 'user',
        },
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
      {
        model: db.User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        include: {
          model: db.Profile,
          as: 'user',
        },
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
        model: db.UserRide,
        as: 'riders',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
            include: {
              model: db.Profile,
              as: 'user',
            },
          },
        ],
      },
    ]
    const condition = {}

    const { response, meta } = await FindAndCount(
      'Ride',
      condition,
      include,
      limit,
      offset
    )

    if (response.length === 0) {
      return res.status(status.NOT_FOUND).send({
        message: 'No ride found',
      })
    }
    // response.forEach((ride) => {
    //   ride.get().riders = ride.riders.filter(
    //     (rider) =>
    //       rider.status === 'pending' ||
    //       rider.status === 'accepted' ||
    //       rider.status === 'joined'
    //   )
    // })
    return res.status(status.OK).send({
      response,
      meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
    })
  }

  static async getRidesByDriver(req, res) {
    // manage pagination
    let { page, limit } = req.query
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      })
    }
    limit = limit || 5
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit

    const { id } = req.user
    const include = [
      {
        model: db.Car,
        as: 'car',
        include: [
          {
            model: db.CarType,
            as: 'carType',
          },
        ],
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'userId',
            'ownerId',
            'carMakeId',
            'businessType',
            'businessTags',
            'video',
            'cover',
            'province',
            'district',
            'VIN',
          ],
        },
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
        model: db.UserRide,
        as: 'riders',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
            include: {
              model: db.Profile,
              as: 'user',
            },
          },
        ],
      },
    ]
    const condition = {
      userId: id,
    }
    const { response, meta } = await FindAndCount(
      'Ride',
      condition,
      include,
      limit,
      offset
    )

    // const response = await FindAll('Ride', where, include)
    if (response.length === 0) {
      return res.status(status.NOT_FOUND).send({
        message: 'No ride found',
      })
    }
    response.forEach((ride) => {
      ride.get().riders = ride.riders.filter(
        (rider) =>
          rider.status === 'pending' ||
          rider.status === 'accepted' ||
          rider.status === 'joined'
      )
    })
    return res.status(status.OK).send({
      response,
      meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
    })
  }

  static async updateRideByDriver(req, res) {
    const { rideId } = req.params
    const exist = await FindOne('Ride', { id: rideId })
    if (exist.dataValues.status === 'unstarted') {
      const data = req.body
      const response = await Update('RideRoute', data, { rideId })
      return res.status(status.OK).send({
        message: 'Ride updated successfully',
        response,
      })
    }
    return res.status(status.BAD_REQUEST).send({
      message: 'Ride cannot be updated',
    })
  }

  static async getRidesByUser(req, res) {
    // manage pagination
    let { page, limit } = req.query
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      })
    }
    limit = limit || 10
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit

    const include = [
      {
        model: db.Car,
        as: 'car',
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'userId',
            'ownerId',
            'carMakeId',
            'businessType',
            'businessTags',
            'video',
            'cover',
            'province',
            'district',
            'VIN',
          ],
        },
        include: [
          {
            model: db.CarType,
            as: 'carType',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: db.CarMake,
            as: 'carMake',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
    const condition = {
      userId: { [Op.not]: req.user.id },
      isCompleted: true,
      status: { [Op.not]: 'completed' },
    }
    const { response, meta } = await FindAndCount(
      'Ride',
      condition,
      include,
      limit,
      offset
    )

    // const response = await FindAll('Ride', where, include)
    if (response.length === 0) {
      return res.status(status.NOT_FOUND).send({
        message: 'No rides found at this moment',
      })
    }
    response.forEach((resp) => delete resp.get().rideCode)
    return res.status(status.OK).send({
      response,
      meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
    })
  }
  static async getRideDetailByDriver(req, res) {
    const rideId = req.ride.id
    const include = [
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
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
        model: db.UserRide,
        as: 'riders',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
            include: {
              model: db.Profile,
              as: 'user',
            },
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
        ],
      },
    ]
    try {
      const response = await FindOne('Ride', { id: rideId }, include)
      response.get().riders = response.riders.filter(
        (rider) =>
          rider.status === 'pending' ||
          rider.status === 'accepted' ||
          rider.status === 'joined'
      )
      return res.status(status.OK).send({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error,
      })
    }
  }
  static async getRideDetailByAdmin(req, res) {
    const rideId = req.ride.id
    const include = [
      {
        model: db.User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        include: {
          model: db.Profile,
          as: 'user',
        },
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
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
        model: db.UserRide,
        as: 'riders',
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
            include: {
              model: db.Profile,
              as: 'user',
            },
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
        ],
      },
    ]
    try {
      const response = await FindOne('Ride', { id: rideId }, include)
      return res.status(status.OK).send({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error,
      })
    }
  }
  static async getRideDetailByRider(req, res) {
    const rideId = req.params.rideId
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
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
    const condition = {
      id: rideId,
      userId: { [Op.not]: req.user.id },
      isCompleted: true,
    }
    try {
      const response = await FindOne('Ride', condition, include)
      if (!Object.keys(response).length) {
        return res.status(status.NOT_FOUND).json({
          message: 'Ride not found',
        })
      }

      // Find userride
      response.get().userRide = await UserRideService.listUserRides(
        req.user.id,
        rideId
      )

      return (
        delete response.get().rideCode &&
        res.status(status.OK).json({
          response,
        })
      )
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async searchRides(req, res) {
    const { key } = req.query
    const field = 'coveringAreas'
    const order = [['createdAt', 'DESC']]
    const include = [
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
    try {
      const response = await db['Ride'].findAll(
        {
          where: {
            [Op.and]: [
              {
                coveringAreas: {
                  [Op.iLike]: `%${key}%`,
                },
              },
              { status: 'unstarted' },
              { isCompleted: true },
              {
                dateOfRide: {
                  [Op.gte]: new Date(Date.now()).toISOString().split('T')[0],
                },
              },
            ],
          },
          include,
          order,
        },
        { logging: false }
      )
      return res.status(status.OK).send({
        response: response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async RequestToJoinRide(req, res) {
    const { car, id } = req.ride
    const { pickupId } = req.params

    const { riderWalletId: walletId } = req.user

    const data = req.body
    data.userId = req.user.id
    data.carId = car.id
    data.rideId = id

    try {
      const condition = {
        userId: data.userId,
        rideId: data.rideId,
        status: 'pending',
      }

      const response = await FindOne('UserRide', condition)
      if (Object.keys(response).length === 0) {
        //1. Compare fare of the ride with balance of rider wallet
        const { balance } = await RiderWalletServices.balance(
          req.user.id,
          req.user.riderWalletId
        )
        const { price } = await PickUpServices.pickupPrice(
          pickupId,
          data.rideId
        )

        if (balance < price) {
          return res.status(status.INSUFFICIENT_FUND).json({
            message: `You don\'t have enough funds, please top up (${
              price - balance
            })`,
          })
        }

        // 2. check seats availabililty
        const isSeatAvailabe = await RideServices.checkSeatAvailability(
          data.rideId
        )
        if (isSeatAvailabe) {
          // 3. check pickup address
          const pickup = await PickUpServices.checkPickupOnRide(
            pickupId,
            data.rideId
          )
          if (pickup) {
            // 4. Pay Ride
            const payResponse = await RideServices.Pay(
              data.userId,
              data.rideId,
              walletId,
              price
            )

            // 5. Update number of seats on car's ride
            await RideServices.updatingNumberOfSeats(data.rideId, 'decrease')

            // 6. TODO: Notify a driver to approve this request
            // send rideId and userRideId to a driver

            const record = await Create('UserRide', {
              ...data,
              pickupId: pickup.id,
            })

            // Note Activity and Notify Admin
            await ActivitiesServices.JoinRideRequestActivity(
              data.userId,
              pickupId
            )

            // 7. Notify a driver
            const { driver } = await DriverServices.getDriverUserIdByRideId(
              data.rideId
            )
            await NotificationServices.sendPushNotification(
              [driver.id],
              'Rider Requested to join a Ride',
              'Join Request'
            )
            // 8. Save driver's notification
            await NotificationServices.saveNotification(
              driver.id,
              `${req.user.user.firstName} ${req.user.user.lastName} want to join your ride`,
              'ride',
              data.rideId,
              'driver'
            )
            return res.status(status.CREATED).send({
              message: 'You have successfully requested to join this ride!',
              response: record,
              payResponse,
            })
          }
          return res.status(status.NOT_FOUND).send({
            message: 'Pick Up is not available',
          })
        }
        return res.status(status.NOT_FOUND).send({
          message: "Ride's seats are full!",
        })
      } else {
        return res.status(status.EXIST).send({
          message: 'You have already requested to join this ride',
        })
      }
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async ApproveJoiningRideByDriver(req, res) {
    const rideId = req.ride.id
    const { userRideId } = req.params

    // 1. Change status of userride -> accepted
    const response = await UserRideService.changeToAcceptedStatus(
      userRideId,
      'accepted'
    )

    // 2. Notify a rider who was requesting to join
    await NotificationServices.sendPushNotification(
      [response.userId],
      'Driver has accepted your request of joining a ride.',
      'Join Request Approved'
    )

    return res.status(status.OK).json({
      message: 'Approving Successfully!',
      response,
    })
  }

  static async CompleteRideInfoByDriver(req, res) {
    const { id } = req.ride
    const { id: userId } = req.user

    const condition = {
      id,
      userId,
    }
    const include = [
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
    try {
      const response = await FindOne('Ride', condition, include)
      if (response.rideDropoff !== null && response.ridePickup.length >= 1) {
        // update isCompleted attr on Ride
        const completed = {
          isCompleted: true,
        }
        const updateCondition = {
          id: response.id,
        }
        const updated = await Update('Ride', completed, updateCondition)
        return res.status(status.OK).send({
          message: 'Info on Ride is completed!',
          response: updated,
        })
      } else {
        return res.status(status.BAD_REQUEST).send({
          message:
            'Oops!, Ride is complete when it has both pickup and dropoff',
        })
      }
    } catch (error) {
      return res.status(status.SERVER_ERROR).send({
        error,
        message: error.message,
      })
    }
  }

  static async startRideByDriver(req, res) {
    const rideId = req.ride.id
    const userId = req.user.id
    try {
      const response = await FindOne('Ride', {
        id: rideId,
        userId,
        status: 'unstarted',
      })
      if (!Object.keys(response).length) {
        // ride is not yours or its status is diff unstarted
        return res.status(status.BAD_REQUEST).send({
          message: 'Oops, you can not start this ride or Check its status!',
        })
      } else if (!response.isCompleted) {
        return res.status(status.BAD_REQUEST).send({
          message: 'Ride has incomplete information!',
        })
      }
      const startedRide = await response.update({ status: 'active' })

      if (response.riders) {
        let userIds = []

        const acceptedRiders = await Promise.all(
          response.riders.map((rider) => userIds.push(rider.userId))
        )

        // # Notify all riders requested to join a ride
        await NotificationServices.sendPushNotification(
          userIds,
          'Ride you requested to join, started',
          'Ride has started'
        )
      }

      return res.status(status.OK).send({
        message: 'Ride started successfully!',
        response: startedRide,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async joinCarByRider(req, res) {
    const rideId = req.ride.id
    const userId = req.user.id
    const { riderWalletId } = req.user
    const { code } = req.body
    const include = [
      {
        model: db.RidePickupStation,
        as: 'pickUp',
      },
    ]

    try {
      // 1. Check If rider accepted on a ride
      const userRideResponse = await FindOne(
        'UserRide',
        {
          rideId,
          userId,
          status: 'accepted',
        },
        include
      )
      if (Object.keys(userRideResponse).length === 0) {
        return res.status(status.BAD_REQUEST).send({
          message: 'Please, request to join ride or wait your request',
        })
      }

      // 2. Check ride code and update user ride status
      const ride = await FindOne('Ride', { id: rideId, status: 'active' })
      if (!Object.keys(ride).length) {
        return res.status(status.OK).send({
          message: 'Ride is not yet started!',
        })
      }
      if (Object.keys(ride).length && ride.rideCode === code) {
        const userRideUpdated = await userRideResponse.update({
          status: 'joined',
        })

        //3. move funds from transit to driver wallet
        const IsMoved = await TransitWalletServices.moveFundToDriver(
          rideId,
          riderWalletId,
          userId,
          userRideResponse.pickUp.price
        )

        if (IsMoved && userRideUpdated) {
          // Note Activity and notify admin
          await ActivitiesServices.RiderEnterCarActivity(userId, rideId)

          return res.status(status.OK).send({
            message: 'You are successfully onboarded! Have a good journey!',
            IsMoved,
            ride,
          })
        }
      }
      return res.status(status.BAD_REQUEST).send({
        message: 'Please provide a valid ride joining code',
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async CompleteRideGoByDriver(req, res) {
    try {
      const rideId = req.ride.id
      const userId = req.user.id

      const condition = {
        id: rideId,
        userId,
        status: 'active',
      }
      const include = [
        {
          model: db.UserRide,
          as: 'riders',
        },
      ]

      const response = await FindOne('Ride', condition, include)
      if (!Object.keys(response).length) {
        //1. either is not active or not owned by a driver
        return res.status(status.NOT_FOUND).json({
          message: 'Ride not found or is not active',
        })
      }

      //2. update ride status to completed
      await response.update({
        status: 'completed',
      })

      //3. update all userRide corresponding to this Ride
      const updatedRiders = await Promise.all(
        response.riders
          .filter((rider) => rider.status === 'joined')
          .map(async (rider) => {
            return await rider.update({
              status: 'completed',
              completedTime: Date.now(),
            })
          })
      )
      // Note activity and notify admin
      await ActivitiesServices.CompleteRideActivity(userId)

      //4. sum up the total price of riders who joined the ride
      let userIds = []
      let totalPrice = 0

      for (const rider of response.riders) {
        if (rider.status === 'joined') {
          // getting all riders joined a ride
          userIds.push(rider.userId)

          // getting total price
          totalPrice = totalPrice + rider.pickUp.price
        }
      }

      //5. calculate driver earnings
      const { driverIncome } = calculateIncome(totalPrice)

      // # Notify all riders who were joined a ride
      await NotificationServices.sendPushNotification(
        userIds,
        'Ride has completed',
        'Ride has completed'
      )

      // # Notify driver who created a ride with his/her earnings
      await NotificationServices.sendPushNotification(
        [response.userId],
        'Ride has completed',
        'Ride has completed',
        driverIncome
      )

      return res.status(status.OK).json({
        ride: response,
        userRide: updatedRiders,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).json({
        error: error.message,
      })
    }
  }

  static async getRidesOfUserByAdmin(req, res) {
    // manage pagination
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
        model: db.User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        include: {
          model: db.Profile,
          as: 'user',
        },
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
      {
        model: db.RidePickupStation,
        as: 'ridePickup',
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
        model: db.UserRide,
        as: 'riders',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password'],
            },
            include: {
              model: db.Profile,
              as: 'user',
            },
          },
        ],
      },
    ]
    const { userId } = req.params
    const condition = {
      userId,
    }

    const { response, meta } = await FindAndCount(
      'Ride',
      condition,
      include,
      limit,
      offset
    )

    if (response.length === 0) {
      return res.status(status.NOT_FOUND).send({
        message: 'No ride found for this user',
      })
    }
    response.forEach((ride) => {
      ride.get().riders = ride.riders.filter(
        (rider) =>
          rider.status === 'pending' ||
          rider.status === 'accepted' ||
          rider.status === 'joined'
      )
    })
    return res.status(status.OK).send({
      response,
      meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
    })
  }

  static async cancelRideByDriver(req, res) {
    const { rideId } = req.params
    const { id: userId } = req.user

    const condition = {
      id: rideId,
      userId,
      status: 'unstarted',
    }

    const response = await FindOne('Ride', condition)

    if (!Object.keys(response).length) {
      return res.status(status.ACCESS_DENIED).json({
        error:
          'Not allowed to cancel ride you did not create, or it is started!',
      })
    }

    // change ride status -> cancelled
    await response.update({
      status: 'cancelled',
    })

    const rideInfo = await RideServices.getRideInfo(rideId)

    async function refundJoinedRiders() {
      for (let rider of rideInfo.riders) {
        let ridePaidPrice = rider.get().pickUp.price
        const riderStatus = rider.get().status

        const riderwallet = await RiderWalletServices.getRiderWalletByUser(
          rider.get().userId
        )

        if (riderStatus === 'pending') {
          await TransitWalletServices.refundMoney(
            riderwallet.id,
            ridePaidPrice,
            userId,
            rideId
          )
        }
      }
    }

    // Refund money to all joined riders
    if (response.status === 'cancelled') {
      refundJoinedRiders()
    }

    return res.status(status.OK).json({
      response,
    })
  }

  static async CheckRideByShareId(req, res) {
    const { shareId } = req.params
    try {
      const response = await FindOne('Ride', { shareId })
      if (Object.keys(response).length) {
        return res.status(status.OK).json({
          id: response.id,
          // shareId:
          isExist: true,
        })
      }
      return res.status(status.NOT_FOUND).json({
        isExist: false,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error,
      })
    }
  }
}
