/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import { Op } from 'sequelize'
import { Create, FindAll } from '../database/queries'

export default class InsuranceController {
  static async createInsurance(req, res) {
    const data = req.body
    data.userId = req.body.userId
    try {
      const response = await Create('Insurance', data)
      return res.status(status.CREATED).json({
        message: 'Insurance has been created successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
        message:
          'We could not save this insurance record right not, try again later',
      })
    }
  }

  static async getActiveInsuranceByCar(req, res) {
    const include = []
    const order = [['insuranceExpireDate', 'DESC']]
    const where = {
      insuranceExpireDate: { [Op.lt]: new Date() },
      carId: req.car.id,
    }
    const { response } = await FindAll('Insurance', where, include, order)
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
}
