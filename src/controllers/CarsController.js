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
  FindOne,
} from '../database/queries';

export default class CarsController {
  static async createCar(req, res) {
    const data = {
      ...req.body,
      status: req.body.status || 'active',
      createdBy: req.user?.id || req.body.userId,
      plateNumber: req.body.plateNumber.toUpperCase(),
    };

    try {
      // 1. Validate plate number format (Rwandan format: RXX###X)
      const plateRegex = /^R[A-Z]{2}\d{3}[A-Z]$/;
      if (!plateRegex.test(data.plateNumber)) {
        return res.status(status.BAD_REQUEST).json({
          error: 'Invalid plate number format. Use RXX###X (e.g., RAA001A)',
        });
      }

      // 2. Check if plate number already exists
      const existingCar = await db.Car.findOne({ where: { plateNumber: data.plateNumber } });
      if (existingCar) {
        return res.status(status.CONFLICT).json({
          error: 'A car with this plate number already exists',
        });
      }

      // 3. Create the car
      const response = await Create('Car', data);

      // 4. Create default discount tiers if baseAmount is provided
      if (response && response.id && data.baseAmount) {
        const discountTiers = [
          { minDays: 1, maxDays: 1, discountPercent: 0 },      // 1 day = 0%
          { minDays: 2, maxDays: 7, discountPercent: 20 },     // 2-7 days = 20%
          { minDays: 8, maxDays: 14, discountPercent: 30 },    // 8-14 days = 30%
          { minDays: 15, maxDays: null, discountPercent: 40 }, // 15+ days = 40%
        ];

        for (const tier of discountTiers) {
          await Create('DiscountTier', {
            carId: response.id,
            ...tier,
            status: 'active',
          });
        }
      }

      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you cannot create a car right now, try again later',
          })
        : res.status(status.CREATED).json({
            response,
          });
    } catch (error) {
      console.error('Error creating car:', error);
      return res.status(status.BAD_REQUEST).json({
        error: error?.message || 'Failed to create car',
      });
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
      return res.status(status.BAD_REQUEST).send({
        error: 'Cars not found at this moment, try again later',
      });
    }
  }

  static async assignCarToOwner(req, res) {
    try {
      const { carId } = req.params;
      const { ownerId } = req.body;

      console.log('Attempting to assign car:', { carId, ownerId, params: req.params, body: req.body });
      
      if (!ownerId) {
        return res.status(status.BAD_REQUEST).json({
          error: 'Owner ID is required',
        });
      }
      
      // 1. Check if car exists (using FindOne from queries which works with Mongoose)
      const car = await FindOne('Car', { _id: carId });
      console.log('Car found for assignment:', car);
      if (!car || !car.id) {
        return res.status(status.NOT_FOUND).json({
          error: 'Car not found',
        });
      }
      
      // 2. Check if car is already assigned to an owner
      if (car.ownerId) {
        return res.status(status.CONFLICT).json({
          error: 'This car is already assigned to another owner',
        });
      }

      // 3. Check if owner exists
      const owner = await FindOne('Owner', { _id: ownerId });
      if (!owner || !owner.id) {
        return res.status(status.NOT_FOUND).json({
          error: 'Owner not found',
        });
      }

      // 4. Assign car to owner
      const response = await Update('Car', { ownerId }, { _id: carId });

      return res.status(status.OK).json({
        response,
        message: 'Car successfully assigned to owner',
      });
    } catch (error) {
      console.error('Error assigning car to owner:', error);
      return res.status(status.BAD_REQUEST).json({
        error: 'Failed to assign car to owner',
      });
    }
  }

  static async unassignCarFromOwner(req, res) {
    try {
      const { carId } = req.params;

      // 1. Check if car exists
      const car = await FindOne('Car', { _id: carId });
      if (!car || !car.id) {
        return res.status(status.NOT_FOUND).json({
          error: 'Car not found',
        });
      }

      // 2. Check if car is assigned
      if (!car.ownerId) {
        return res.status(status.BAD_REQUEST).json({
          error: 'This car is not assigned to any owner',
        });
      }

      // 3. Unassign car from owner
      const response = await Update('Car', { ownerId: null }, { _id: carId });

      return res.status(status.OK).json({
        response,
        message: 'Car successfully unassigned from owner',
      });
    } catch (error) {
      console.error('Error unassigning car from owner:', error);
      return res.status(status.BAD_REQUEST).json({
        error: 'Failed to unassign car from owner',
      });
    }
  }

  static async getCarDiscountTiers(req, res) {
    try {
      const { carId } = req.params;

      const { response } = await FindAll('DiscountTier', { carId }, []);
      
      return res.status(status.OK).json({
        response: response || [],
      });
    } catch (error) {
      console.error('Error fetching discount tiers:', error);
      return res.status(status.BAD_REQUEST).json({
        error: 'Failed to fetch discount tiers',
      });
    }
  }

  static async getCarsByCreatedBy(req, res) {
    try {
      let { page, limit } = req.query;

      if (!page) {
        return res.status(status.BAD_REQUEST).send({
          response: [],
          error: 'Sorry, pagination parameters are required[page, limit]',
        });
      }

      limit = limit || 10;
      const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;

      // Get the user ID from the authenticated user (req.user set by verifyToken middleware)
      const createdBy = req.user.id;

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

      const { response, meta } = await FindAndCount(
        'Car',
        { createdBy },
        include,
        limit,
        offset,
      );

      if (response && !response.length) {
        return res.status(status.OK).send({
          response: [],
          meta: {
            total: 0,
            pages: 0,
            currentPage: parseInt(page, 10),
          },
        });
      }

      return res.status(status.OK).json({
        response,
        meta: helper.generator.meta(
          meta.count,
          limit,
          parseInt(page, 10) || 1,
        ),
      });
    } catch (error) {
      console.error('Error fetching cars by creator:', error);
      return res.status(status.BAD_REQUEST).send({
        error: 'Cars not found at this moment, try again later',
      });
    }
  }
}
