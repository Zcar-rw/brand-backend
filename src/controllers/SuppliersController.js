/* eslint-disable require-jsdoc */
import 'dotenv/config';
import _ from 'lodash';
import db from '../database/models';
import * as helper from '../helpers';
import status from '../config/status';
import { FindAndCount, Create, FindOne } from '../database/queries';
import generateErrorResponse from '../helpers/generateErrorResponse';

export default class SuppliersController {
  static async createSupplier(req, res) {
    const { name, email, address, tin, userId } = req.body;
    const data = {
      name,
      email,
      address,
      tin,
      status: 'active',
      createdBy: userId,
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

      generateErrorResponse(error, res);
      return res.status(status.BAD_REQUEST).send({
        error: generateErrorResponse(error, res),
      });
      // return res.status(status.INTERNAL_SERVER_ERROR).send({
      //   error: 'Something went wrong, try again later',
      // });
    }
  }

  static async fetchSuppliers(req, res) {
    const { page, limit } = req.query;
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    const count = limit || 9;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * count;

    try {
      const condition = {};
      const include = [];
      const { response, meta } = await FindAndCount(
        'Supplier',
        condition,
        include,
        limit,
        offset,
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
      return res.status(status.BAD_REQUEST).send({
        error: 'Suppliers not found at this moment, try again later',
      });
    }
  }

  static async fetchSupplierDetails(req, res) {
    const { id } = req.params;

    try {
      const condition = {
        id,
      };
      const include = [];

      const supplier = await FindOne('Supplier', condition, include);
      if (_.isEmpty(supplier)) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No suppliers found!',
        });
      }
      const { response, meta } = await FindAndCount(
        'Car',
        {
          supplierId: id,
        },
        [
          {
            model: db.CarType,
            as: 'carType',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: db.CarMake,
            as: 'carMake',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      );
      return res.status(status.OK).json({
        cars: _.isEmpty(response) ? [] : response,
        supplier,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Suppliers not found at this moment, try again later',
      });
    }
  }

  static async fetchSupplierCars(req, res) {
    const { id } = req.params;
    const { page, limit } = req.query;
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    const count = limit || 9;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * count;

    try {
      const condition = {
        supplierId: id,
      };
      const include = [
        {
          model: db.CarType,
          as: 'carType',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.CarMake,
          as: 'carMake',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const { response, meta } = await FindAndCount(
        'Car',
        condition,
        include,
        limit,
        offset,
      );

      if (response && !response.length) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No cars found!',
        });
      }
      return res.status(status.OK).json({
        meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
        response,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Cars not found at this moment, try again later',
      });
    }
  }

  static async updateSupplier(req, res) {
    const { id } = req.params;
    const { name, email, address, tin } = req.body;
    const data = {
      name,
      email,
      address,
      tin,
    };
    try {
      const response = await db.Supplier.update(data, {
        where: {
          id,
        },
      });
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you can not update this supplier right now, try again later',
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

  static async updateSupplierStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const response = await db.Supplier.update(
        { status },
        {
          where: {
            id,
          },
        },
      );
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you can not update this supplier right now, try again later',
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
}
