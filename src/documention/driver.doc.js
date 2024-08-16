/**
 * @openapi
 * 
 * /users/user/become-a-driver:
 *      put:
 *          security:
 *              - BearerToken: []
 *          tags: [Driver]
 *          summary: This helps a user to become a driver. 
 *          description: Becoming a Driver.
 * 
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ID:
 *                                      type: string
 *                              drivingLicenseNumber:
 *                                      type: string   
 *                              drivingLicenseExpireDate:
 *                                      type: string           
 *  
 *          responses:
 *                  200:
 *                     description: Driver becoming requests sent Succesfully!
 * 
 * 
 * /user-rides/pending-requests/driver:
 *      get:
 *          tags: [Driver]
 *          security:
 *              - BearerToken: []
 *          summary: This helps a driver to list all pending requests to join my created rides. 
 *          description: Get Pending Requests.
 *          responses:
 *                  200:
 *                     description: Pending requests retrieved Succesfully!
 * 
 * /user-rides/rider:
 *      get:
 *          tags: [Rider]
 *          security:
 *              - BearerToken: []
 *          summary: This helps a rider to list all user rides of his/her. 
 *          description: Get User Rides.
 *          responses:
 *                  200:
 *                     description: User Rides retrieved Succesfully!
 *                  400:
 *                     description: Bad Request
 *                  404:
 *                     description: Not Found
 * 
 * /user-rides/rider/upcoming:
 *      get:
 *          tags: [Rider]
 *          security:
 *              - BearerToken: []
 *          summary: This helps a rider to list upcoming (unstarted and active) rides. 
 *          description: Get Upcoming Rides.
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
 *                     description: User Rides retrieved Succesfully!
 *                  400:
 *                     description: Bad Request
 *                  404:
 *                     description: Not Found
 * 
 * 
 * /user-rides/{userRideId}/reject/driver:
 *      post:
 *          tags: [Driver]
 *          security:
 *              - BearerToken: []
 *          summary: This helps a driver to reject a joining ride request. 
 *          description: Reject Requests.
 *          parameters: 
 *              - name: userRideId
 *                in: path
 *          responses:
 *                  200:
 *                     description: Pending requests cancelled Succesfully!
 * 
 * /user-rides/{userRideId}/approve/driver:
 *      post:
 *          tags: [Driver]
 *          security:
 *              - BearerToken: []
 *          summary: This helps a driver to approve a joining ride request. 
 *          description: Approve Joining ride Request.
 *          parameters: 
 *              - name: userRideId
 *                in: path
 *                required: true
 *          responses:
 *                  200:
 *                     description: Joining request Accepted Succesfully!
 * 
 * /user-rides/joined/rider:
 *      get:
 *          tags: [Rider]
 *          security:
 *              - BearerToken: []
 *          summary: This helps a rider to list all Rides s/he joined. 
 *          description: Get Joined Rides.
 *          responses:
 *                  200:
 *                     description: Joined Rides retrieved Succesfully!
 *                  401:
 *                     description: Not authorized
 * 
 * /rides/driver/upcoming:
 *      get:
 *          tags: [Driver]
 *          security:
 *              - BearerToken: []
 *          summary: This helps a driver to list upcoming (unstarted && active) rides. 
 *          description: Get Upcoming Rides.
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
 *                     description: Upcoming Rides retrieved Succesfully!
 *                  400:
 *                     description: Bad Request
 *                  401:
 *                     description: Not authorized
 *                  404:
 *                     description: Not Found
 * 
 */