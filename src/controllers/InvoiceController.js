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

export default class InvoiceController {
  static async createInvoice(req, res) {
    try {
      const {
        scheduleId,
        // customerId, // From Booking -> Schedule
      } = req.body;

      const schedule = await FindOne('Schedule', { id: scheduleId }, [
        {
          model: db.Booking,
          as: 'booking',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
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
          ],
        },
      ]);
      if (!schedule || Object.keys(schedule).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Schedule not found',
        });
      }

      const invoice = await Create('Invoice', {
        customerId: schedule?.booking?.customer?.id,
        bookingId: schedule?.booking?.id,
        status: 'pending',
      });

      return res.status(status.CREATED).json({
        status: 'success',
        message: 'Invoice created successfully',
        data: {
          ...invoice,
        },
      });
    } catch (error) {
      console.error('Invoice creation error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the invoice.',
      });
    }
  }

  static async getInvoices(req, res) {
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
          model: db.Booking,
          as: 'booking',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.BookingDetail,
              as: 'bookingDetails',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: db.Schedule,
              as: 'schedule',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            }
          ],
        },
      ];
      const { response, meta } = await FindAndCount(
        'Invoice',
        options,
        include,
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'No invoices found',
          response: [],
        });
      }
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error:
              'Invoices can not be retrieved at this moment, try again later',
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
      console.error('Invoices retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving invoices.',
      });
    }
  }

  static async getInvoice(req, res) {
    try {
      const { id } = req.params;
      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const invoice = await FindOne('Invoice', { id }, include);

      if (!invoice) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Invoice not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Invoice retrieved successfully',
        data: invoice,
      });
    } catch (error) {
      console.error('Invoice retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the invoice.',
      });
    }
  }

  static async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await FindOne('Invoice', { id });

      if (!invoice || Object.keys(invoice).length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Invoice not found',
        });
      }
      const updatedInvoice = await Update('Invoice', { ...req.body }, { id });

      return res.status(status.OK).json({
        status: 'success',
        message: 'Invoice updated successfully',
        data: updatedInvoice,
      });
    } catch (error) {
      console.error('Invoice update error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while updating the invoice.',
      });
    }
  }
}
