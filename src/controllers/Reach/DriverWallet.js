/* eslint-disable require-jsdoc */
import 'dotenv/config'
import db from '../../database/models'
import {
  FindOne,
  FindAndCount
} from '../../database/queries'
import * as helper from '../../helpers'
import status from '../../config/status'


export default class ReachDriverController {
    static async checkBalance(req, res) {
        const {driverWalletId: walletId, id: userId} = req.user

        const condition = {
            id: walletId,
            userId
        }
        try {
            const response = await FindOne('DriverWallet', condition )
            if(!Object.keys(response).length){
                return res.status(status.NOT_FOUND).json({
                    message: 'Your driver wallet is not found at this moment.',
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
