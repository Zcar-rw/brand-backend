/* eslint-disable require-jsdoc */
import 'dotenv/config';
import _ from 'lodash';
import moment from 'moment';
import db from '../database/models';
import * as helper from '../helpers';
import status from '../config/status';
import { FindAndCount, Create, findAll, FindOne } from '../database/queries';
import generateErrorResponse from '../helpers/generateErrorResponse';

export default class InquiryController {
  static async createInquiry(req, res) {
    const {
      firstName,
      lastName,
      email,
      phone,
      comment,
      typeId,
      startDate,
      endDate,
      createdBy,
      companyId,
    } = req.body;
    const data = {
      firstName,
      lastName,
      email,
      phone,
      message: comment,
      typeId,
      startDate: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
      createdBy,
      companyId,
    };
    try {
      const response = await Create('Inquiry', data);
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Sorry, you can not create a car right now, try again later',
          })
        : res.status(status.CREATED).json({
            response,
          });
    } catch (error) {
      generateErrorResponse(error, res);
      return res.status(status.BAD_REQUEST).send({
        error: generateErrorResponse(error, res),
      });
    }
  }

  static async fetchInquiries(req, res) {
    const { page, limit } = req.query;
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    const count = limit || 9;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * count;

    try {
      const condition = {};
      const include = [
        {
          model: db.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.CarType,
          as: 'carType',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Company,
          as: 'company',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];
      const { response, meta } = await FindAndCount(
        'Inquiry',
        condition,
        include,
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No companies found!',
        });
      }
      return res.status(status.OK).json({
        meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
        response,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'companies not found at this moment, try again later',
      });
    }
  }

  static async fetchCompanyInquiries(req, res) {
    const { page, limit } = req.query;
    const { companyId } = req.user;
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    const count = limit || 9;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * count;
    try {
      const condition = {
        companyId,
      };
      const include = [
        {
          model: db.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.CarType,
          as: 'carType',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.Company,
          as: 'company',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];
      const { response, meta } = await FindAndCount(
        'Inquiry',
        condition,
        include,
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No companies found!',
        });
      }
      return res.status(status.OK).json({
        meta: helper.generator.meta(meta.count, limit, parseInt(page, 10) || 1),
        response,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'companies not found at this moment, try again later',
      });
    }
  }
}
