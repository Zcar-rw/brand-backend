import generator from "../generator"

export default (type)=>{
    return {
        tax: 0,
        LOCAR_NET_INCOME: 0,
        driverWalletId: null,
        type,
        transactionCode: generator.transactionCode(type)
    }
}
