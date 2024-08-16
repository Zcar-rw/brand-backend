import 'dotenv/config'
import status from '../config/status'
import { FindAll } from '../database/queries'

/**
 * A class to handle cars
 */
export default class CarTypesController {
  static async getAllTypes(req, res) {
    let include = []
    const condition = {
      favorite: true,
    }
    const order = [
      ['name', 'DESC'],
    ]
    const { response, meta } = await FindAll('CarType', condition, include, order)
    if (response && !response.length)
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No type found!',
      })
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Car types not found at this moment, try again later',
        })
      : res.status(status.OK).json({
          meta,
          response,
        })
  }
}
