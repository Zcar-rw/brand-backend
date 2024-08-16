/* eslint-disable require-jsdoc */
import 'dotenv/config'
import {
  FindOne,
} from '../database/queries'

export default class RiderWalletServices{

    static async balance(userId, walletId) {
        const condition = {
            id: walletId,
            userId
        }
        try {
            const response = await FindOne('RiderWallet', condition )
            return{
                balance: response.balance,
            } 
        } catch (error) {
            return {
                error: error.message,
            }
        }
    }

    static async getRiderWalletByUser(userId){
        try {
            const response = await FindOne('RiderWallet', {userId} )
            return response
        } catch (error) {
            return error
        }
    }

    static async updateRiderWallet(userId, id, amount){
        const condition = {
            id,
            userId
        }
        const response = await FindOne('RiderWallet', condition)
        if(Object.keys(response).length){
          const newBalance = response.balance + amount;
          const wallet = await response.update({ balance: newBalance });
          return wallet
        }
        return {error: 'rider wallet not found'}

    }
}
