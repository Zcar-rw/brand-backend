/* eslint-disable require-jsdoc */
import 'dotenv/config'
import { Create, FindOne, Update } from '../database/queries'
import db from '../database/models'
import * as helper from '../helpers'

import ActivitiesServices from './ActivitiesServices'
import NotificationsServices from './NotificationsServices'

export default class DriverServices {
  static async createDriverWallet(userId) {
    const driverWallet = await Create('DriverWallet', { userId })
    return driverWallet
  }

  static async approveADriver(id, data) {
    // get profile Info
    const profile = await FindOne('Profile', {
      userId: id,
    })

    if (profile && profile.driver === 'approved') {
      return false
    }
    // update user profile to be a driver
    const response = await profile.update({
      ...data,
      driver: 'approved',
    })

    // create a wallet for a driver
    const driverWallet = await this.createDriverWallet(response.userId)
    return { response, driverWallet }
  }

  static async updateDriverWallet(id, amount) {
    const driverWallet = await FindOne('DriverWallet', { id })
    if (!Object.keys(driverWallet).length) {
      return false
    }
    await driverWallet.update({
      balance: driverWallet.balance + amount,
    })

    return driverWallet
  }

  static async getDriverWalletIdByRideId(rideId) {
    const response = await FindOne(
      'Ride',
      {
        id: rideId,
      },
      [
        {
          model: db.User,
          as: 'user',
          include: [
            {
              model: db.DriverWallet,
              as: 'driverwallet',
            },
          ],
        },
      ]
    )

    return { driverWalletId: response.user.driverwallet.id }
  }

  static async getDriverUserIdByRideId(rideId) {
    const response = await FindOne(
      'Ride',
      {
        id: rideId,
      },
      [
        {
          model: db.User,
          as: 'user',
        },
      ]
    )

    return { driver: response.user }
  }

  static async driverPayout(wallet) {
    // 1. CHECK IF HAS AT LEAST 1000RWF
    if (wallet.balance < 1000) {
      return {
        status: 507,
        message: 'Insufficient balance to cashout',
      }
    }
    // 3. CREATE A TRANSACTION FOR PAYOUT
    const tx = {
      userId: wallet.userId,
      rideId: null,
      riderWalletId: null,
      driverWalletId: wallet.id,
      transitWalletId: null,
      tax: 0,
      amount: wallet.balance,
      type: 'cashout',
      transactionCode: helper.generator.transactionCode('cashout'),
      LOCAR_NET_INCOME: 0,
    }
    const txResponse = await Create('Transactions', tx)
    // 4. UPDATE DRIVER WALLET BALANCE TO 0

    const driverResponse = await Update(
      'DriverWallet',
      {
        balance: 0,
      },
      { id: wallet.id }
    )

    // 5. SAVE NOTIFICATION TO DRIVER
    await NotificationsServices.saveNotification(
      wallet.userId,
      `We have payed out your earning of ${wallet.balance}RWF. Thank you`,
      'payment',
      null,
      'passenger'
    )

    // 6. PUSH NOTIFICATION TO DRIVER
    await NotificationsServices.sendPushNotification(
      [[wallet.userId]],
      `We have payed out your earning of ${wallet.balance}RWF. Thank you`,
      'Payout'
    )

    // 7. UPDATE ACTIVITY TO NOTIFY ADMIN(SOCKETIO)
    await ActivitiesServices.DriverPayoutActivity(
      wallet.userId,
      wallet.balance
    )

    // 8. RETURN RESPONSE
    return {
      status: 200,
      txResponse,
      driverResponse,
    }
  }
}
//
