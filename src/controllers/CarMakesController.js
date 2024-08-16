import 'dotenv/config';
import status from '../config/status';
import { FindAll } from '../database/queries';

/**
 * A class to handle cars
 */
export default class CarMakesController {
  static async getAllMakes(req, res) {
    const include = [];
    const order = [['name', 'ASC']];
    const { response, meta } = await FindAll('CarMake', undefined, include, order);
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No car bands found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
        error: 'Car brands not found at this moment, try again later',
      })
      : res.status(status.OK).json({
        meta,
        response,
      });
  }
}
