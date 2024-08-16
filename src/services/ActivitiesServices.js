import io from '../socket'
import * as helpers from '../helpers'
import { Create, FindOne, Update } from '../database/queries'
import {
  CarServices,
  UserServices,
  StationService,
  PickUpServices,
  RideService,
} from '.'
import adminNamespace from '../socket/admin-namespace'

export default class ActivitiesServices {
  /**
   *
   * @param {uuid} userId Whom rider wallet belongs to
   * @param {uuid} walletId Rider wallet Id which topped Up.
   * @returns { object } Description of activity object and Dispatch a topup activity event.
   */
  static topUpActivity = async (userId, amount) => {
    const user = await UserServices.getUser(userId)

    const message = helpers.activity.types('Top Up', {
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      amount,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'WALLET TOPUP',
      timestamp: Date.now(),
    })

    // 2. Dispatch a topup activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('Top Up', activity)
  }

  /**
   * @param {uuid} userId Registered userId
   *
   */
  static RegisterActivity = async (userId) => {
    const user = await UserServices.getUser(userId)

    const message = helpers.activity.types('New Registration', {
      firstName: user.user.firstName,
      lastName: user.user.lastName,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'USER REGISTRATION',
      timestamp: Date.now(),
    })

    // 2. Dispatch a new user registration activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('New Registration', activity)
  }

  /**
   * @param {uuid} userId Driver userId
   *
   */
  static BecomeDriverActivity = async (userId) => {
    const user = await UserServices.getUser(userId)

    const message = helpers.activity.types('New Driver', {
      firstName: user?.user?.firstName,
      lastName: user?.user?.lastName,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'DRIVER REGISTRATION',
      timestamp: Date.now(),
    })

    // 2. Dispatch a driver registration activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('New Driver', activity)
  }

  /**
   *
   * @param {string} userId Driver user ID
   * @param {string} carId Registered Car ID
   */
  static CarRegistrationActivity = async (userId, carId) => {
    const user = await UserServices.getUser(userId)
    const car = await CarServices.getMyCarById(carId, userId)

    const message = helpers.activity.types('New Car', {
      driverFirstName: user?.user?.firstName,
      driverLastName: user?.user?.lastName,
      carMakeName: car?.carMake?.name,
      fabricationYear: car?.carMeta?.year,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'CAR REGISTRATION',
      timestamp: Date.now(),
    })

    // 2. Dispatch a car registration activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('New Car', activity)
  }

  /**
   *
   * @param {string} userId Driver userId who creates the ride
   * @param {string} pickUp Ride pickups stations
   * @param {string} dropoff Ride dropoff station
   *
   * @returns {object} Ride activity created object and notify admin.
   */
  static RideCreationActivity = async (userId, pickUp, dropoff) => {
    const user = await UserServices.getUser(userId)
    const pickupStation = await StationService.getStationNameById(
      pickUp.stationId
    )
    const dropffStation = await StationService.getStationNameById(
      dropoff.stationId
    )

    const message = helpers.activity.types('New Ride', {
      firstName: user?.user?.firstName,
      lastName: user?.user?.lastName,
      pickupStationName: pickupStation.name,
      dropoffStationName: dropffStation.name,
      departureTime: pickUp.departureTime,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'RIDE CREATION',
      timestamp: Date.now(),
    })

    // 2. Dispatch a ride registration activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('New Ride', activity)
  }

  /**
   *
   * @param {string} userId Rider Id who is requesting to join a ride.
   * @param {string} pickupId Pickup Id where driver will pick the rider.
   *
   * @returns {object} Activity object containing driver name and rider name with pickup departure time.
   *
   */
  static JoinRideRequestActivity = async (userId, pickupId) => {
    const user = await UserServices.getUser(userId)
    const pickup = await PickUpServices.getRidePickupById(pickupId)

    const message = helpers.activity.types('New Ride Request', {
      riderFirstName: user?.user?.firstName,
      riderLastName: user?.user?.lastName,
      driverFirstName: pickup?.ridePickup?.user?.user?.firstName,
      driverLastName: pickup?.ridePickup?.user?.user?.lastName,
      departureTime: pickup.departureTime,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'RIDE REQUEST',
      timestamp: Date.now(),
    })

    // 2. Dispatch join ride request activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('New Ride Request', activity)
  }

  /**
   *
   * @param {*} userId Rider Id who is entering the car
   * @param {*} rideId Ride Id, the rider joins.
   *
   * @return {object} Enter car activity with rider name and driver name and notify admin
   */
  static RiderEnterCarActivity = async (userId, rideId) => {
    const user = await UserServices.getUser(userId)
    const rideInfo = await RideService.getRideInfo(rideId)

    const message = helpers.activity.types('Passenger Car Enter', {
      riderFirstName: user?.user?.firstName,
      riderLastName: user?.user?.lastName,
      driverFirstName: rideInfo.user.user?.firstName,
      driverLastName: rideInfo.user.user?.lastName,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'ENTER CAR',
      timestamp: Date.now(),
    })

    // 2. Dispatch enter car activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('Passenger Car Enter', activity)
  }

  /**
   *
   * @param {string} userId Driver user ID who is completing the ride.
   *
   * @returns {object} An object containing a complete activity and notify admin
   */
  static CompleteRideActivity = async (userId) => {
    const user = await UserServices.getUser(userId)

    const message = helpers.activity.types('Ride Completed', {
      driverFirstName: user?.user?.firstName,
      driverLastName: user?.user?.lastName,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'RIDE COMPLETED',
      timestamp: Date.now(),
    })

    // 2. Dispatch complete ride activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('Ride Completed', activity)
  }

  /**
   *
   * @param {string} userId Driver user ID who is completing the ride.
   *
   * @returns {object} An object containing a complete activity and notify admin
   */
  static DriverPayoutActivity = async (userId, amount) => {
    const user = await UserServices.getUser(userId)

    const message = helpers.activity.types('Driver Payout', {
      driverFirstName: user?.user?.firstName,
      driverLastName: user?.user?.lastName,
      amount,
    })

    // 1. Save activity
    const activity = await Create('Activity', {
      userId,
      message,
      type: 'DRIVER PAYOUT',
      timestamp: Date.now(),
    })
    // 2. Dispatch complete ride activity event
    const { emitToAdmin } = adminNamespace(io)
    emitToAdmin('Driver Payout', activity)
  }
}
