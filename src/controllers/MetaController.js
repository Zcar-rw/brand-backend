import 'dotenv/config'
import status from '../config/status'
import { Create, FindOne } from '../database/queries'

/**
 * A class to handle cars
 */
export default class MetaController {
  /**
   * @description create meta
   * @param {object} req request from user
   * @param {object} res response from server
   * @return {object} user information & token
   */
  static async createMeta(req, res) {
    const data = req.body
    try {
      const exit = await FindOne('CarMeta', { carId: req.body.carId })
      if (Object.keys(exit).length === 0) {
        const response = await Create('CarMeta', data)
        return res.status(status.CREATED).json({
          response,
        })
      } else {
        return res.status(status.EXIST).json({
          error:
            'Features and additional information for this car already exists',
        })
      }
    } catch (error) {
      console.error('###error', error)
      return res.status(status.BAD_REQUEST).send({
        error: error.name,
      })
    }
  }
}
