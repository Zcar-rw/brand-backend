/* eslint-disable require-jsdoc */
import 'dotenv/config';
import { FindAll } from '../database/queries';
import status from '../config/status';

export default class BanksController {
  static async getAllBanks(req, res) {
    const include = [];
    const order = [['name', 'ASC']];
    const { response } = await FindAll('Bank', {}, include, order);
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No banks found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
        error: 'Banks not found at this moment, try again later',
      })
      : res.status(status.OK).json({
        message: 'Banks retrieved successfully',
        response
      });
  }
}
