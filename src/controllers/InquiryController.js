/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import db from '../database/models'
import * as template from '../templates'
import * as helper from '../helpers'
import { Create, FindAll, Update } from '../database/queries'

export default class InquiriesController {
  static async createInquiry(req, res) {
    const data = req.body
    delete data.slug
    try {
      const response = await Create('Inquiry', data)
      return res.status(status.CREATED).json({
        message: 'Inquiry created successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async getAllInquiries(req, res) {
    const include = [
      {
        model: db['Car'],
        as: 'car',
      },
      {
        model: db['User'],
        as: 'user',
        include: {
          model: db['Profile'],
          as: 'user',
        },
      },
    ]
    try {
      const response = await FindAll('Inquiry', {}, include)
      return res.status(status.OK).json({
        message: 'Inquiries retrieved successfully',
        response,
      })
    } catch (error) {
      res.status(status.NOT_ACCEPTABLE).send({
        error: 'Inquiry not found',
      })
    }
  }

  static async getInquiryById(req, res) {
    return req.inquiry
      ? res.status(status.OK).json({
          response: req.inquiry,
        })
      : res.status(status.NO_CONTENT).send({
          error: 'Inquiry not found',
        })
  }
  static async approveInquiryById(req, res) {
    try {
      const inquiry = req.inquiry
      const { message, subject } = template.booking.inquiry(inquiry)
      await helper.mailer(message, subject, inquiry.user.email)
      return res.status(status.OK).json({
        response: inquiry,
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  static async getInquiriesByUser(req, res) {
    try {
      const include = [
        {
          model: db['Car'],
          as: 'car',
        },
      ]
      const { userId } = req.body
      const response = await FindAll(
        'Inquiry',
        { userId, status: 'pending' },
        include
      )
      if (response && !Object.keys(response.response).length) {
        return res.status(status.NOT_ACCEPTABLE).json({
          error: 'Inquiries not found',
        })
      } else {
        return res.status(status.OK).json({
          response,
        })
      }
    } catch (error) {
      res.status(status.BAD_REQUEST).send({
        error: 'Inquiries not found',
      })
    }
  }

  static async updateInquiry(req, res) {
    const data = req.body
    const where = {
      id: req.params.id,
    }
    const response = await Update('Inquiry', data, where)
    return res.status(status.OK).json({
      message: 'Inquiry updated successfully',
      response,
    })
  }
}
