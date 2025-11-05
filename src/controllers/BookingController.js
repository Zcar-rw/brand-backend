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
import sendEmail from '../helpers/mailer';
import dotenv from 'dotenv';
import bookingStatus from '../config/bookingStatus';

dotenv.config();
export default class BookingController {
  static async createBookingByPlate(req, res) {
    try {
      const {
        userId, // admin creating
        clientUserId, // Client user ID - will find or create customer
        carId, // Use carId instead of plateNumber
        service,
        comment,
        date,
        dates,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        dropoffTime,
      } = req.body;

      // Resolve car by ID
      const car = await FindOne(
        'Car',
        { id: carId },
        [
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
          {
            model: db.User,
            as: 'owner',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      );
      if (!car || Object.keys(car).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car not found',
        });
      }
      if (!car?.carModel?.typeId) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car model/type association missing for selected car',
        });
      }

      // Verify client user exists
      const clientUser = await FindOne('User', { id: clientUserId }, [
        {
          model: db.Role,
          as: 'role',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]);
      if (!clientUser || Object.keys(clientUser).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Client user not found',
        });
      }

      // Find or create Customer for this user
      let customer = await FindOne('Customer', { userId: clientUserId });
      if (!customer || Object.keys(customer).length === 0) {
        customer = await Create('Customer', {
          userId: clientUserId,
          companyId: null,
          type: 'individual',
          status: 'active',
        });
      }

      // Determine number of days and pricing
      let datesToCreate = [];
      if (Array.isArray(dates) && dates.length > 0) {
        datesToCreate = dates;
      } else if (startDate && endDate) {
        const start = moment(startDate).startOf('day');
        const end = moment(endDate).startOf('day');
        const cursor = start.clone();
        while (cursor.isSameOrBefore(end)) {
          datesToCreate.push(cursor.clone().toDate());
          cursor.add(1, 'day');
        }
      } else if (date) {
        datesToCreate = [date];
      }

      const days = Math.max(1, datesToCreate.length || 1);
      // Coerce amount values to numbers in case they arrive as strings
      const baseDaily = Number(
        car?.amount !== undefined && car?.amount !== null
          ? car.amount
          : car?.baseAmount !== undefined && car?.baseAmount !== null
            ? car.baseAmount
            : 0,
      );
      // Discount tiers
      let discount = 0; // 0% for 1 day
      if (days >= 2 && days <= 7) discount = 0.20;
      else if (days >= 8 && days <= 14) discount = 0.30;
      else if (days >= 15) discount = 0.40;

      const dailyAfterDiscount = Math.max(0, baseDaily * (1 - discount));
      const totalPrice = Math.round(dailyAfterDiscount * days);

      // Create booking (store both clientId for direct user reference and customerId for compatibility)
      const booking = await Create('Booking', {
        createdBy: userId,
        customerId: customer.id,
        clientId: clientUserId,
        carId: car.id,
        service,
        comment,
        status: 'pending',
        totalPrice,
      });
      if (!booking) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking creation failed',
        });
      }

      // Create booking details per day with derived carType from car's model
      for (const d of datesToCreate) {
        await Create('BookingDetail', {
          bookingId: booking.id,
          carType: car.carModel.typeId,
          date: moment(d).startOf('day').toDate(),
          pickupLocation,
          dropoffLocation,
          pickupTime,
          dropoffTime,
          price: dailyAfterDiscount,
        });
      }

      return res.status(status.CREATED).json({
        status: 'success',
        message: 'Booking created successfully',
        data: booking,
        car: {
          id: car.id,
          plateNumber: car.plateNumber,
          model: car.carModel?.name,
          type: car.carModel?.carType?.name,
          photo: car.carModel?.photo,
          owner: car.owner ? {
            id: car.owner.id,
            name: `${car.owner.firstName} ${car.owner.lastName}`,
            email: car.owner.email,
          } : null,
        },
      });
    } catch (error) {
      console.error('Booking creation by plate error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the booking by plate.',
      });
    }
  }
  static async createBooking(req, res) {
    try {
      const {
        customerId,
        service,
        comment,
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
        comment,
        status: 'pending',
        // reviewStatus: 'none',
        price: 0,
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
          suggestedCarTypes: [],
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
      const { service, comment } = info;
      const newBooking = await Create('Booking', {
        createdBy: userId,
        customerId: user?.companies[0]?.customers[0]?.id,
        service,
        comment,
        status: 'created',
      });
      if (!newBooking) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking creation failed',
        });
      } else {
        const bookingPromises = details.map(async (detail) => {
          const {
            // customerId,
            carType,
            date,
            pickupLocation,
            dropoffLocation,
            pickupTime,
            dropoffTime,
          } = detail;

          const enteredCarType = await FindOne('CarType', { id: carType });
          if (!enteredCarType || Object.keys(enteredCarType)?.length === 0) {
            // return res.status(status.BAD_REQUEST).json({
            //   status: 'error',
            //   message: 'Car type not found',
            // });
            throw new Error('Car type not found');
          }
          await Create('BookingDetail', {
            bookingId: newBooking.id,
            carType,
            date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
            pickupLocation,
            dropoffLocation,
            pickupTime,
            dropoffTime,
          }).catch(async (_) => {
            await Delete('Booking', {
              id: newBooking.id,
            });
            throw new Error('Booking detail creation failed');
          });
        });

        Promise.all(bookingPromises)
          .then(() => {
            return res.status(status.CREATED).json({
              status: 'success',
              message: 'Bookings created successfully',
            });
          })
          .catch((error) => {
            console.error('Multiple bookings creation error:', error.stack);
            return res.status(status.BAD_REQUEST).json({
              status: 'error',
              message:
                error.message ||
                'An error occurred while creating the bookings.',
              data: error,
            });
          });
      }
    } catch (error) {
      console.error('Booking creation error:', error.message);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message:
          error.message || 'An error occurred while creating the booking.',
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
      if (!user || Object.keys(user)?.length === 0) {
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
          include: [
            {
              model: db.Company,
              as: 'company',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: db.User,
              as: 'user',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
        {
          model: db.User,
          as: 'client',
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        },
        {
          model: db.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Car,
          as: 'car',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'owner',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
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
                {
                  model: db.CarMake,
                  as: 'carMake',
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
              ],
            },
          ],
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
        {
          model: db.Invoice,
          as: 'invoice',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
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
          include: [
            {
              model: db.Company,
              as: 'company',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: db.User,
              as: 'user',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
        {
          model: db.User,
          as: 'client',
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        },
        {
          model: db.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Car,
          as: 'car',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.User,
              as: 'owner',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
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
                {
                  model: db.CarMake,
                  as: 'carMake',
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
              ],
            },
          ],
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
        {
          model: db.Invoice,
          as: 'invoice',
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

  static async submitAdminReview(req, res) {
    try {
      const { id } = req.params;
      const { status: newStatus } = req.body;

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
      const booking = await FindOne('Booking', { id }, include);
      if (!booking || Object.keys(booking)?.length === 0) {
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

      if (newStatus === bookingStatus.PENDING) {
        const message = `Your booking has been reviewed by ZCar Admin. Please check your booking details for more information and to approve the booking.`;
        await sendEmail(message, 'Booking Review', booking.user.email);
      }
      if (newStatus === bookingStatus.CANCELLED) {
        const message = `Your booking has been approved by ZCar Admin. Please check your booking details for more information.`;
        await sendEmail(message, 'Booking Review', booking.user.email);
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Review submitted for Approval',
        data: updatedBooking,
      });
    } catch (error) {
      console.error('Booking review error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while reviewing the booking.',
      });
    }
  }

  static async adminReviewBookingDetails(req, res) {
    try {
      const { id } = req.params;
      const { userId, ...body } = req.body;

      const include = [
        {
          model: db.Booking,
          as: 'booking',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.CarType,
          as: 'car',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const bookingDetail = await FindOne('BookingDetail', { id }, include);

      if (!bookingDetail || Object.keys(bookingDetail)?.length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking detail not found',
        });
      }
      const booking = await FindOne('Booking', {
        id: bookingDetail.bookingId,
      });
      if (!booking || Object.keys(booking)?.length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking not found',
        });
      }
      const updatedBookingDetail = await Update('BookingDetail', body, {
        id,
      });
      return res.status(status.OK).json({
        status: 'success',
        message: 'Booking Detail Updated reviewed successfully',
        data: updatedBookingDetail,
      });
    } catch (error) {
      console.error('Booking review error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while reviewing the booking.',
      });
    }
  }

  static async deleteBookingDetail(req, res) {
    try {
      const { id } = req.params;
      const bookingDetail = await FindOne('BookingDetail', { id });

      if (!bookingDetail || Object.keys(bookingDetail)?.length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking detail not found',
        });
      }

      await Delete('BookingDetail', { id });

      return res.status(status.OK).json({
        status: 'success',
        message: 'Booking detail deleted successfully',
      });
    } catch (error) {
      console.error('Booking detail deletion error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while deleting the booking detail.',
      });
    }
  }

  static async createBookingDetail(req, res) {
    try {
      const {
        bookingId,
        carType,
        date,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        dropoffTime,
        price,
      } = req.body;

      const enteredCarType = await FindOne('CarType', { id: carType });
      if (!enteredCarType || Object.keys(enteredCarType)?.length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car type not found',
        });
      }
      const booking = await FindOne('Booking', { id: bookingId });
      if (!booking || Object.keys(booking)?.length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking not found',
        });
      }

      const invoice = await FindOne('Invoice', { bookingId });
      if (invoice && Object.keys(invoice).length > 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Invoice already exists for this booking',
        });
      }

      const bookingDetail = await Create('BookingDetail', {
        bookingId,
        carType,
        date,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        dropoffTime,
        price,
      });

      if (!bookingDetail) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking detail creation failed',
        });
      }

      return res.status(status.CREATED).json({
        status: 'success',
        message: 'Booking detail created successfully',
        data: bookingDetail,
      });
    } catch (error) {
      console.error('Booking detail creation error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the booking detail.',
      });
    }
  }

  static async clientReviewBooking(req, res) {
    try {
      const { id } = req.params;
      const { status: newStatus } = req.body;

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
      const booking = await FindOne('Booking', { id }, include);
      if (!booking) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Booking not found',
        });
      }

      if (
        booking.status !== 'created' &&
        booking.status !== 'pending' &&
        booking.status !== 'approved'
      ) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Booking has already been cancelled',
        });
      }

      await Update('Booking', { status: newStatus }, { id });

      if (newStatus === bookingStatus.APPROVED) {
        const message = `Corporate Admin for ${
          booking?.customer?.company?.name
        } has approved their booking appontment which is due: <b>${moment(
          booking?.bookingDetails?.date,
        ).format('MMM DD, YYYY')}</b>`;
        sendEmail(
          message,
          'Booking Review Status',
          process.env.ZCAR_ADMIN_EMAIL,
        );
      }
      if (newStatus === bookingStatus.DECLINED) {
        const message = `Corporate Admin for ${
          booking?.customer?.company?.name
        } has declined their booking appontment which was due: <b>${moment(
          booking?.bookingDetails?.date,
        ).format('MMM DD, YYYY')}</b>`;
        sendEmail(
          message,
          'Booking Review Status',
          process.env.ZCAR_ADMIN_EMAIL,
        );
      }
      if (newStatus === bookingStatus.CANCELLED) {
        const message = `Corporate Admin for ${
          booking?.customer?.company?.name
        } has cancelled their booking appontment which was due: <b>${moment(
          booking?.bookingDetails?.date,
        ).format('MMM DD, YYYY')}</b>`;
        sendEmail(
          message,
          'Booking Review Status',
          process.env.ZCAR_ADMIN_EMAIL,
        );
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Booking updated successfully',
        data: booking,
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while reviewing the booking.',
      });
    }
  }
}
