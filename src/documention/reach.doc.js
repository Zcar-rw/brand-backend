/**
 * @openapi
 * 
 * /reach/wallet/{walletId}/topup:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Reach :: Wallet & Transactions]
 *          summary: This helps to add money into rider wallet. 
 *          description: TopUp Rider wallet.
 *          parameters:
 *           - name: walletId
 *             in: path
 *             required: true
 * 
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              amount:
 *                                  type: integer 
 *          responses:
 *                  200:
 *                     description: TopUp Succesfully!
 *                  500:
 *                     description: Internal Server Error
 * 
 * /reach/wallet/rider/balance:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [Reach :: Wallet & Transactions]
 *          summary: This helps to check balance of rider wallet. 
 *          description: Check Balance of rider wallet.
 *          responses:
 *                  200:
 *                     description: Balance retrieved Succesfully!
 *                  404:
 *                     description: Rider wallet not found
 *                  500:
 *                     description: Internal Server Error
 * 
 * /reach/wallet/driver/balance:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [Reach :: Wallet & Transactions]
 *          summary: This helps to check balance of a driver wallet. 
 *          description: Check Balance of driver wallet.
 * 
 *          responses:
 *                  200:
 *                     description: Balance retrieved Succesfully!
 *                  404:
 *                     description: Driver wallet not found 
 *                  401:
 *                     description: Ony driver is allowed.
 *                  500:
 *                     description: Internal Server Error
 * 
 * /top-up:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [KPAY]
 *          summary: This helps to add money into rider wallet. 
 *          description: TopUp Rider wallet.
 *          parameters:
 *              - name: method
 *                in: query
 *                description: Which method are you going to use for topup ['airtel-money', 'mobile-money']
 *                required: true
 *          requestBody:
 *              required: true
 *              description: Phone number with country code but no + sign
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              phoneNumber:
 *                                  type: string
 *                              amount:
 *                                  type: integer
 *          responses:
 *                  200:
 *                     description: TopUp Succesfully!
 *                  400:
 *                     description: Bad Request
 *                  401:
 *                     description: Unauthorized
 *                  403:
 *                     description: Forbidden
 *                  500:
 *                     description: Internal Server Error
 */