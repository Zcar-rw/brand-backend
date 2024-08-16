/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import db from '../database/models'
import * as template from '../templates'
import * as helper from '../helpers'
import { Create, FindAll, FindAndCount, Update } from '../database/queries'

export default class ContactusController {
  static async createMessage(req, res) {
    const { id } = req.user
    const data = req.body
    data.userId = id

    const { CONTACT_US_EMAIL: email } = process.env
    try {
        await helper.mailer(data.message, data.title, email)
        const response = await Create('ContactUs', {...data})
        return res.status(status.CREATED).json({
            response
        })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async getAllMessagesByAdmin(req, res) {
    try {
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
            attributes: { exclude: ['password']},
            include: [
                {
                    model: db.Profile,
                    as: 'user'
                }
            ]
        }
      ]

      const { response, meta } = await FindAndCount(
        'ContactUs',
        {},
        include,
        limit,
        offset
      )

      if (!response.length) {
        return res.status(status.OK).json({
          message: 'No Contact message found at this moment!',
        })
      }
      return res.status(status.OK).json({
        response,
        meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
        message: error.message,
      })
    }
  }
}
