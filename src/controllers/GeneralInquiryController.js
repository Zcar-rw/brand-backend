/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import { Create } from '../database/queries'
import * as helper from '../helpers'
import * as template from '../templates'

export default class GeneralInquiryController {
  static async createInquiry(req, res) {
    const data = req.body
    try {
      const response = await Create('GeneralInquiry', data)
      const { message, subject } = template.inquiry.generalForAdmin(data.message)
      await helper.mailer(message, subject, 'hello@golocar.com')
      return res.status(status.CREATED).json({
        message:
          'We have received your message successfully, we contact you soon',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
}
