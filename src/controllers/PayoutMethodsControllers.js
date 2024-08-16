import 'dotenv/config';
import status from '../config/status';
import db from '../database/models';
import { Create, FindAll, FindOne } from '../database/queries';

export default class PayoutMethodsControllers {
  static async createPayoutMethod(req, res) {
    const data = req.body;
    const where = {
      default: true,
    };
    const include = [];
    const existDefault = await FindOne('PayoutMethod', where, include);
    if (Object.keys(existDefault).length === 0) {
      data.default = true;
    }
    const response = await Create('PayoutMethod', data);
    return res.status(status.CREATED).json({
      message: 'PayoutMethod created successfully',
      response,
    });
  }

  static async getPayoutMethod(req, res) {
    const where = {
      userId: req.body.userId
    };
    const include = [];
    const { response } = await FindAll('PayoutMethod', where, include);
    return res.status(status.OK).json({
      message: 'Payout Method retrieved successfully',
      response,
    });
  }

  static async getAllPayoutMethodsByAdmin(req, res) {
    const where = {};
    const include = [
      {
        model: db.User,
        as: 'user',
      }
    ];
    const { response } = await FindAll('PayoutMethod', where, include);
    return res.status(status.OK).json({
      message: 'Payout Methods retrieved successfully',
      response,
    });
  }
}