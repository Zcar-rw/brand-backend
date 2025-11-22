import { Op } from 'sequelize';
import status from '../config/status';
import db from '../database/models';
import bookingDetails from '../database/models/bookingDetails';
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
        bookingDetailId,
        carId, // Selected
        // customerId, // From Booking
        driverId,
        // createdBy, // userId
        // priceListId,
        // status, // Default: created
        // amount,
        // initialAmount, // From Company Schedule & CarType (Would need class to determine the real amount)
      } = req.body;

      const user = await FindOne('User', { id: userId });
      if (!user || Object.keys(user).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'User not found',
        });
      }
      const driver = await FindOne('User', { id: driverId }, [
        {
          model: db.Role,
          as: 'role',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]);
      if (!driver || Object.keys(driver).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Driver not found',
        });
      }
      if (driver?.role?.name !== 'driver') {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Selected user must be a driver',
        });
      }

      const bookingDetail = await FindOne(
        'BookingDetail',
        { id: bookingDetailId },
        [
          {
            model: db.Booking,
            as: 'booking',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
              {
                model: db.Customer,
                as: 'customer',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
          {
            model: db.Schedule,
            as: 'schedule',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      );
      if (!bookingDetail || Object.keys(bookingDetail).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking not found',
        });
      }
      if (bookingDetail?.schedule) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking already has Schedule',
        });
      }
      const { booking } = bookingDetail;
      if (booking?.status !== 'approved') {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking has not yet been approved',
        });
      }

      const car = await FindOne('Car', { id: carId }, [
        {
          model: db.CarType,
          as: 'carType',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]);
      if (!car || Object.keys(car).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car not found',
        });
      }
      if (bookingDetail?.carType !== car?.carTypeId) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: "The selected car's type does not match the client's choice",
        });
      }

      const schedule = await Create('Schedule', {
        customerId: booking?.customerId,
        bookingDetailId,
        carId,
        driverId,
        createdBy: userId,
        status: 'created',
      });

      // await Create('Invoice', {
      //   customerId: schedule?.customerId,
      //   bookingId: schedule?.bookingId,
      //   status: 'pending',
      // });

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
      let { page, limit, plateId, startDate, endDate, customerQuery } =
        req.query;
      if (!page) {
        return res.status(status.BAD_REQUEST).send({
          response: [],
          error: 'Sorry, pagination parameters are required[page, limit]',
        });
      }
      const count = limit || 9;
      const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * count;
      const { userId } = req.body;
      const user = await FindOne('User', { id: userId }, [
        {
          model: db.Role,
          as: 'role',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Company,
          as: 'companies',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Customer,
              as: 'customers',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ]);
      if (!user || Object.keys(user)?.length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'User not found',
        });
      }

      let options = {};

      if (user.role.name === 'admin') {
        options = {};
        // if (
        //   startDate &&
        //   startDate !== 'undefined' &&
        //   startDate !== 'null' &&
        //   endDate &&
        //   endDate !== 'undefined' &&
        //   endDate !== 'null'
        // ) {
        //   options['$bookingDetail.date$'] = {
        //     ...(startDate && { [Op.gte]: startDate }),
        //     ...(endDate && { [Op.lte]: endDate }),
        //   };
        // }

        // if (startDate && endDate) {
        //   options = {
        //     ...options,
        //     '$bookingDetail.date$': {
        //       [db.Sequelize.Op.between]: [
        //         new Date(startDate),
        //         new Date(endDate),
        //       ],
        //     },
        //   };
        // } else if (startDate) {
        //   options = {
        //     ...options,
        //     '$bookingDetail.date$': {
        //       [db.Sequelize.Op.gte]: new Date(startDate),
        //     },
        //   };
        // } else if (endDate) {
        //   options = {
        //     ...options,
        //     '$bookingDetail.date$': {
        //       [db.Sequelize.Op.lte]: new Date(endDate),
        //     },
        //   };
        // }
      } else if (
        user.role.name === 'cooperate-owner' &&
        (!user ||
          !Array.isArray(user.companies) ||
          user.companies.length === 0 ||
          !Array.isArray(user.companies[0].customers) ||
          user.companies[0].customers.length > 0)
      ) {
        options = {
          customerId: user.companies[0].customers[0].id,
        };
      } else if (user.role.name === 'driver') {
        options = {
          driverId: userId,
        };
      }

      if (plateId && plateId !== 'undefined' && plateId !== 'null') {
        options = {
          ...options,
          carId: plateId,
        };
      }

      const include = [
        {
          model: db.User,
          as: 'driver',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        // {
        //   model: db.Customer,
        //   as: 'customer',
        //   attributes: { exclude: ['createdAt', 'updatedAt'] },
        //   include: [
        //     {
        //       model: db.Company,
        //       as: 'company',
        //       attributes: { exclude: ['createdAt', 'updatedAt'] },
        //       where: {
        //         ...(customerQuery && {
        //           name: {
        //             [db.Sequelize.Op.iLike]: `%${customerQuery}%`,
        //           },
        //         }),
        //       },
        //     },
        //   ],
        // },`
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Company,
              as: 'company',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              where: {
                ...(customerQuery && {
                  name: {
                    [db.Sequelize.Op.iLike]: `%${customerQuery}%`,
                  },
                }),
              },
              required: true,
            },
          ],
          required: true,
        },
        {
          model: db.BookingDetail,
          as: 'bookingDetail',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Booking,
              as: 'booking',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
          where: {
            ...(startDate &&
              endDate && {
                date: {
                  [db.Sequelize.Op.between]: [
                    new Date(startDate),
                    new Date(endDate),
                  ],
                },
              }),
            ...(startDate &&
              !endDate && {
                date: {
                  [db.Sequelize.Op.gte]: new Date(startDate),
                },
              }),
            ...(!startDate &&
              endDate && {
                date: {
                  [db.Sequelize.Op.lte]: new Date(endDate),
                },
              }),
          },
        },
        {
          model: db.Car,
          as: 'car',
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
      ];
      const { response, meta } = await FindAndCount(
        'Schedule',
        options,
        include,
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'No schedules found',
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

      console.log(id, 'ID');

      const include = [
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
          model: db.BookingDetail,
          as: 'bookingDetail',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.Booking,
              as: 'booking',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
        {
          model: db.Car,
          as: 'car',
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

  static async getScheduleByBookingid(req, res) {
    try {
      const { id } = req.params;

      const schedule = await FindOne('Schedule', { bookingId: id }, [
        {
          model: db.Car,
          as: 'car',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.PriceList,
          as: 'priceList',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]);

      if (!schedule) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Schedule not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Booking Schedule retrieved successfully',
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

  static async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const schedule = await FindOne('Schedule', { id });

      if (!schedule || Object.keys(schedule).length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Schedule not found',
        });
      }
      const updatedSchedule = await Update('Schedule', { ...req.body }, { id });

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
