import 'dotenv/config'

export default async (req, res, next) => {
  // callback url served over https is allowed
  const protocol = req.get('X-Forwarded-Proto') // returns (https) protocol, while req.protocol -> http
  const callbackUrl = protocol + '://' + req.get('host') + req.originalUrl

  const { BACKEND_URL } = process.env

  let CALLBACK_URLS = [`${BACKEND_URL}/top-up/callback`]

  if (CALLBACK_URLS.includes(callbackUrl)) {
    // Callback URL is allowed, continue processing the request
    next()
  } else {
    // Callback URL is not allowed, return an error response
    res.status(401).send('Unauthorized')
  }
}
