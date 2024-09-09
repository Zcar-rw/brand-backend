/* eslint-disable require-jsdoc */
import 'dotenv/config';
import _ from 'lodash';
import { FindOne } from '../database/queries';
import db from '../database/models';

export default class CarServices {
  static async getCarMakeNameByCarMakeId(carMakeId) {
    const carMake = await FindOne('CarMake', { id: carMakeId });
    return { carMakeName: carMake.name };
  }

  static async getCarByPlateNumber(plateNumber) {
    const car = await FindOne('Car', { plateNumber });
    if (!_.isEmpty(car)) {
      return true;
    }
    return false;
  }

  static async getMyCarById(id, userId) {
    const condition = {
      id,
      userId,
    };
    const include = [
      {
        model: db.CarMeta,
        as: 'carMeta',
      },
      {
        model: db.CarMake,
        as: 'carMake',
      },
    ];
    const response = await FindOne('Car', condition, include);
    if (!Object.keys(response).length) {
      return false;
    }
    return response;
  }
}
