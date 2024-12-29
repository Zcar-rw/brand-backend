import status from '../config/status';
import db from '../database/models';
import { Create, Delete, FindAll, FindAndCount, FindOne } from '../database/queries';
import * as helper from '../helpers';

export default class TransactionController {
  static async createTransaction(req, res) {
    try {
      const { invoiceId, amount, source, userId } = req.body;

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
          as: 'createdByUser',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const invoice = await FindOne('Invoice', { id: invoiceId }, include);
      if (!invoice || Object.keys(invoice).length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Invoice not found',
        });
      }
      console.log(invoice, 'invoice##############');

      const transaction = await Create('Transaction', {
        invoiceId: invoice?.id,
        type: 'debitted',
        source,
        amount,
        createdBy: userId,
        accountId: invoice?.customer?.company?.id,
      });

      return res.status(status.CREATED).json({
        status: 'success',
        message: 'Transaction created successfully',
        data: {
          ...transaction,
        },
      });
    } catch (error) {
      console.error('Transaction creation error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the transaction.',
      });
    }
  }

  static async getTransactions(req, res) {
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
          model: db.Company,
          as: 'company',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Invoice,
          as: 'invoice',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.InvoiceDetail,
              as: 'invoiceDetails',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ];

      const { response, meta } = await FindAndCount(
        'Transaction',
        options,
        include,
        limit,
        offset,
      );

      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'No transactions found',
          response: [],
        });
      }
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error:
              'Transactions can not be retrieved at this moment, try again later',
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
      console.error('Transactions retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving transactions.',
      });
    }
  }

  static async getTransaction(req, res) {
    try {
      const { id } = req.params;
      const include = [
        {
          model: db.Company,
          as: 'company',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const transaction = await FindOne('Transaction', { id }, include);

      if (!transaction) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Transaction not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Transaction retrieved successfully',
        data: transaction,
      });
    } catch (error) {
      console.error('Transaction retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the transaction.',
      });
    }
  }

  static async getTransactionByInvoice(req, res) {
    try {
      const { id: invoiceId } = req.params;
      // verify if invoice exists
      const invoice = await FindOne('Invoice', { id: invoiceId });
      if (!invoice || Object.keys(invoice).length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Invoice not found',
        });
      }
      const include = [
        {
          model: db.Company,
          as: 'company',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const transaction = await FindAll('Transaction', { invoiceId }, include);

      if (!transaction) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Transaction not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'Transaction retrieved successfully',
        data: transaction,
      });
    } catch (error) {
      console.error('Transaction retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the transaction.',
      });
    }
  }
  static async deleteTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await FindOne('Transaction', { id });
      if (!transaction || Object.keys(transaction).length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'Transaction not found',
        });
      }
      await Delete('Transaction', { id });
      return res.status(status.OK).json({
        status: 'success',
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      console.error('Transaction deletion error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while deleting the transaction.',
      });
    }
  }
}
