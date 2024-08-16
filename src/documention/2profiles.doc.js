/**
 * @openapi
 * 
 * /profiles:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [Profiles]
 *          summary: This list all users profiles. 
 *          description: List users profiles.
 * 
 *          responses:
 *                  200:
 *                     description: Users Profiles retrieved Succesfully!
 * 
 * /profiles/update:
 *      patch:
 *          security: 
 *              - BearerToken: []
 *          tags: [Profiles]
 *          summary: This Allows user to edit her/his profile information.
 *          description: Edit Profile information. 
 *          requestBody:
 *              description: New Profile information
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              firstName:
 *                                  type: string
 *                              lastName:
 *                                  type: string
 *                              country:
 *                                  type: string
 *                              callingCode:
 *                                  type: string
 *                              phoneNumber:
 *                                  type: string
 *                              intlPhoneNumber:
 *                                  type: string
 *                              ID:
 *                                  type: string
 *          responses:
 *                  200:
 *                     description: User profile information updated Succesfully!
 *                  400:
 *                     description: Bad Request during updating profile information.
 * 
 */
