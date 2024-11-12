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

export default class PriceListController {
  static async createPriceList(req, res) {
    try {
      const { class: bodyClass, carType, price, account, userId } = req.body;

      const user = await FindOne('User', { id: userId });
      if (!user || Object.keys(user).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'User not found',
        });
      }

      const car = await FindOne('CarType', { id: carType });
      if (!car || Object.keys(car).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Car type not found',
        });
      }

      const company = await FindOne('Company', { id: account });
      if (!company || Object.keys(company).length === 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'Company not found',
        });
      }

      const priceListExists = await FindOne('PriceList', {
        carTypeId: carType,
        companyId: account,
        class: bodyClass,
      });
      if (priceListExists && Object.keys(priceListExists).length > 0) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'This priceList already exists',
        });
      }

      const priceList = await Create('PriceList', {
        companyId: account,
        carTypeId: carType,
        price,
        class: bodyClass,
      });

      return res.status(status.CREATED).json({
        status: 'success',
        message: 'PriceList created successfully',
        data: priceList,
      });
    } catch (error) {
      console.error('PriceList creation error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while creating the priceList.',
      });
    }
  }

  static async getPriceLists(req, res) {
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
        'PriceList',
        {},
        [],
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NOT_FOUND).send({
          error: 'PriceLists not found',
          response: [],
        });
      }
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error:
              'PriceLists can not be retrieved at this moment, try again later',
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
      console.error('PriceLists retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving priceLists.',
      });
    }
  }

  static async getPriceList(req, res) {
    try {
      const { id } = req.params;
      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.PriceListDetail,
          as: 'priceListDetails',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const priceList = await FindOne('PriceList', { id }, include);

      if (!priceList) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'PriceList not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'PriceList retrieved successfully',
        data: priceList,
      });
    } catch (error) {
      console.error('PriceList retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the priceList.',
      });
    }
  }

  static async getPriceListByCompany(req, res) {
    try {
      const { id } = req.params;
      const include = [
        {
          model: db.Customer,
          as: 'customer',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];

      const priceList = await FindOne('PriceList', { id }, include);

      if (!priceList) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'PriceList not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'PriceList retrieved successfully',
        data: priceList,
      });
    } catch (error) {
      console.error('PriceList retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving the priceList.',
      });
    }
  }

  static async updatePriceList(req, res) {
    try {
      const { id } = req.params;
      const { status: newStatus } = req.body;
      const priceList = await FindOne('PriceList', { id });

      if (!priceList) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'PriceList not found',
        });
      }

      const updatedPriceList = await Update(
        'PriceList',
        { status: newStatus },
        { id },
      );

      return res.status(status.OK).json({
        status: 'success',
        message: 'PriceList updated successfully',
        data: updatedPriceList,
      });
    } catch (error) {
      console.error('PriceList update error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while updating the priceList.',
      });
    }
  }

  static async getPriceListsByCompany(req, res) {
    try {
      const { id } = req.params;

      const priceLists = await FindAll('PriceList', { companyId: id });

      if (!priceLists || Object.keys(priceLists).length === 0) {
        return res.status(status.NOT_FOUND).json({
          status: 'error',
          message: 'PriceLists not found',
        });
      }

      return res.status(status.OK).json({
        status: 'success',
        message: 'PriceLists retrieved successfully',
        data: priceLists?.response,
      });
    } catch (error) {
      console.error('PriceLists retrieval error:', error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while retrieving priceLists.',
      });
    }
  }
}
