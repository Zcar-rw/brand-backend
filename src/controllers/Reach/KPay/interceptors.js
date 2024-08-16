import axios from 'axios'
import 'dotenv/config'

const { NODE_ENV, KPAY_URL, KPAY_USERNAME, KPAY_PASSWORD } = process.env

const mode = {
  live: {
    url: KPAY_URL,
    credential: {
      username: KPAY_USERNAME,
      password: KPAY_PASSWORD,
    },
  },
  sandbox: {
    url: KPAY_URL,
    credential: {
      username: KPAY_USERNAME,
      password: KPAY_PASSWORD,
    },
  },
}
const KPayInstance =
  NODE_ENV === 'production'
    ? axios.create({ baseURL: mode.sandbox.url, auth: mode.live.credential })
    : axios.create({
        baseURL: mode.sandbox.url,
        auth: mode.sandbox.credential,
      })

KPayInstance.interceptors.request.use(
  (request) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

KPayInstance.interceptors.response.use(
  (response) => {
    let data = response.data
    let message = ''
    let PAYMENT_STATUS
    if (!data.success) {
      message = data.reply
      PAYMENT_STATUS = 400  // UNKNOWN, GENERAL ERROR
    } else if (data.success && data.retcode === 0) {
      PAYMENT_STATUS = 201 // SUCCESS INITIATED
      message = 'Transaction being processed'
    }
    return {
      message,
      PAYMENT_STATUS,
      data,
    }
  },
  (error) => {
    if (error?.response?.status == 401 && error.code === 'ERR_BAD_REQUEST') {
      console.log('Missing authentication header')
    }
    return Promise.reject(error)
  }
)

export default KPayInstance
