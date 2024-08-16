/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import { FindAndCount } from '../database/queries'
import * as helper from '../helpers'
import db from '../database/models'

export default class ActivitiesController{
  static async getActivitiesByAdmin(req, res) {
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
        'Activity',
        {},
        include,
        limit,
        offset
      )

      if (!response.length) {
        return res.status(status.OK).json({
          message: 'Activities not found at this moment!',
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
