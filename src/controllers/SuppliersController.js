/* eslint-disable require-jsdoc */
import 'dotenv/config';
import db from '../database/models';
import { Op } from 'sequelize';
import * as helper from '../helpers';
import status from '../config/status';
import { FindAndCount, Create } from '../database/queries';

export default class CarsController {
  static async createSupplier(req, res) {
    const data = {
      ...req.body,
      status: 'active',
      createdBy: '6ba5829c-20e7-48bf-8aea-1b4ac64aae21',
    };
    try {
      // data.ownerId = req.user.user.id;
      const response = await Create('Supplier', data);
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you can not create a car right now, try again later',
          })
        : res.status(status.CREATED).json({
            response,
          });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        error: 'Something went wrong, try again later',
      });
    }
  }

  static async fetchSuppliers(req, res) {
    let { page, limit } = req.query;
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    limit = limit || 9;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;

    try {
      const condition = {
        // status: 'active',
      };
      const include = [
        {
          model: db.Profile,
          as: 'supplier',
          attributes: { exclude: ['firstName', 'lastName'] },
        },
      ];
      const { response, meta } = await FindAndCount(
        'Supplier',
        condition,
        include,
        limit,
        offset
      );
      if (response && !response.length) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No suppliers found!',
        });
      }
      return res.status(status.OK).json({
        meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
        response,
      });
    } catch (error) {
      console.log('error', error);
      return res.status(status.BAD_REQUEST).send({
        error: 'Suppliers not found at this moment, try again later',
      });
    }
  }
}
