import { includes } from 'lodash';
import status from '../config/status';
import db from '../database/models';
import {
  Create,
  FindAll,
  FindAndCount,
  FindOne,
  Update,
} from '../database/queries';
import * as helper from '../helpers';

export default class ScheduleController {
  static async createSchedule(req, res) {
    try {
      const {
        userId, // createdBy
        bookingId,
        carId, // Selected
        // customerId, // From Booking
        // driverId, // Later
        // createdBy, // userId
        priceListId,
        // status, // Later
        amount,
        // initialAmount, // From Company Schedule & CarType (Would need class to determine the real amount)
      } = req.body;

      const user = await FindOne('User', { id: userId });
      if (!user || Object.keys(user).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'User not found',
        });
      }

      const booking = await FindOne('Booking', { id: bookingId }, [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Company,
              as: 'company',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
        {
          model: db.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.BookingDetail,
          as: 'bookingDetails',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.CarType,
              as: 'car',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ]);
      if (!booking || Object.keys(booking).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking not found',
        });
      }
      if (booking?.status !== 'approved') {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking has not been approved by client',
        });
      }

      const car = await FindOne('Car', { id: carId }, [
        {
          model: db.CarModel,
          as: 'carModel',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.CarType,
              as: 'carType',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ]);
      if (!car || Object.keys(car).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car not found',
        });
      }
      if (booking?.bookingDetails?.carType !== car?.carModel?.typeId) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message:
            "The selected car's type does not match the client's selection",
        });
      }
      const pricing = await FindOne('PriceList', {
        companyId: booking?.customer?.company?.id,
        carTypeId: car?.carModel?.typeId,
      });
      if (!pricing || Object.keys(pricing).length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: "No pricing list found for this company's selected car type",
        });
      }
      const priceList = await FindOne('PriceList', {
        id: priceListId,
      });
      if (!priceList || Object.keys(priceList).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Price list not found',
        });
      }
      if (priceList?.carTypeId !== car?.carModel?.typeId) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Price list does not match the selected car type',
        });
      }
      if (priceList?.companyId !== booking?.customer?.companyId) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Price list does not match the selected company',
        });
      }

      const schedule = await Create('Schedule', {
        customerId: booking?.customerId,
        bookingId,
        carId,
        driverId: null,
        createdBy: userId,
        priceListId,
        amount,
        initialAmount: amount,
        status: 'pending',
      });

      return res.status(status.CREATED).json({
        status: 'success',
        message: 'Schedule created successfully',
        data: {
          ...schedule,
        },
      });
    } catch (error) {
      console.error('Schedule creation error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the schedule.',
      });
    }
  }

  static async getSchedules(req, res) {
    try {
      let { page, limit } = req.query;
      if (!page) {
        return res.status(status.BAD_REQUEST).send({
          response: [],
          error: 'Sorry, pagination parameters are required[page, limit]',
        });
      }
      const count = limit || 9;
      const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * count;

      const { response, meta } = await FindAndCount(
        'Schedule',
        {},
        [],
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'Schedules not found',
          response: [],
        });
      }
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error:
              'Schedules can not be retrieved at this moment, try again later',
          })
        : res.status(status.OK).json({
            meta: helper.generator.meta(
              meta.count,
              limit,
              parseInt(page, 10) || 1,
            ),
            response,
          });
    } catch (error) {
      console.error('Schedules retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving schedules.',
      });
    }
  }

  static async getSchedule(req, res) {
    try {
      const { id } = req.params;
      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.ScheduleDetail,
          as: 'scheduleDetails',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const schedule = await FindOne('Schedule', { id }, include);

      if (!schedule) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Schedule not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Schedule retrieved successfully',
        data: schedule,
      });
    } catch (error) {
      console.error('Schedule retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the schedule.',
      });
    }
  }

  static async getSchedulesByCustomer(req, res) {
    try {
      const { id } = req.params;

      const schedules = await FindAll('Schedule', { customerId: id });

      if (!schedules) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Schedules not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Schedules retrieved successfully',
        data: schedules,
      });
    } catch (error) {
      console.error('Schedules retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving schedules.',
      });
    }
  }

  static async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const { status: newStatus } = req.body;
      const schedule = await FindOne('Schedule', { id });

      if (!schedule) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Schedule not found',
        });
      }

      const updatedSchedule = await Update(
        'Schedule',
        { status: newStatus },
        { id },
      );

      return res.status(status.OK).json({
        status: 'success',
        message: 'Schedule updated successfully',
        data: updatedSchedule,
      });
    } catch (error) {
      console.error('Schedule update error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while updating the schedule.',
      });
    }
  }
}
