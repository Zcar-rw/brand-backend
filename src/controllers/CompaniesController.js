/* eslint-disable require-jsdoc */
import 'dotenv/config';
import _ from 'lodash';
import { Op } from 'sequelize';
import db from '../database/models';
import * as helper from '../helpers';
import status from '../config/status';
import { FindAndCount, Create, findAll, FindOne } from '../database/queries';

export default class CompaniesController {
  static async fetchAccounts(req, res) {
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
        },
        {
          model: db.Company,
          as: 'company',
        },
      ];
      const { response, meta } = await FindAndCount(
        'Customer',
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

  static async fetchCompanyDetails(req, res) {
    const { id } = req.params;

    try {
      const condition = {
        id,
      };
      const include = [
        {
          model: db.User,
          as: 'owner',
        },
      ];
      const company = await FindOne('Company', condition, include);

      if (_.isEmpty(company)) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No suppliers found!',
        });
      }
      return res.status(status.OK).json({
        company,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Suppliers not found at this moment, try again later',
      });
    }
  }
}
