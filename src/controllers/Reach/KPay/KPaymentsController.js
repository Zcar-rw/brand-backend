/* eslint-disable require-jsdoc */
import 'dotenv/config'
import KPayInstance from './interceptors'
import status from './../../../config/status'
import {
  MTNTemporaryTxService,
  ActivitiesServices,
  NotificationServices,
} from '../../../services'
import RiderWalletServices from '../../../services/RiderWalletServices'
import { Create } from '../../../database/queries'
import * as helper from '../../../helpers'
import io, { getUser } from '../../../socket'
export default class KPaymentsController {
  static async TopUp(req, res) {
    const { id: userId, riderWalletId } = req.user
    const { phoneNumber, amount } = req.body
    const { method: payMethod } = req.query

    const { KPAY_ALLOWED_TOPUP_PAYMENT_METHOD } = process.env
    if (!KPAY_ALLOWED_TOPUP_PAYMENT_METHOD.includes(payMethod)) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: 'Your method for topup is not allowed!' })
    }

    const payData = helper.generator.kpayData(
      payMethod,
      phoneNumber,
      amount,
      req.user
    )

    KPayInstance.post('/', payData)
      .then((response) => {
        console.log('##Cntrl/KPay/response: ', response);
        const tempData = {
          userId,
          riderWalletId,
          refId: response.data.refid,
          amount: payData.amount,
        }
        MTNTemporaryTxService.createNewTemporaryTx(tempData)
        return res.status(response.PAYMENT_STATUS).json({
          response,
        })
      })
      .catch((error) => {
        return res.status(status.BAD_REQUEST).json({ error: error.message })
      })
  }

  static async TopUpCallBack(req, res) {
    const callbackData = req.body
    const parsedObj = JSON.parse(Object.keys(callbackData))
    console.log('Cntrl/KPay/Callback: ', parsedObj);

    // statusid 02 -> Failed
    if (parsedObj.statusid === '02') {
      // 1. update temporary tx -> timedout
      const timedOutTemporaryTx =
        await MTNTemporaryTxService.changeTemporaryTxStatus(
          parsedObj.refid,
          'timedout'
        )
        console.log('##timedOutTemporaryTx', timedOutTemporaryTx);
      const socketedUser = getUser(timedOutTemporaryTx.userId)
      if (!socketedUser) {
        console.log('socket for user not found')
      } else {
        console.log('socketedUser: ', socketedUser);
        io.to(socketedUser.socketId).emit('paymentCallback', parsedObj)
      }
    } else if (
      parsedObj.statusid === '01' &&
      parsedObj.statusdesc === 'SUCCESSFUL'
    ) {
      //1. update temporary tx -> paid
      const paidTemporaryTx =
        await MTNTemporaryTxService.changeTemporaryTxStatus(
          parsedObj.refid,
          'paid'
        )
        console.log('##paidTemporaryTx', paidTemporaryTx);
      //2. Save data in transaction
      const transData = {
        userId: paidTemporaryTx.userId,
        riderWalletId: paidTemporaryTx.riderWalletId,
        tax: 0,
        amount: paidTemporaryTx.amount,
        type: 'topup',
        transactionCode: helper.generator.transactionCode('topup'),
        LOCAR_NET_INCOME: 0,
        kpaymentReferenceId: paidTemporaryTx.kpaymentReferenceId,
        aggregator: 'KPAY',
      }

      const transaction = await Create('Transactions', transData)
      console.log('##transaction: ', transaction);

      //3. update riderWallet
      const updatedWallet = await RiderWalletServices.updateRiderWallet(
        paidTemporaryTx.userId,
        paidTemporaryTx.riderWalletId,
        paidTemporaryTx.amount
      )

      console.log('Successfully Payment')

      //Note Acivity and notify admin
      await ActivitiesServices.topUpActivity(transData.userId, transData.amount)

      const socketedUser = getUser(paidTemporaryTx.userId)
      if (!socketedUser) {
        console.log('socket for user not found')
      } else {
        console.log('##socketedUser: ', socketedUser);
        io.to(socketedUser.socketId).emit('paymentCallback', parsedObj)

        // # Notify a Rider after Successfull.
        // Save passenger's notification
        await NotificationServices.saveNotification(
          transData.userId,
          `You have successfully added ${transData.amount}RWF to your wallet`,
          'payment',
          null,
          'passenger'
        )
        // Push notification
        await NotificationServices.sendPushNotification(
          [[paidTemporaryTx.userId]],
          'ou have successfully added ${transData.amount}RWF to your wallet',
          'Topup'
        )
      }
    } else {
      console.log('failed', parsedObj)
    }
  }
}
