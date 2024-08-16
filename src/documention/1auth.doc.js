/**
 * @openapi
 * 
 * /auth/register/email:
 *      post:
 *          tags: [Authentication]
 *          summary: This helps to register your email and get OTP. 
 *          description: register your email.
 *          requestBody:
 *              description: Provide an email
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 * 
 *          responses:
 *                  201:
 *                     description: Email registered and OTP sent!
 *                  400:
 *                     description: Bad Request
 *                  404:
 *                     description: Not Found
 *                  500:
 *                     description: Internal server error
 *
 * 
 * /auth/register/verify-otp:
 *      post:
 *          tags: [Authentication]
 *          summary: This helps to verify your email by providing OTP. 
 *          description: verify your email.
 *          requestBody:
 *              description: Provide an email
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              code:
 *                                  type: string
 * 
 *          responses:
 *                  201:
 *                     description: Successfully Email Verified!
 *                  400:
 *                     description: Bad Request
 *                  404:
 *                     description: we can not find the OTP you provided
 *                  500:
 *                     description: Internal server error
 * 
 * 
 * /auth/register/complete:
 *      post:
 *          tags: [Authentication]
 *          summary: This helps to complete your registration. 
 *          description: complete registration.
 *          requestBody:
 *              description: Provide information
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              code:
 *                                  type: string
 *                              firstName:
 *                                  type: string
 *                              lastName:
 *                                  type: string
 *                              phoneNumber:
 *                                  type: string
 *                              intlPhoneNumber:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                              country:
 *                                  type: string
 *                              callingCode:
 *                                  type: string
 * 
 *          responses:
 *                  201:
 *                     description: Registration complete!
 *                  400:
 *                     description: we can not register your account at this moment. Refresh the page and try again
 *                  409:
 *                     description: Account with email or phone number already exists
 *                  500:
 *                     description: Internal server error
 * 
 * 
 * /auth/login/admin:
 *      post:
 *          tags: [Authentication]
 *          summary: This helps to login into your account. 
 *          description: login into your account
 *          requestBody:
 *              description: Provide an email
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              password:
 *                                  type: string
 * 
 *          responses:
 *                  200:
 *                     description: Successfully loggedIn!
 *                  400:
 *                     description: User not found.
 *                  401:
 *                     description: Unauthorized.
 *                  500:
 *                     description: Internal server error
 * 
 * /auth/login/public:
 *      post:
 *          tags: [Authentication]
 *          summary: This helps to login into your account. 
 *          description: login into your account
 *          requestBody:
 *              description: Provide an email
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              password:
 *                                  type: string
 * 
 *          responses:
 *                  200:
 *                     description: Successfully loggedIn!
 *                  400:
 *                     description: User not found.
 *                  401:
 *                     description: Unauthorized.
 *                  500:
 *                     description: Internal server error
 * 
 * 
 * /auth/user:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [Authentication]
 *          summary: This helps to get a user. 
 *          description: get a user
 * 
 *          responses:
 *                  200:
 *                     description: Successfully loggedIn!
 *                  400:
 *                     description: User not found.
 *                  401:
 *                     description: Unauthorized.
 *                  500:
 *                     description: Internal server error
 * 
 * /auth/reset-password:
 *      post:
 *          tags: [Authentication]
 *          summary: This helps to reset password. 
 *          description: Reset Password.
 *          requestBody:
 *              description: Provide information
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              
 *          responses:
 *                  201:
 *                     description: Registration complete!
 *                  400:
 *                     description: we can not register your account at this moment. Refresh the page and try again
 *                  409:
 *                     description: Account with email or phone number already exists
 *                  500:
 *                     description: Internal server error
 * 
 * /auth/reset-password/verify-reset-code:
 *      post:
 *          tags: [Authentication]
 *          summary: This helps to verify your code and email during reset password. 
 *          description: Verify Email and Reset Password code.
 *          requestBody:
 *              description: Provide an email and reset Code
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              code:
 *                                  type: string
 *          responses:
 *                  201:
 *                     description: Successfully Email and Reset Code Verified!
 *                  400:
 *                     description: Bad Request
 *                  404:
 *                     description: we can not find the Reset Code you provided
 *                  500:
 *                     description: Internal server error
 * 
 * /auth/reset-password/update-password:
 *      patch:
 *          tags: [Authentication]
 *          summary: This helps to user to update password. 
 *          description: Update Password.
 *          requestBody:
 *              description: Provide an email and reset Code
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              code:
 *                                  type: string
 *                              password:
 *                                  type: string
 *          responses:
 *                  201:
 *                     description: Successfully Password Updated!
 *                  400:
 *                     description: Bad Request
 *                  500:
 *                     description: Internal server error
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
 */
