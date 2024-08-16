/**
 * @openapi
 * 
 * /rides/{carId}:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [EXPIRED]
 *          summary: This helps to create rides of a car. 
 *          description: Create car's ride.
 *          parameters:
 *              - name: carId
 *                in: path
 *                description: Provide Car Id
 *                required: true
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              numberOfSeats:
 *                                      type: string        
 *  
 *          responses:
 *                  201:
 *                     description: Ride created Succesfully!
 * 
 * 
 * /rides/create:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE CREATION]
 *          summary: This helps to create rides of a car.
 *          description: Create car's ride.
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              carId:
 *                                  type: string
 *                              dropoff:
 *                                  type: object
 *                                  properties:
 *                                       stationId:
 *                                          type: string
 *                                       dropoffNote:
 *                                          type: string
 *                              pickup:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      description: Type of pickup ['starting', 'pickin']
 *                                      properties:
 *                                          stationId:
 *                                              type: string
 *                                          type: 
 *                                              type: string
 *                                              example: 'starting, pickIn'
 *                                          departureTime:
 *                                              type: string
 *                                          price:
 *                                              type: string
 *                                          note:
 *                                              type: string
 *                              seats:
 *                                  type: integer
 *                                  minimum: 1
 *                                  maximum: 7
 *          responses:
 *                  201:
 *                     description: Ride created Succesfully!
 *                  400:
 *                     description: Bad request
 *                  401:
 *                     description: Unauthorized
 *                  404:
 *                     description: Not found
 *                  409:
 *                     description: StationIds must be different on dropoff and each pickup
 * 
 * 
 * /rides/driver:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE LISTING]
 *          summary: This helps to list all rides created by driver. 
 *          description: Get rides by driver.      
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
 *                     description: Only driver can perform this action
 *                  404:
 *                     description: No rides found
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /rides/rider:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE LISTING]
 *          summary: This List all rides of a user. 
 *          description: Get user's Ride.
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
 *                     description: Rides retrieved Succesfully!
 *                  404:
 *                     description: No rides found
 *                  500:
 *                     description: Internal Server Error
 * 
 *
 * /rides/detail/{rideId}/driver:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE LISTING]
 *          summary: It helps to get detalis of a ride by driver. 
 *          description: Get Ride's Detail by driver.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *             description: Provide Ride Id
 *          responses:
 *                  200:
 *                     description: Ride's details retrieved Succesfully! 
 *                  401:
 *                     description: Only Driver is authorized.
 * 
 * /rides/detail/{rideId}/rider:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE LISTING]
 *          summary: It helps to get details of a ride by rider. 
 *          description: Get Ride's Detail by rider.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *          responses:
 *                  200:
 *                     description: Ride's details retrieved Succesfully!
 *                  404:
 *                     description: Ride not found 
 *
 * /rides/search:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [SEARCH RIDE]
 *          summary: This Helps to search rides. 
 *          description: Search Rides.         
 *          parameters:
 *           - name: key
 *             in: query
 *          responses:
 *                  200:
 *                     description: Rides retrieved Succesfully!
 * 
 * 
 * /rides/{rideId}/request/ask/{pickupId}:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Ride Requests]
 *          summary: This helps a rider to request to join a pickup/pickin of a ride. 
 *          description: Request Joinning the Ride.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 * 
 *           - name: pickupId
 *             in: path
 *             description: Should be starting station or pickin station of a ride
 *             required: true
 * 
 *          requestBody:
 *              required: false
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              pickupNote:
 *                                  type: string
 *          responses:
 *                  201:
 *                     description: Request Joining a ride Succesfully!
 *                  204:
 *                     description: No content for this ride / Ride not found
 *                  400:
 *                     description: Bad Request
 *                  402:
 *                     description: You don't have enough funds
 *                  404:
 *                     description: Ride seats are full or provided pickup do not exist on this ride
 *                  409:
 *                     description: You have already requested to join this Ride
 *                  500:
 *                     description: Internal Server Error
 * 
 * /rides/{rideId}/pay-ride:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [EXPIRED]
 *          summary: This helps a rider to pay a ride. 
 *          description: Paying a Ride.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *             description: Provide rideId
 *          responses:
 *                  200:
 *                     description: Ride Paid Succesfully!
 *                  204:
 *                     description: No content for this ride / Ride not found
 *                  406:
 *                     description: Not enough funds to pay a ride
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /rides/{rideId}/request/approve/{userRideId}:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Ride Requests]
 *          summary: This helps to approve joinning ride request. 
 *          description: Approve joining request on a Ride.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 * 
 *           - name: userRideId
 *             in: path
 *             required: true
 * 
 *          responses:
 *                  200:
 *                     description: Ride joining request approved Succesfully!
 *                  204:
 *                     description: No content for this ride / Ride not found
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /rides/{rideId}/create/complete:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE CREATION]
 *          summary: This helps a driver to complete ride information. 
 *          description: Complete Ride.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *          responses:
 *                  200:
 *                     description: Ride information completed Succesfully!
 *                  204:
 *                     description: No content for this ride / Ride not found
 *                  401:
 *                     description: Only Driver is authorized to perform this task 
 *                  400:
 *                     description: Ride needs to have both pickup and dropoff
 *                  409:
 *                     description: You have already completed this Ride
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /rides/{rideId}/go/start:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Ride On The Go]
 *          summary: This helps a driver to start a ride. 
 *          description: Starting a Ride.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *             description: Provide rideId
 *          responses:
 *                  200:
 *                     description: Ride Started Succesfully!
 *                  204:
 *                     description: No content for this ride / Ride not found
 *                  400:
 *                     description: Ride has incomplete information
 *                  401:
 *                     description: Only Driver is authorized
 *                  409:
 *                     description: You have already started this Ride
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /rides/{rideId}/go/entercar/rider:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Ride On The Go]
 *          summary: This helps a rider to join the car on a ride. 
 *          description: Joinning car on Ride.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *             description: Provide rideId
 *          requestBody:
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: string
 *          responses:
 *                  200:
 *                     description: Ride Started Succesfully!
 *                  204:
 *                     description: No content for this ride / Ride not found
 *                  400:
 *                     description: Ride has incomplete information
 *                  409:
 *                     description: You have already started this Ride
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /user-rides/{userRideId}/cancel/rider:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Rider]
 *          summary: This helps a rider to cancel a ride. 
 *          description: Cancelling a Ride.         
 *          parameters:
 *           - name: userRideId
 *             in: path
 *             required: true
 *             description: Provide User Ride Id
 *          responses:
 *                  200:
 *                     description: UserRide Cancelled Succesfully!
 *                  404:
 *                     description: UserRide not found!
 *                  500:
 *                     description: Internal Server Error
 * 
 * 
 * /rides/{rideId}/go/complete:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Ride On The Go]
 *          summary: This helps a driver to complete a ride. 
 *          description: Complete a Ride.         
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *             description: Provide rideId
 *          responses:
 *                  200:
 *                     description: Ride Completed Succesfully!
 *                  204:
 *                     description: No content for this ride / Ride not found
 *                  400:
 *                     description: Ride has incomplete information
 *                  409:
 *                     description: You have already started this Ride
 *                  500:
 *                     description: Internal Server Error
 * 
 * /rides/{rideId}/cancel/driver:
 *      patch:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE CREATION]
 *          summary: This helps to create rides of a car. 
 *          description: Create car's ride.
 *          parameters:
 *              - name: rideId
 *                in: path
 *                description: Provide Ride Id you want to cancel.
 *                required: true
 *                  
 *  
 *          responses:
 *                  200:
 *                     description: Ride cancelled Succesfully!
 *                  403:
 *                     description: Not allowed to cancel this ride
 * 
 * /rides/shareable/public/{shareId}:
 *      get:
 *          tags: [RIDE LISTING]
 *          summary: Check Ride existence by its shareId. 
 *          description: Check ride existence.         
 *          parameters:
 *           - name: shareId
 *             in: path
 *             required: true
 *             description: Provide Share Id
 *          responses:
 *                  200:
 *                     description: Ride Exists 
 *                  404:
 *                     description: Not Found
 * 
 */
