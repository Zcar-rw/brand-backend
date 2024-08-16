/**
 * @openapi
 * 
 * /contactus:
 *      post:
 *          tags: [Contact Us]
 *          security:
 *              - BearerToken: []
 *          summary: This helps users either authenticated or not to send contact inquiry. 
 *          description: Contact us.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              title:
 *                                  type: string
 *                              message:
 *                                  type: string
 *                              image:
 *                                  type: string
 *                              type:
 *                                  type: string
 *              
 *          responses:
 *                  201:
 *                     description: Contact us message sent successfully!
 * 
 *      get:
 *          tags: [Contact Us]
 *          security:
 *              - BearerToken: []
 *          summary: This list all contacts messages. 
 *          description: List Contacts Messages.
 *          parameters:
 *             - name: page
 *               required: true
 *               type: integer
 *               in: query
 *
 *             - name: limit
 *               type: integer
 *               in: query
 *          responses:
 *                  200:
 *                     description: Contact messages retrieved Succesfully!  
 *                  401:
 *                     description: Unauthorized 
 */
