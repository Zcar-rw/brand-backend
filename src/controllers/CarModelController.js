import 'dotenv/config';
import db from '../database/models';
import status from '../config/status';
import { FindAndCount, Create, FindOne } from '../database/queries';
import * as helper from '../helpers';
import generateErrorResponse from '../helpers/generateErrorResponse';

/**
 * A class to handle cars models
 */
export default class CarTypesController {
  static async getAllModels(req, res) {
    let { page, limit } = req.query;

    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    limit = limit || 5;
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
    ];
    const condition = {};
    const order = [['name', 'DESC']];
    const { response, meta } = await FindAndCount(
      'CarModel',
      condition,
      include,
      limit,
      offset,
    );

    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No model found!',
      });
    }

    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Car model not found at this moment, try again later',
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

  static async createModel(req, res) {
    const { name, year, typeId, carMakeId, photo, userId } = req.body;

    const data = {
      name,
      year,
      typeId,
      carMakeId,
      photo,
      status: 'active',
      createdBy: userId,
    };
    try {
      // data.ownerId = req.user.user.id;
      const carMake = await FindOne('CarMake', { id: carMakeId });
      if (!carMake) {
        return res.status(status.BAD_REQUEST).send({
          error: 'Sorry, car make not found!',
        });
      }
      const carType = await FindOne('CarType', { id: typeId });
      if (!carType) {
        return res.status(status.BAD_REQUEST).send({
          error: 'Sorry, car type not found!',
        });
      }
      const response = await Create('CarModel', data);
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error:
              'Sorry, you can not create a car model right now, try again later',
          })
        : res.status(status.CREATED).json({
            response,
          });
    } catch (error) {
      console.log('rerr', error);
      generateErrorResponse(error, res);
      return res.status(status.BAD_REQUEST).send({
        error: generateErrorResponse(error, res),
      });
    }
  }

  static async updateModel(req, res) {
    const { id } = req.params;
    const { name, year, typeId, carMakeId, photo, userId } = req.body;

    const data = {
      name,
      year,
      typeId,
      carMakeId,
      photo,
      updatedBy: userId,
    };
    try {
      const response = await db.CarModel.update(data, {
        where: { id },
        returning: true,
      });

      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you can not update this model right now, try again later',
          })
        : res.status(status.OK).json({
            response: response[1],
          });
    } catch (error) {
      generateErrorResponse(error, res);
      return res.status(status.BAD_REQUEST).send({
        error: generateErrorResponse(error, res),
      });
    }
  }

  static async updateModelStatus(req, res) {
    const { id } = req.params;
    const { status, userId } = req.body;

    const data = {
      status,
      updatedBy: userId,
    };
    try {
      const response = await db.CarModel.update(data, {
        where: { id },
        returning: true,
      });

      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you can not update this model right now, try again later',
          })
        : res.status(status.OK).json({
            response: response[1],
          });
    } catch (error) {
      generateErrorResponse(error, res);
      return res.status(status.BAD_REQUEST).send({
        error: generateErrorResponse(error, res),
      });
    }
  }

  // static async listModelsByCars(req, res) {
  //   const { carMakeId } = req.params;
  //   const include = [
  //     {
  //       model: db.CarType,
  //       as: 'carType',
  //       attributes: { exclude: ['createdAt', 'updatedAt'] },
  //     },
  //     {
  //       model: db.CarMake,
  //       as: 'carMake',
  //       attributes: { exclude: ['createdAt', 'updatedAt'] },
  //     },
  //   ];
  //   const condition = {
  //     carMakeId,
  //   };
  //   const order = [['name', 'DESC']];
  //   const { response } = await FindAndCount('CarModel', condition, include);

  //   if (response && !response.length) {
  //     return res.status(status.NO_CONTENT).send({
  //       response: [],
  //       error: 'Sorry, No model found!',
  //     });
  //   }

  //   return response && response.errors
  //     ? res.status(status.BAD_REQUEST).send({
  //         error: 'Car model not found at this moment, try again later',
  //       })
  //     : res.status(status.OK).json({
  //         response,
  //       });
  // }
}
