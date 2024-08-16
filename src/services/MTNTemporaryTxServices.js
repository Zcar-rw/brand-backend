import { FindAll, Create, FindOne, Update } from '../database/queries'

export default class MTNTemporaryTxService{
    static async createNewTemporaryTx(data){
        const {userId, riderWalletId, refId, amount} = data
        try {
            const response = await Create('MTNTemporaryTx', {
                userId,
                riderWalletId,
                kpaymentReferenceId: refId,
                amount
            })
            console.log('##Service/mtntempotx: ', response);
            return response
            
        } catch (error) {
            console.log(error)
        }
    }


    static async changeTemporaryTxStatus(refId, newStatus){
        const response = await Update('MTNTemporaryTx', 
        {status: newStatus},
        {kpaymentReferenceId: refId}
        )
        return response
    }
}
