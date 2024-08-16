/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import db from '../database/models'
import * as helper from '../helpers'
import { Create, FindAndCount, Update } from '../database/queries'

export default class AddressController {
  static async processPayment(req, res) {
    // PROCESS
    try {
      let { booking, payment } = req.body
      // 1. CREATE BOOKING
      booking = {
        ...booking,
        userId: req.body.userId,
        bookingCode: helper.generator.code('BOOKING'),
      }
      const response = await Create('Booking', booking)
      // 2. UPDATE INQUIRY
      await Update('Inquiry', { status: 'paid' }, { id: booking.inquiryId })
      // 3. SAVE PAYMENT INFORMATION
      payment = {
        ...payment,
        payerId: req.user.user.id,
        payeeId: req.body.booking.ownerProfileId,
        bookingId: response.id,
        transactionCode: helper.generator.code('PAYMENT'),
      }
      const p = await Create('Payment', payment)
      // 4. SAVE PICKUP INFORMATION
      // 5. SAVE DROPOFF INFORMATION
      // 6. GENERATE MAIL AND SEND NOTIFICATION
      return res.status(status.CREATED).send({
        response: {
          paid: true,
        },
      })
    } catch (error) {
      // 1. IF BOOKING SAVED, SEND 204 STATUS
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
  static async getAdminPayments(req, res) {
    let { page, limit } = req.query
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      })
    }
    limit = limit || 20
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit

    try {
      const include = [
        {
          model: db.Booking,
          as: 'booking',
          include: [
            {
              model: db.Car,
              as: 'car',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              include: [
                {
                  model: db.CarMake,
                  as: 'carMake',
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
              ],
            },
          ],
        },

        {
          model: db.Profile,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          as: 'payer',
        },
        {
          model: db.Profile,
          as: 'payee',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]
      const condition = {}
      const response = await FindAndCount(
        'Payment',
        condition,
        include,
        limit,
        offset
      )
      return res.status(status.OK).json({
        response: response.response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
  static async getUserPayments(req, res) {
    // PROCESS
    return res.status(status.OK).json({
      message: 'Processing',
    })
  }
  static async getPaymentDetailPerTransactionCode(req, res) {
    // PROCESS
    return res.status(status.OK).json({
      message: 'Processing',
    })
  }
}
