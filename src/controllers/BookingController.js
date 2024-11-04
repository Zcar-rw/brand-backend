import status from '../config/status';
import db from '../database/models';
import { Create, FindAll, FindAndCount, FindOne } from '../database/queries';

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

      console.log(booking, 'booking');

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

  static createMultipleBookings(req, res) {
    const { bookings } = req.body;
    console.log(bookings, 'bookings');
    const bookingPromises = bookings.map(async (booking) => {
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
      } = booking;

      const user = await FindOne('User', { id: userId });

      const enteredCarType = await FindOne('CarType', { id: carType });
      if (!enteredCarType) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car type not found',
        });
      }

      const newBooking = await Create('Booking', {
        createdBy: userId,
        customerId,
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
        await Create('BookingDetails', {
          bookingId: newBooking.id,
          carType,
          date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
          quantity,
          pickupLocation,
          dropoffLocation,
          pickupTime,
          dropoffTime,
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
        return res.status(status.INTERNAL_SERVER_ERROR).json({
          status: 'error',
          message: 'An error occurred while creating the bookings.',
        });
      });
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
      limit = limit || 5;
      const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;

      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const bookings = await FindAndCount(
        'Booking',
        {},
        include,
        limit,
        offset,
      );

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

  static async getBooking(req, res) {
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
}
