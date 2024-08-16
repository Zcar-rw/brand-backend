/* eslint-disable require-jsdoc */
import 'dotenv/config'
import db from '../../database/models'
import {
  Create,
  FindOne,
  FindAndCount
} from '../../database/queries'
import * as helper from '../../helpers'
import status from '../../config/status'
import { ActivitiesServices } from '../../services'

export default class ReachController {

    static async topUp(req, res) {
        const { walletId } = req.params;
        const { amount } = req.body;
        try {
          const response = await FindOne('RiderWallet', {
            id: walletId,
            userId: req.user.id
          });
          if (!Object.keys(response).length) {
            return res.status(status.NOT_FOUND).send({
              message: 'Wallet not found',
            });
          }
          const newBalance = response.balance + amount;
          const wallet = await response.update({ balance: newBalance });
          // Adding to transaction
          const transData = {
                userId: req.user.id,
                riderWalletId: wallet.id,
                tax: 0,
                amount,
                type: 'topup',
                transactionCode: helper.generator.transactionCode('topup'),
                LOCAR_NET_INCOME : 0,
            }
          const transaction = await Create('Transactions', transData)

          //TODO: LOGGING ACTIVITY
          await ActivitiesServices.topUpActivity(transData.userId, amount)

          return res.status(status.OK).send({
            message: 'Wallet updated successfully',
            wallet,
            transactionCode: transaction.transactionCode
          });
        } catch (error) {
          return res.status(status.BAD_REQUEST).send({
            error: error.message,
          });
        }
      }

    static async checkBalance(req, res) {
        const {riderWalletId: walletId, id: userId} = req.user

        const condition = {
            id: walletId,
            userId
        }
        try {
            const response = await FindOne('RiderWallet', condition )
            if(!Object.keys(response).length){
              return res.status(status.NOT_FOUND).json({
                message: 'Your rider wallet is not found at this moment.',
              })
            }
            return res.status(status.OK).json({
                balance: response.balance,
            })
            
        } catch (error) {
            return res.status(status.BAD_REQUEST).send({
                error: error.message,
            })
        }
    }
}
