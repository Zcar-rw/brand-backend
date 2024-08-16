import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid'

const {
  BACKEND_URL,
  KPAY_RETAILERID,
  KPAY_BANKID_MOBILE_MONEY,
  KPAY_BANKID_AIRTEL_MONEY,
} = process.env

export default (payMethod, phoneNumber, amount, user) => {
  let payData
  switch (payMethod) {
    case 'mobile-money':
      payData = {
        action: 'pay',
        msisdn: `${phoneNumber}`,
        email: `${user.email}`,
        details: 'Top up for Reach using mobile money',
        refid: `${uuidv4()}`,
        amount: amount,
        cname: `${user.user.get().firstName} ${user.user.get().lastName}`,
        cnumber: `${user.user.get().phoneNumber}`,
        pmethod: 'momo',
        retailerid: `${KPAY_RETAILERID}`,
        returl: `${BACKEND_URL}/top-up/callback`,
        redirecturl: `${BACKEND_URL}/top-up/callback`,
        bankid: `${KPAY_BANKID_MOBILE_MONEY}`,
      }
      break

    case 'airtel-money':
      payData = {
        action: 'pay',
        msisdn: `${phoneNumber}`,
        email: `${user.email}`,
        details: 'Top up for Reach using airtel money',
        refid: `${uuidv4()}`,
        amount: amount,
        cname: `${user.user.get().firstName} ${user.user.get().lastName}`,
        cnumber: `${user.user.get().phoneNumber}`,
        pmethod: 'momo',
        retailerid: `${KPAY_RETAILERID}`,
        returl: `${BACKEND_URL}/top-up/callback`,
        redirecturl: `${BACKEND_URL}/top-up/callback`,
        bankid: `${KPAY_BANKID_AIRTEL_MONEY}`,
      }
      break
    default:
      break
  }
  return payData
}
