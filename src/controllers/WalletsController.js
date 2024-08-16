/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import { Create, FindAll, FindOne } from '../database/queries'
import DriverServices from '../services/DriverServices'

export default class WalletController {
  static async create(req, res) {
    const data = req.body
    try {
      const response = await Create('Wallet', data)
      return res.status(status.CREATED).send({
        message: 'Wallet created successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async topUp(req, res) {
    const { id } = req.params
    const { balance } = req.body
    try {
      const response = await FindOne('Wallet', id)
      if (!response) {
        return res.status(status.NOT_FOUND).send({
          message: 'Wallet not found',
        })
      }
      const newBalance = response.balance + balance
      const updated = await response.update({ balance: newBalance })

      return res.status(status.OK).send({
        message: 'Wallet updated successfully',
        updated,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async pay(req, res) {
    const { id } = req.params
    const { balance } = req.body
    try {
      const response = await FindOne('Wallet', id)
      if (!response) {
        return res.status(status.NOT_FOUND).send({
          message: 'Wallet not found',
        })
      }
      if (response.balance < balance) {
        return res.status(status.BAD_REQUEST).send({
          message: 'Insufficient balance, first top up your wallet',
        })
      }
      const newBalance = response.balance - balance
      const updated = await response.update({ balance: newBalance })
      return res.status(status.OK).send({
        message: 'Payed successfully',
        updated,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async findAll(req, res) {
    try {
      const response = await FindAll('Wallet')
      return res.status(status.OK).send({
        message: 'Wallets found successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  static async findOne(req, res) {
    const { id } = req.params
    try {
      const response = await FindOne('Wallet', id)
      return res.status(status.OK).send({
        message: 'Wallet found successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error,
      })
    }
  }

  // PAYOUT A DRIVER
  static async driverPayout(req, res) {
    try {
      // 2. FIND DRIVER'S WALLET
      const driverWallet = await FindOne('DriverWallet', {
        userId: req.params.id,
      })

      const response = await DriverServices.driverPayout(driverWallet)
      if (response.status === 200) {
        return res.status(status.NOT_FOUND).send({
          message: 'Driver has been payed out successfully',
          response,
        })
      } else if (response.status === 507) {
        return res.status(status.BAD_REQUEST).send({
          error: response.message,
        })
      } else {
        return res.status(status.BAD_REQUEST).send({
          error: 'Something wehen wrong while paying out. Try again later',
        })
      }
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
}
