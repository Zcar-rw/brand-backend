/**
 * @openapi
 * 
 * /cars/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps Admin to list all users cars. 
 *          description: List Users cars.
 *          parameters:
 *           - name: page
 *             in: query
 *             required: true
 *      
 *           - name: limit
 *             in: query
 * 
 *          responses:
 *                  200:
 *                     description: Cars retrieved Succesfully!
 *                  401:
 *                     description: Not Authorized | Only Admin is allowed!
 *                  400: 
 *                     description: No cars found.
 * 
 * /cars/{userId}/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps Admin to list all users cars. 
 *          description: List Users cars.
 *          parameters:
 *           - name: userId
 *             in: path
 *             required: true
 *          responses:
 *                  200:
 *                     description: Cars retrieved Succesfully!
 *                  401:
 *                     description: Not Authorized | Only Admin is allowed!
 *                  404:
 *                     description: Not Found.
 *                  400: 
 *                     description: Bad Request.
 * 
 * /rides/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps to list all rides by Admin. 
 *          description: Get rides by Admin.      
 *          parameters:
 *           - name: page
 *             in: query
 *             required: true
 *      
 *           - name: limit
 *             in: query
 *          
 *  
 *          responses:
 *                  200:
 *                     description: Rides retrieved Succesfully!
 *                  401:
 *                     description: Only Admin can perform this action
 *                  404:
 *                     description: No rides found
 *                  500:
 *                     description: Internal Server Error
 * 
 * /rides/{userId}/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps to list rides for a specific user by Admin. 
 *          description: Get rides for a specific user by Admin.      
 *          parameters:
 *           - name: userId
 *             in: path
 *             required: true
 *          
 *           - name: page
 *             in: query
 *             required: true
 *      
 *           - name: limit
 *             in: query
 *          
 *          responses:
 *                  200:
 *                     description: Rides retrieved Succesfully!
 *                  401:
 *                     description: Only Admin can perform this action
 *                  404:
 *                     description: No rides found
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /user-rides/joined/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps to list all joined user-rides by Admin. 
 *          description: Get user-rides by Admin.      
 *          parameters:
 *           - name: page
 *             in: query
 *             required: true
 *      
 *           - name: limit
 *             in: query
 *          responses:
 *                  200:
 *                     description: Joined User Rides retrieved Succesfully!
 *                  401:
 *                     description: Only Admin can perform this action
 *                  404:
 *                     description: No rides found
 *                  500:
 *                     description: Internal Server Error
 * 
 * /transactions/admin:
 *          get:
 *             security:
 *                  - BearerToken: []
 *             tags: [ADMIN::BO]
 *             description: List all transactions for admin
 *             summary: List all transactions
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
 * /transactions/{userId}/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps to get transactions for a specific user. 
 *          description: Get Transactions for a specific user
 *          parameters:
 *                  - name: userId
 *                    required: true
 *                    in: path
 *          responses:
 *                  200:
 *                     description: Transactions retrieved successfully!
 *                  400:
 *                     description: User not found.
 *                  401:
 *                     description: Unauthorized.
 *                  404:
 *                     description: Not Found.
 *                  500:
 *                     description: Internal server error.
 * 
 * /users/{userId}/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps to get specific user profile. 
 *          description: Get a user profile
 *          parameters:
 *                  - name: userId
 *                    required: true
 *                    in: path
 *          responses:
 *                  200:
 *                     description: Profile retrieved successfully!
 *                  400:
 *                     description: User not found.
 *                  401:
 *                     description: Unauthorized.
 *                  404:
 *                     description: Not Found.
 *                  500:
 *                     description: Internal server error.
 * 
 * /users/{userId}/update-user-info:
 *      patch:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps to update user Info -> role and status. 
 *          description: Update user info
 *          parameters:
 *                  - name: userId
 *                    required: true
 *                    in: path
 *          requestBody:
 *              description: Update user Role info
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              role:
 *                                  type: string
 *                              status:
 *                                  type: string
 *                              
 *          responses:
 *                  200:
 *                     description: UserInfo updated successfully!
 *                  400:
 *                     description: User not found.
 *                  401:
 *                     description: Unauthorized.
 *                  404:
 *                     description: Not Found.
 *                  409: 
 *                     description: User already has this Role
 *                  500:
 *                     description: Internal server error.
 * 
 * /activities/admin:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [ADMIN::BO]
 *          summary: This helps to list all activities.
 *          description: List Activities.
 *          parameters:
 *           - name: page
 *             in: query
 *             required: true
 *      
 *           - name: limit
 *             in: query
 * 
 *          responses:
 *                  200:
 *                     description: Activities retrieved Succesfully!
 *                  400:
 *                     description: Bad Request
 *                  403:
 *                     description: Not authorized | Provide token
 */