import status from '../config/status';
import db from '../database/models';
import {
  Create,
  Delete,
  FindAll,
  FindAndCount,
  FindOne,
  Update,
} from '../database/queries';
import moment from 'moment';
import * as helper from '../helpers';

export default class BookingController {
  static async createBooking(req, res) {
    try {
      const {
        customerId,
        service,
        message,
        carType,
        date,
        quantity,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        dropoffTime,
        userId,
      } = req.body;

      const enteredCarType = await FindOne('CarType', { id: carType });
      if (!enteredCarType) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car type not found',
        });
      }

      const booking = await Create('Booking', {
        createdBy: userId,
        customerId,
        service,
        message,
        status: 'pending',
      });

      if (!booking) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking creation failed',
        });
      } else {
        await Create('BookingDetails', {
          bookingId: booking.id,
          carType,
          date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
          quantity,
          pickupLocation,
          dropoffLocation,
          pickupTime,
          dropoffTime,
        });
      }
      return res.status(status.CREATED).json({
        status: 'success',
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Booking creation error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the booking.',
      });
    }
  }

  static async createMultipleBookings(req, res) {
    try {
      const { details, info, userId } = req.body;
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
      if (
        !user ||
        !Array.isArray(user.companies) ||
        user.companies.length === 0 ||
        !Array.isArray(user.companies[0].customers) ||
        user.companies[0].customers.length === 0
      ) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Customer not found',
        });
      }
      const customer = await FindOne('Customer', {
        id: user?.companies[0].customers[0]?.id,
      });
      if (!customer) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Customer not found',
        });
      }
      const bookingPromises = details.map(async (detail) => {
        const {
          // customerId,
          carType,
          date,
          quantity,
          pickupLocation,
          dropoffLocation,
          pickupTime,
          dropoffTime,
        } = detail;

        const { service, message } = info;

        const enteredCarType = await FindOne('CarType', { id: carType });
        if (!enteredCarType) {
          return res.status(status.BAD_REQUEST).json({
            status: 'error',
            message: 'Car type not found',
          });
        }
        const newBooking = await Create('Booking', {
          createdBy: userId,
          customerId: user?.companies[0]?.customers[0]?.id,
          service,
          message,
          status: 'pending',
        });

        if (!newBooking) {
          return res.status(status.BAD_REQUEST).json({
            status: 'error',
            message: 'Booking creation failed',
          });
        } else {
          await Create('BookingDetail', {
            bookingId: newBooking.id,
            carType,
            date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
            quantity,
            pickupLocation,
            dropoffLocation,
            pickupTime,
            dropoffTime,
          }).catch(async (err) => {
            await Delete('Booking', {
              id: newBooking.id,
            });
          });
        }
      });

      Promise.all(bookingPromises)
        .then(() => {
          return res.status(status.CREATED).json({
            status: 'success',
            message: 'Bookings created successfully',
          });
        })
        .catch((error) => {
          console.error('Multiple bookings creation error:', error);
          return res.status(status.BAD_REQUEST).json({
            status: 'error',
            message: 'An error occurred while creating the bookings.',
            data: error,
          });
        });
    } catch (error) {
      console.error('Booking creation error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the booking.',
      });
    }
  }

  static async getBookings(req, res) {
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
      if (!user) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'User not found',
        });
      }

      // if (!page) {
      //   return res.status(status.BAD_REQUEST).send({
      //     response: [],
      //     error: 'Sorry, pagination parameters are required[page, limit]',
      //   });
      // }
      // limit = limit || 5;
      // const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;

      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
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
      ];

      let options = {};

      if (user.role.name === 'admin') {
        options = {};
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
      }

      const { response, meta } = await FindAndCount(
        'Booking',
        options,
        include,
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'Bookings not found',
          response: [],
        });
      }
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error:
              'Bookings can not be retrieved at this moment, try again later',
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
      console.error('Bookings retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving bookings.',
      });
    }
  }

  static async getBooking(req, res) {
    try {
      const { id } = req.params;
      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.BookingDetail,
          as: 'bookingDetails',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const booking = await FindOne('Booking', { id }, include);

      if (!booking) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Booking retrieved successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Booking retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the booking.',
      });
    }
  }

  static async getBookingByCompany(req, res) {
    try {
      const { id } = req.params;
      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const booking = await FindOne('Booking', { id }, include);

      if (!booking) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Booking retrieved successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Booking retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the booking.',
      });
    }
  }

  static async getBookingsByCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const bookings = await FindAll('Booking', { customerId }, include);

      if (!bookings) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Bookings not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Bookings retrieved successfully',
        data: bookings,
      });
    } catch (error) {
      console.error('Bookings retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving bookings.',
      });
    }
  }

  static async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const { status: newStatus } = req.body;
      const booking = await FindOne('Booking', { id });

      if (!booking) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking not found',
        });
      }

      const updatedBooking = await Update(
        'Booking',
        { status: newStatus },
        { id },
      );

      return res.status(status.OK).json({
        status: 'success',
        message: 'Booking updated successfully',
        data: updatedBooking,
      });
    } catch (error) {
      console.error('Booking update error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while updating the booking.',
      });
    }
  }
}
