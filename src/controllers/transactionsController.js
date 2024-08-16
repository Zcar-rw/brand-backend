/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import db from '../database/models'
import { FindAll, FindOne, FindAndCount } from '../database/queries'
import * as helper from '../helpers'

export default class TransactionsController {
  static async FindOne(req, res) {
    const { id } = req.params
    try {
      const response = await FindOne('Transactions', id)
      if (!response) {
        return res.status(status.NOT_FOUND).send({
          message: 'Transactions not found',
        })
      }
      return res.status(status.OK).send({
        message: 'Transactions found successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async FindAll(req, res) {
    try {
      const response = await FindAll('Transactions')
      return res.status(status.OK).send({
        message: 'Transactions found successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async getTransactionsByRider(req, res) {
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

      const { id: userId, riderWalletId } = req.user

      const include = [
        {
          model: db.RiderWallet,
          as: 'riderwallet',
        },
        {
          model: db.DriverWallet,
          as: 'driverwallet',
        },
        {
          model: db.TransitWallet,
          as: 'transitwallet',
        },
      ]

      const condition = {
        userId,
        riderWalletId,
      }

      const { response, meta } = await FindAndCount(
        'Transactions',
        condition,
        include,
        limit,
        offset
      )
      if (!response.length) {
        return res.status(status.OK).json({
          message: 'Transactions not found at this moment!',
        })
      }
      return res.status(status.OK).json({
        response,
        meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async getTransactionsByDriver(req, res) {
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

      const { id: userId, driverWalletId } = req.user

      const include = [
        {
          model: db.RiderWallet,
          as: 'riderwallet',
        },
        {
          model: db.DriverWallet,
          as: 'driverwallet',
        },
        {
          model: db.TransitWallet,
          as: 'transitwallet',
        },
      ]
      const condition = {
        userId,
        driverWalletId,
      }

      const { response, meta } = await FindAndCount(
        'Transactions',
        condition,
        include,
        limit,
        offset
      )

      if (!response.length) {
        return res.status(status.OK).json({
          message: 'Transactions not found at this moment!',
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

  static async getTransactionsByAdmin(req, res) {
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
          model: db.RiderWallet,
          as: 'riderwallet',
          include: [
            {
              model: db.User,
              as: 'rider',
              attributes: {
                exclude: ['password'],
              },
              include: [
                {
                  model: db.Profile,
                  as: 'user',
                },
              ],
            },
          ],
        },
        {
          model: db.DriverWallet,
          as: 'driverwallet',
          include: [
            {
              model: db.User,
              as: 'driver',
              attributes: {
                exclude: ['password'],
              },
              include: [
                {
                  model: db.Profile,
                  as: 'user',
                },
              ],
            },
          ],
        },
        {
          model: db.TransitWallet,
          as: 'transitwallet',
        },
      ]

      const { response, meta } = await FindAndCount(
        'Transactions',
        {},
        include,
        limit,
        offset
      )

      if (!response.length) {
        return res.status(status.OK).json({
          message: 'Transactions not found at this moment!',
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

  static async getUserTransactions(req, res) {
    const { userId } = req.params
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
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Profile,
            as: 'user',
          },
        ],
      },
      {
        model: db.RiderWallet,
        as: 'riderwallet',
      },
      {
        model: db.DriverWallet,
        as: 'driverwallet',
      },
    ]
    try {
      const { response, meta } = await FindAndCount(
        'Transactions',
        { userId },
        include,
        limit,
        offset
      )
      if (!Object.keys(response).length) {
        return res.status(status.NOT_FOUND).send({
          message: 'Transactions for this user not found',
        })
      }
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
}
