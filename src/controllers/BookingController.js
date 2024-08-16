import 'dotenv/config'
import status from '../config/status'
import db from '../database/models'
import { FindAll, FindOne, Create } from '../database/queries'
export default class CarTypesController {
  static async getAllBookings(req, res) {
    let include = []
    const { response, meta } = await FindAll('Booking', undefined, include)
    if (response && !response.length)
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No booking found!',
      })
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Bookings can not found at this moment, try again later',
        })
      : res.status(status.OK).json({
          meta,
          response,
        })
  }
  static async getBookingsByUser(req, res) {
    const include = [
      {
        model: db.Car,
        as: 'car',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ]
    const { response, meta } = await FindAll(
      'Booking',
      {
        userId: req.body.userId,
      },
      include
    )
    if (response && !response.length)
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No booking found!',
      })
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Bookings can not found at this moment, try again later',
        })
      : res.status(status.OK).json({
          meta,
          response,
        })
  }
  static async getBookingDetailsByUser(req, res) {
    try {
      let payment = {}
      const include = [
        {
          model: db.Car,
          as: 'car',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]
      const response = await FindOne(
        'Booking',
        {
          id: req.params.id,
        },
        include
      )
      if (response && Object.keys(response).length > 0) {
        payment = await FindOne('Payment', {
          bookingId: response.id,
        })
      } else {
        return res.status(status.NOT_ACCEPTABLE).send({
          response: [],
          error: 'Sorry, No booking found!',
        })
      }
      return res.status(status.OK).json({
        response: {
          booking: response,
          payment: payment,
        },
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Something went wrong, try again later',
      })
    }
  }
  static async createBooking(req, res) {
    const response = await Create('Booking', req.body)
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error:
            'Sorry, we can not create your booking right now. Please call us so that we can assist you',
        })
      : res.status(status.CREATED).json({ response })
  }
}
