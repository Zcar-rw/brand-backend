import 'dotenv/config'
import _ from 'lodash'
import otp from 'generate-otp'
import * as helper from '../helpers'
import * as template from '../templates'
import status from '../config/status'
import { Create, FindOne, Delete } from '../database/queries'
import { ActivitiesServices } from '../services'
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
    req.body.password = helper.password.hash(req.body.password)
    try {
      const response = await Create('User', req.body)
      return (
        delete response.password &&
        res.status(status.CREATED).json({ response })
      )
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not create your account right now. Try again later',
      })
    }
  }
  static async registerEmail(req, res) {
    const { email } = req.body
    const code = otp.generate(6)
    const data = {
      email,
      code,
    }
    try {
      const response = await Create('VerifyEmail', data)
      const { message, subject } = template.account.sendEmailOtp(data.code)
      await helper.mailer(message, subject, data.email)
      return res
        .status(status.CREATED)
        .json({ response: { email: response.email } })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not create your account right now. Try again later',
      })
    }
  }
  static async registerVerify(req, res) {
    const { email, code } = req.body
    const response = await FindOne('VerifyEmail', {
      email,
      code,
    })
    if (!Object.keys(response).length) {
      return res.status(status.NOT_FOUND).send({
        error:
          'Sorry, we can not find the OTP or email you provided, try again later',
      })
    }
    return res.status(status.CREATED).json({ response })
  }

  static async registerComplete(req, res) {
    const {
      email,
      code,
      password,
      firstName,
      lastName,
      phoneNumber,
      intlPhoneNumber,
      country,
      callingCode,
    } = req.body
    try {
      // 1. REGISTER A USER
      const newPassword = helper.password.hash(password)
      const response = await Create('User', {
        password: newPassword,
        email,
        status: 'active',
      })
      // 2. CREATE USER PROFILE INFO
      const user = await Create('Profile', {
        userId: response.id,
        firstName,
        lastName,
        phoneNumber,
        callingCode,
        intlPhoneNumber,
        country,
        phoneNumberVerified: false,
      })
      // 3. CHECK AND DELETE OTP CODE
      await Delete('VerifyEmail', {
        email,
        code,
      })
      // 4. CREATE RIDERWALLET
      const riderWallet = await Create('RiderWallet', {
        userId: response.id,
      })
      // 5. Note activity
      await ActivitiesServices.RegisterActivity(response.id)

      return (
        delete response.password &&
        res.status(status.CREATED).json({ response, riderWallet })
      )
    } catch (error) {
      // IF NOT REGISTERED, ROLL BACK
      await Delete('User', {
        email,
      })
      // IF ERROR IS UNIQUE CONSTRAINT
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(status.EXIST).send({
          error: 'Account with email or phone number already exists',
        })
      }

      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not register your account at this moment. Refresh the page and try again',
      })
    }
  }

  static async login(req, res) {
    const { password } = req.body
    const user = req.auth
    try {
      // get profile info
      const profile = await FindOne('Profile', {
        userId: user.id,
      })
      if (!_.isEmpty(user)) {
        console.log('is not empty, process')
        const comparePassword = helper.password.compare(
          password,
          user.password || ''
        )
        console.log('##compare', comparePassword)
        if (!comparePassword) {
          console.log('##Password mismatch')
          return res.status(status.UNAUTHORIZED).json({
            error: 'The credentials you provided are incorrect',
          })
        }

        // get rider wallet
        // const riderWallet = await FindOne('RiderWallet', {
        //   userId: user.id,
        // })

        // get driver wallet
        // const driverWallet = await FindOne('DriverWallet', {
        //   userId: user.id,
        // })

        const payload = {
          id: user.id,
        }
        const token = helper.token.generate(payload)
        delete user.password

        return (
          user &&
          profile &&
          // riderWallet &&
          res.status(status.OK).json({
            user,
            profile,
            // riderWallet,
            // driverWallet,
            token,
          })
        )
      } else {
        console.log('##RETURN')
        return res.status(status.UNAUTHORIZED).json({
          error: 'The credentials you provided are incorrect',
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(status.UNAUTHORIZED).json({
        error: 'The credentials you provided are incorrect',
      })
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
        })
  }

  static async initiatePasswordReset(req, res) {
    const { email } = req.body
    const resetCode = otp.generate(6)

    const data = {
      email,
      code: resetCode,
    }
    try {
      // 1. Check Account existance
      const response = await FindOne('User', { email: data.email })
      if (!Object.keys(response).length) {
        return res.status(status.NOT_FOUND).json({
          error: `The account of this email '${email}' does not exist!`,
        })
      }

      // 2.
      await Create('ResetPassword', data)

      // 3. Send reset password code
      const { message, subject } = template.account.sendResetPasswordOTP(
        data.code
      )
      await helper.mailer(message, subject, data.email)

      return res
        .status(status.CREATED)
        .json({ response: { email: response.email } })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not create your account right now. Try again later',
      })
    }
  }

  static async verifyResetCode(req, res) {
    const { email, code } = req.body
    const response = await FindOne('ResetPassword', {
      email,
      code,
    })
    if (!Object.keys(response).length) {
      return res.status(status.NOT_FOUND).send({
        error:
          'Sorry, we can not find the Reset Code OTP or email you provided, try again later',
      })
    }
    return res.status(status.CREATED).json({ response })
  }

  static async updatePassword(req, res) {
    const { email, code, password } = req.body
    
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
      const response = await FindOne('User', { email })
      const hashedPassword = helper.password.hash(password)

      response.update({
        password: hashedPassword,
      })

      // 3. CHECK AND DELETE Reset OTP CODE
      await Delete('ResetPassword', {
        email,
        code,
      })
      return (
        delete response.get().password &&
        res.status(status.CREATED).json({ response })
      )
    } catch (error) {
      console.log('&&&error', error)
      return res.status(status.BAD_REQUEST).send({
        error:
          'Sorry, we can not reset your password at this moment. Try again',
      })
    }
  }
}
