/**
 * @openapi
 * 
 * /transactions/rider:
 *          get:
 *             security:
 *                  - BearerToken: []
 *             tags: [Transactions]
 *             description: List all rider transactions
 *             summary: List rider transactions
 *             parameters:
 *                  - name: page
 *                    required: true
 *                    type: integer
 *                    in: query
 * 
 *                  - name: limit
 *                    type: integer
 *                    in: query
 *             responses:
 *                    200:
 *                       description: Transactions retrieved successfully
 *                    500:
 *                       description: Internal Server Error
 * 
 * /transactions/driver:
 *          get:
 *             security:
 *                  - BearerToken: []
 *             tags: [Transactions]
 *             description: List all driver transactions
 *             summary: List driver transactions
 *             parameters:
 *                  - name: page
 *                    required: true
 *                    type: integer
 *                    in: query
 * 
 *                  - name: limit
 *                    type: integer
 *                    in: query
 *             responses:
 *                    200:
 *                       description: Transactions retrieved successfully
 *                    401:
 *                       descriprion: Not allowed to perform this task
 *                    500:
 *                       description: Internal Server Error
 * 
 */

