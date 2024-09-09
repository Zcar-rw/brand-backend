/* eslint-disable require-jsdoc */
import 'dotenv/config';
import _ from 'lodash';
import status from '../config/status';
import { FindAll } from '../database/queries';

/**
 * A class to handle cars
 */
export default class RolesController {
  static async getAllRoles(req, res) {
    const include = [];
    const condition = {};
    const { response, meta } = await FindAll('Role', condition, include);

    if (_.isEmpty(response)) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No type found!',
      });
    }

    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Roles not found at this moment, try again later',
        })
      : res.status(status.OK).json({
          meta,
          response,
        });
  }
}
