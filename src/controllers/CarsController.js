/* eslint-disable require-jsdoc */
import 'dotenv/config';
// import { Op } from 'sequelize';
import _ from 'lodash';
import db from '../database/models';
import * as helper from '../helpers';
import status from '../config/status';
import * as template from '../templates';
import {
  Create,
  Update,
  Search,
  FindAll,
  FindAndCount,
} from '../database/queries';

export default class CarsController {
  static async createCar(req, res) {
    const data = {
      ...req.body,
      status: 'active',
      createdBy: req.body.userId,
      plateNumber: req.body.plateNumber.toUpperCase(),
    };
    console.log('data', data);
    // data.ownerId = req.user.user.id;
    // data.typeId = req.body.brandType;
    // data.carMakeId = req.body.brandName;

    // const { carMakeName } = await CarServices.getCarMakeNameByCarMakeId(
    //   req.body.brandName
    // );

    // data.name = carMakeName;

    try {
      // 1. Check if platenumber's or VIN's car exist
      // const isPlateNumberExist = await CarServices.getCarByPlateNumber(
      //   data.plateNumber
      // );

      // if (isPlateNumberExist) {
      //   return res.status(status.EXIST).json({
      //     error: 'Car of this plate number or VIN is already exists',
      //   });
      // }

      // 2. Create a Car
      const response = await Create('Car', data);

      // 3. create a CarMeta
      // data.year = req.body.year;

      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you can not create a car right now, try again later',
          })
        : res.status(status.CREATED).json({
            response,
          });
    } catch (error) {
      console.log('err', error);
      return res.status(status.BAD_REQUEST).json();
    }
  }

  static async getCarsByOwner(req, res) {
    let { page, limit } = req.query;

    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    limit = limit || 5;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;

    const { id } = req.params;
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
    const condition = {
      ownerId: id,
    };
    const { response, meta } = await FindAndCount(
      'Car',
      condition,
      include,
      limit,
      offset,
    );

    if (response && !response.length) {
      return res.status(status.NOT_FOUND).send({
        response: [],
        error: 'Sorry, No cars found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Cars not found at this moment, try again later',
        })
      : res.status(status.OK).json({
          meta: helper.generator.meta(
            meta.count,
            limit,
            parseInt(page, 10) || 1,
          ),
          response,
        });
  }

  static async getAdminsCars(req, res) {
    try {
      let { page, limit } = req.query;
      if (!page) {
        return res.status(status.BAD_REQUEST).send({
          response: [],
          error: 'Sorry, pagination parameters are required[page, limit]',
        });
      }
      limit = limit || 20;
      const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;

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
        {
          model: db.CarMeta,
          as: 'carMeta',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.User,
          as: 'user',
        },
      ];
      const condition = {};
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

  static async getPublicCars(req, res) {
    let { page, limit } = req.query;
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    limit = limit || 9;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;

    const include = [
      {
        model: db.CarModel,
        as: 'carModel',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: db.CarMake,
            as: 'carMake',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: db.CarType,
            as: 'carType',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
      {
        model: db.Supplier,
        as: 'supplier',
        attributes: { exclude: ['createdAt', 'updatedAt', 'createdBy', 'tin'] },
      },
    ];
    const attributes = [
      'id',
      'plateNumber',
      // 'model',
      'supplierId',
      // 'typeId',
      // 'carMakeId',
      'amount',
      'baseAmount',
      // 'photo',
      'status',
      // 'year',
      'createdBy',
      'createdAt',
      'updatedAt',
    ];
    try {
      const condition = {
        status: 'active',
      };

      // const { response, meta } = await FindAndCount(
      //   'Car',
      //   condition,
      //   include,
      //   limit,
      //   offset,
      //   attributes
      // );
      const response = await db.Car.findAndCountAll(
        {
          where: condition,
          attributes,
          include,
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        },
        { logging: false, raw: true },
      );
      // return {
      //   response: response.rows,
      //   meta: { count: response.count || null },
      // };
      if (_.isEmpty(response)) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No cars found!',
        });
      }
      return res.status(status.OK).json({
        meta: helper.generator.meta(
          response.count,
          limit,
          parseInt(page, 10) || 1,
        ),
        response: response.rows,
      });
    } catch (error) {
      console.log('error', error);
      return res.status(status.BAD_REQUEST).send({
        error: 'Cars not found at this moment, try again later',
      });
    }
  }

  static async searchCars(req, res) {
    const { key } = req.query;

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
      {
        model: db.CarMeta,
        as: 'carMeta',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: db.RentingInformation,
        as: 'RentingInformation',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ];
    const field = 'name';
    const { response, meta } = await Search('Car', key, field, include);
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No cars found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Cars not found at this moment, try again later',
        })
      : res.status(status.OK).json({
          meta,
          response,
        });
  }

  static async getOneCar(req, res) {
    return req.car && req.car.status === 'Available'
      ? res.status(status.OK).json({
          response: req.car,
        })
      : res.status(status.NOT_FOUND).send({
          error: 'The car you are looking for can not be found at this moment.',
        });
  }

  static async getAdminOneCar(req, res) {
    return req.car
      ? res.status(status.OK).json({
          response: req.car,
        })
      : res.status(status.NOT_FOUND).send({
          error: 'The car you are looking for can not be found at this moment.',
        });
  }

  static async updateCar(req, res) {
    const { carId } = req.body;
    const data = req.body;
    delete data.userId;
    const response = await Update('Car', data, {
      id: carId,
    });
    return response && response
      ? res.status(status.OK).json({
          response,
        })
      : res.status(status.NOT_FOUND).send({
          error: 'The car can not be updated at this moment.',
        });
  }

  static async getUserCars(req, res) {
    try {
      const { userId } = req.params;

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
        {
          model: db.CarMeta,
          as: 'carMeta',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];
      const condition = {
        userId,
      };
      const { response, meta } = await FindAll('Car', condition, include);
      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'Sorry, No cars found!',
        });
      }
      return res.status(status.OK).json({
        response,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Cars not found at this moment, try again later',
      });
    }
  }

  static async getCarsBySupplier(req, res) {
    try {
      const { supplierId } = req.params;

      const include = [
        {
          model: db.CarModel,
          as: 'carModel',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.CarMake,
              as: 'carMake',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: db.CarType,
              as: 'carType',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
        {
          model: db.Supplier,
          as: 'supplier',
          attributes: { exclude: ['createdAt', 'updatedAt', 'createdBy', 'tin'] },
        },
      ];
      const { response, meta } = await FindAll('Car', {
        supplierId,
      }, include);
      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'Sorry, No cars found!',
        });
      }
      return res.status(status.OK).json({
        response,
      });
    } catch (error) {
      console.log(error)
      return res.status(status.BAD_REQUEST).send({
        error: 'Cars not found at this moment, try again later',
      });
    }
  }
}
