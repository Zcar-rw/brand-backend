/* eslint-disable require-jsdoc */
import 'dotenv/config';
import _ from 'lodash';
import otp from 'generate-otp';
import * as helper from '../helpers';
import * as template from '../templates';
import status from '../config/status';
import { Create, FindOne, Delete, Update } from '../database/queries';
import { ActivitiesServices, NotificationServices } from '../services';
/**
 * A class to handle user local authentication
 */
export default class AuthLocalController {
  /**
   * @description user signup function
   * @param {object} req request from user
   * @param {object} res response from server
   * @return {object} user information & token
   */
  static async signup(req, res) {
    console.log({
      req
    })
    req.body.password = helper.password.hash(req.body.password);
    try {
      const response = await Create('User', req.body);
      return (
        delete response.password &&
        res.status(status.CREATED).json({ response })
      );
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not create your account right now. Try again later',
      });
    }
  }

  static async login(req, res) {
    console.log({req: "*S)HS)USH"})
    const { password } = req.body;
    const user = req.auth;
   
    try {
      if (!_.isEmpty(user)) {
        const comparePassword = helper.password.compare(
          password,
          user.password || '',
        );
        if (!comparePassword) {
          return res.status(status.UNAUTHORIZED).json({
            error: 'The credentials you provided are incorrect',
          });
        }
        const payload = {
          id: user.id,
          role: {
            id: user.role.id,
            name: user.role.name,
            type: user.role.type,
          },
        };
        const token = helper.token.generate(payload);
        delete user.password;


        // GET COMPANY INFO
        const company = await FindOne('Company', {
          ownerId: user.id,
        });

        await NotificationServices.saveNotification(
          user.id,
          `Dear ${user.firstName}, Welcome back to Kale!`,
          'account',
        );
        return (
          user &&
          res.status(status.OK).json({
            user: _.isEmpty(company) ? user : { ...user, company },
            token,
          })
        );
      } else {
        return res.status(status.UNAUTHORIZED).json({
          error: 'The credentials you provided are incorrect',
        });
      }
    } catch (error) {
      return res.status(status.UNAUTHORIZED).json({
        error: 'The credentials you provided are incorrect',
      });
    }
  }

  static async getUser(req, res) {
    return req.user
      ? delete req.user.password &&
          res.status(status.OK).json({
            user: req.user,
          })
      : res.status(status.NOT_FOUND).send({
          error: 'The account is not found at this moment.',
        });
  }

  static async initiatePasswordReset(req, res) {
    const { email } = req.body;
    const resetCode = otp.generate(6);

    const data = {
      email,
      code: resetCode,
    };
    try {
      // 1. Check Account existance
      const response = await FindOne('User', { email: data.email });
      if (!Object.keys(response).length) {
        return res.status(status.NOT_FOUND).json({
          error: `The account of this email '${email}' does not exist!`,
        });
      }

      // 2.
      await Create('ResetPassword', data);

      // 3. Send reset password code
      const { message, subject } = template.account.sendResetPasswordOTP(
        data.code,
      );
      await helper.mailer(message, subject, data.email);

      return res
        .status(status.CREATED)
        .json({ response: { email: response.email } });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not create your account right now. Try again later',
      });
    }
  }

  static async verifyResetCode(req, res) {
    const { email, code } = req.body;
    const response = await FindOne('ResetPassword', {
      email,
      code,
    });
    if (!Object.keys(response).length) {
      return res.status(status.NOT_FOUND).send({
        error:
          'Sorry, we can not find the Reset Code OTP or email you provided, try again later',
      });
    }
    return res.status(status.CREATED).json({ response });
  }

  static async updatePassword(req, res) {
    const { email, code, password } = req.body;

    try {
      // const resetResponse = await FindOne('ResetPassword', {
      //   email,
      //   code,
      // })
      // 1. Validate Code
      // if (!Object.keys(resetResponse).length) {
      //   return res.status(status.BAD_REQUEST).json({
      //     error: 'May be reset code already used!',
      //   })
      // }
      // 2. CHECK ACCOUNT AND UPDATE PASSWORD
      const existing = await FindOne('User', { email });
      if (!Object.keys(existing).length) {
        return res.status(status.NOT_FOUND).json({
          error: 'Account not found',
        });
      }
      const hashedPassword = helper.password.hash(password);
      const response = await Update('User', { password: hashedPassword }, { email });

      // 3. CHECK AND DELETE Reset OTP CODE
      await Delete('ResetPassword', {
        email,
        code,
      });
      if (response && response.password) delete response.password
      return res.status(status.CREATED).json({ response });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not reset your password at this moment. Try again',
      });
    }
  }
}
