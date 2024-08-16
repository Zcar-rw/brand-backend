/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import { Create, FindOne, Delete, FindAll, Update } from '../database/queries'

export default class AddressController {
  static async createAddress(req, res) {
    const data = req.body
    const where = {
      userId: req.body.userId,
    }
    try {
      const include = []
      const exist = await FindAll('Address', where, include)
      if (!exist.response.length) {
        data.default = true
      }
      const response = await Create('Address', data)
      return res.status(status.CREATED).json({
        message: 'Address created successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async getAllAddresses(req, res) {
    const include = []
    const { response } = await FindAll('Address', {}, include)
    if (Object.keys(response).length === 0) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No addresses found!',
      })
    }
    return res.status(status.OK).json({
      message: 'Addresses retrieved successfully',
      response,
    })
  }

  static async getAddressById(req, res) {
    const where = {
      id: req.params.id,
    }
    const include = []
    const response = await FindOne('Address', where, include)
    return res.status(status.OK).json({
      message: 'Address retrieved successfully',
      response,
    })
  }
  static async getAddressByUser(req, res) {
    const where = {
      userId: req.body.userId,
    }
    const include = []
    const order = [
      ['default', 'DESC'],
      ['createdAt', 'DESC'],
    ]
    const response = await FindAll('Address', where, include, order)
    return res.status(status.OK).json({
      message: 'Address retrieved successfully',
      response,
    })
  }
  static async getDefaultAddress(req, res) {
    const where = {
      userId: req.body.userId,
      default: true,
    }
    const include = []
    const response = await FindOne('Address', where, include)
    return res.status(status.OK).json({
      message: 'Address retrieved successfully',
      response,
    })
  }

  static async updateAddress(req, res) {
    const data = req.body
    const where = {
      id: req.params.id,
    }
    const response = await Update('Address', data, where)
    try {
      return res.status(status.OK).json({
        message: 'Address updated successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
  static async setDefaultAddress(req, res) {
    const data = req.body
    const where = {
      id: req.params.id,
    }
    try {
      const updateAll = await Update(
        'Address',
        {
          default: false,
        },
        {
          userId: req.body.userId,
        }
      )
      const response = await Update('Address', data, where)
      return res.status(status.OK).json({
        message: 'Address updated successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }

  static async deleteAddress(req, res) {
    const where = {
      id: req.params.id,
    }
    const response = await Delete('Address', where)
    try {
      return res.status(status.OK).json({
        message: 'Address deleted successfully',
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
}
