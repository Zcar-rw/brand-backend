import 'dotenv/config';
import * as helper from '../helpers';
import status from '../config/status';
import {
  FindAndCount,
  FindOne,
  Create,
  Update,
  Delete,
} from '../database/queries';
import db from '../database/models';
import generateErrorResponse from '../helpers/generateErrorResponse';

// /**
//  * A class to handle user local authentication
//  */
export default class UserController {
  static async getAllUsers(req, res) {
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
        model: db.Role,
        as: 'role',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      // {
      //   model: db.Company,
      //   as: 'company',
      //   attributes: { exclude: ['createdAt', 'updatedAt'] },
      // },
    ];
    const condition = {};
    const { response, meta } = await FindAndCount(
      'User',
      condition,
      include,
      limit,
      offset,
    );
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No booking found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Users can not be retrieved at this moment, try again later',
        })
      : res.status(status.OK).json({
          response,
          meta: helper.generator.meta(
            meta.count,
            limit,
            parseInt(page, 10) || 1,
          ),
        });
  }

  static async getCustomers(req, res) {
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
      // {
      //   model: db.Role,
      //   as: 'role',
      //   attributes: { exclude: ['createdAt', 'updatedAt'] },
      // },
      // {
      //   model: db.Customer,
      //   as: 'customer',
      //   attributes: { exclude: ['createdAt', 'updatedAt'] },
      // },
    ];
    const condition = {};
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
        error: 'Sorry, No booking found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Users can not be retrieved at this moment, try again later',
        })
      : res.status(status.OK).json({
          response,
          meta: helper.generator.meta(
            meta.count,
            limit,
            parseInt(page, 10) || 1,
          ),
        });
  }

  static async getAllCompanyUsers(req, res) {
    let { page, limit } = req.query;
    const { id } = req.params;

    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }

    limit = limit || 5;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * limit;
    try {
      const include = [
        {
          model: db.Role,
          as: 'role',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ];
      const condition = {
        companyId: id,
      };
      const { response, meta } = await FindAndCount(
        'User',
        condition,
        include,
        limit,
        offset,
      );
      if (response && !response.length) {
        return res.status(status.NO_CONTENT).send({
          response: [],
          error: 'Sorry, No booking found!',
        });
      }
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error: 'Users can not be retrieved at this moment, try again later',
          })
        : res.status(status.OK).json({
            response,
            meta: helper.generator.meta(
              meta.count,
              limit,
              parseInt(page, 10) || 1,
            ),
          });
    } catch (error) {
      generateErrorResponse(error, res);
      return res.status(status.BAD_REQUEST).send({
        error: generateErrorResponse(error, res),
      });
    }
  }

  static async registerInternalUser(req, res) {
    const { firstName, lastName, email, phoneNumber, roleId } = req.body;
    const password = '12345678'; // TODO: WILL CHANGE THIS LATER
    try {
      // TODO: REGISTER USER
      const newPassword = helper.password.hash(password);
      const response = await Create('User', {
        password: newPassword,
        email,
        status: 'active',
        firstName,
        lastName,
        phoneNumber,
        roleId,
      });

      return res
        .status(status.CREATED)
        .send({ response, message: 'User created successfully' });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not create this account right now. Try again later',
      });
    }
  }
  static async registerCompanyUser(req, res) {
    const { firstName, lastName, email, phoneNumber, roleId, companyId } =
      req.body;
    const password = '12345678'; // TODO: WILL CHANGE THIS LATER

    try {
      const newPassword = helper.password.hash(password);
      const response = await Create('User', {
        password: newPassword,
        email,
        status: 'active',
        firstName,
        lastName,
        phoneNumber,
        roleId,
        companyId,
        verified: true,
      });

      return res
        .status(status.CREATED)
        .send({ response, message: 'User created successfully' });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not create this account right now. Try again later',
      });
    }
  }

  static async registerClientUser(req, res) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      type,
      businessName,
      TIN,
      address,
      password,
    } = req.body;
    try {
      // GET USER ROLE
      const role = await FindOne('Role', {
        name: type === 'business' ? 'cooperate-owner' : 'client',
      });
      // TODO: REGISTER USER
      const hashedPassword = helper.password.hash(password);
      const response = await Create('User', {
        password: hashedPassword,
        email,
        status: 'active',
        firstName,
        lastName,
        phoneNumber,
        roleId: role.id,
        verified: false,
      });

      if (type === 'business') {
        // TODO: REGISTER BUSINESS
        const business = await Create('Company', {
          name: businessName,
          TIN,
          address,
          ownerId: response.id,
          verified: false,
          theme: '0171C8',
        });
        await Update(
          'User',
          {
            companyId: business.id,
          },
          {
            id: response.id,
          },
        );

        const customer = await Create('Customer', {
          companyId: business.id,
          userId: null,
          type: 'company',
        });
        // Create Owner profile (company owner)
        await Create('Owner', {
          userId: response.id,
          type: 'company',
          verified: false,
        })
      } else {
        const customer = await Create('Customer', {
          companyId: null,
          userId: response.id,
          type: 'individual',
        });
        // Create Owner profile for individual
        await Create('Owner', {
          userId: response.id,
          type: 'individual',
          verified: false,
        })
      }

      // SEND EMAIL TO ACTIVATE THE ACCOUNT
      const message = 'Welcome to Kale.';
      const subject = 'Activate your Kale account';
      await helper.mailer(message, subject, email);

      return res
        .status(status.CREATED)
        .send({ response, message: 'User created successfully' });
    } catch (error) {
      // if error occurred, deleted the created user(if exist)
      await Delete('User', {
        email,
      });
      generateErrorResponse(error, res);
      return res.status(status.BAD_REQUEST).send({
        error: generateErrorResponse(error, res),
      });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, roleId } = req.body;
    try {
      const response = await Update(
        'User',
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          roleId,
        },
        { id },
      );
      return response && response.errors
        ? res.status(status.BAD_REQUEST).send({
            error:
              'Sorry, you can not update this user right now, try again later',
          })
        : res.status(status.CREATED).json({
            response,
          });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).send({
        error: 'Something went wrong, try again later',
      });
    }
  }

  static async getDrivers(req, res) {
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
        model: db.Role,
        as: 'role',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ];
    const driverRole = await FindOne('Role', {
      name: 'driver',
    });
    if (!driverRole || Object.keys(driverRole).length === 0) {
      return res.status(status.NOT_FOUND).send({
        response: [],
        error: 'Sorry, No driver role found!',
      });
    }
    const { response, meta } = await FindAndCount(
      'User',
      {
        roleId: driverRole.id,
      },
      include,
      limit,
      offset,
    );
    console.log(response);
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No booking found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Users can not be retrieved at this moment, try again later',
        })
      : res.status(status.OK).json({
          response,
          meta: helper.generator.meta(
            meta.count,
            limit,
            parseInt(page, 10) || 1,
          ),
        });
  }
}
