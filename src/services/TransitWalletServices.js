/* eslint-disable require-jsdoc */
import 'dotenv/config'
import {
    Create,
  FindAll,
  FindOne,
} from '../database/queries'
import * as helper from '../helpers'
import db from '../database/models'
import {DriverServices} from '../services'
import calculateIncome from '../helpers/formulas'

export default class TransitWalletServices{
    /**
     * @params {string} riderWalletId - Wallet of rider.
     * @params {decimal} pickUpPrice - Amount to be refunded (paid to ride)
     * @params {string} userId - User who performs action
     * @params {string} rideId - ID of the ride
     * 
     * @returns {boolean} True (Updated riderwallet, transactions regard with refund) or False.
     * 
     */
    static async refundMoney(riderWalletId, pickUpPrice, userId, rideId){
         try {
            //1. record new transit wallet for debitting
            const debitTransitWallet = await Create('TransitWallet', {
                userId,
                rideId,
                riderWalletId,
                type: 'refund',
                method: 'debited',
                amount: pickUpPrice
            })
            //2. update a riderWallet
            const  riderWalletResp = await FindOne('RiderWallet', {id: riderWalletId})
            if(riderWalletResp){
                await riderWalletResp.update({
                    balance: riderWalletResp.balance + pickUpPrice
                })
            }

            //3. record a transaction
            const schema = helper.schema.rideTransactionSchema('refund')
            const refundTransaction = {
                userId,
                rideId,
                riderWalletId,
                transitWalletId: debitTransitWallet.id,
                amount: debitTransitWallet.amount,
                ...schema
            };

            const transaction = await Create('Transactions', {...refundTransaction})
            if(transaction && debitTransitWallet && riderWalletResp){
                return true
            }
            return false
         } catch (error) {
             return {
                 error: error.message,
             }
         }
    }

    static async moveFundToDriver(rideId, riderWalletId, userId, pickUpPrice){
        const ride = await FindOne('Ride', {id: rideId})
        if(!Object.keys(ride).length){
            return false
        }
        //1. get ride owner wallet => (ride.userId)
        const driverWallet = await FindOne('DriverWallet', {
          userId: ride.userId  
        })
        const {driverWalletId} = await DriverServices.getDriverWalletIdByRideId(rideId)

        //2. get amount from transit wallet for this ride
        const transitWallet = await FindOne('TransitWallet', {
            rideId,
            riderWalletId,
            type: 'transit'
        })

        //3. calculate income
        const { driverIncome, VAT, localNetIncome} = calculateIncome(pickUpPrice)

        //4. credit driver wallet
        const updatedDriverWallet = await DriverServices.updateDriverWallet(driverWalletId, driverIncome)
        
        //5. debit transit wallet
        const debitTransitWallet = await Create('TransitWallet',{
            userId,
            rideId,
            riderWalletId,
            driverWalletId,
            type: 'pay',
            method: 'debited',
            amount: pickUpPrice
        }) 

        //6. record a transaction
        const transaction = await Create('Transactions', {
            userId: ride.userId,
            rideId: ride.id,
            riderWalletId,
            driverWalletId,
            transitWalletId: debitTransitWallet.id,
            tax: VAT,
            amount: pickUpPrice,
            LOCAR_NET_INCOME: localNetIncome,
            type: 'fundTransfer',
            transactionCode: helper.generator.transactionCode('fundTransfer')

        })
        if(updatedDriverWallet && debitTransitWallet && transaction){
            return true
        }else{
            return false
        }
    }

    static async getTransitWallet(userId, rideId, method){
        try {
            const response = await FindOne('TransitWallet', {userId, rideId, method} )
            return response
        } catch (error) {
            return error
        }
    }
}
