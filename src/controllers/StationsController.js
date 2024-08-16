/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import {
  Create,
  FindAndCount,
  FindAll,
  FindOne,
  Search,
  Delete,
} from '../database/queries'
import * as helper from '../helpers'
import db from '../database/models'
import { Op } from 'sequelize'

export default class StationsController {
  static async create(req, res) {
    const data = req.body

    const response = await Create('Station', data)

    try {
      return res.status(status.CREATED).send({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async findAll(req, res) {
    let { page, limit } = req.query
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      })
    }

    limit = limit || 5
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit
    const condition = {}
    const include = []
    try {
      const { response, meta } = await FindAndCount(
        'Station',
        condition,
        include,
        limit,
        offset
      )

      return res.status(status.OK).send({
        response,
        meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async findOne(req, res) {
    const { id } = req.params
    const condition = { id }
    try {
      const response = await FindOne('Station', condition)
      return res.status(status.OK).send({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async SearchStations(req, res) {
    const key = req.query.name
    if (!key) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, key to search on is required!',
      })
    }
    try {
      let include = []
      const response = await db['Station'].findAll(
        {
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `%${key}%`,
                },
              },
              {
                district: {
                  [Op.iLike]: `%${key}%`,
                },
              },
              {
                sector: {
                  [Op.iLike]: `%${key}%`,
                },
              },
              {
                streetNumber: {
                  [Op.iLike]: `%${key}%`,
                },
              },
              {
                landmark: {
                  [Op.iLike]: `%${key}%`,
                },
              },
            ],
          },
          include,
        },
        { logging: false }
      )
      return res.status(status.OK).send({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
        message: error.message,
      })
    }
  }

  // CREATE POPULAR PLACES
  static async createPopularPlaces(req, res) {
    const { stations } = req.body
    if (stations.length > 6)
      return res.status(status.BAD_REQUEST).send({
        error:
          'You are trying to add a lot of popular places at the same time(Only 6 places allowed at this moment)',
      })
    try {
      // 1: DELETE EXISTING POPULAR PLACES
      await Delete('PopularPlace', {})
      // 2: SAVE NEW PLACES
      stations.map((station) => Create('PopularPlace', { stationId: station }))
      return res.status(status.CREATED).send({
        response: 'created',
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  // FETCH POPULAR PLACES
  static async fetchPopularPlaces(req, res) {
    try {
      let include = [
        {
          model: db.Station,
          as: 'station',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]
      const condition = {}
      const order = [['id', 'DESC']]
      const { response, meta } = await FindAll(
        'PopularPlace',
        condition,
        include,
        order
      )
      return res.status(status.OK).send({
        meta,
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
        message: error.message,
      })
    }
  }
}
