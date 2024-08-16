/**
 * @openapi
 * 
 * /ride-stations/pickup/{rideId}:
 *      get:
 *          tags: [RIDE CREATION]
 *          description: List of all Pickup stations
 *          summary: It lists all pickup stations on ride
 *          parameters:
 *           - name: rideId
 *             in: path
 *             type: string
 *             required: true
 *          responses:
 *                  200:
 *                      description: PickUp stations retrieved succesfully
 *                  400:
 *                      description: Bad Request
 *                  500:
 *                      description: Internal server error
 * 
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE CREATION]
 *          description: starting point of a ride
 *          summary: It helps to create starting station of ride.
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *             type: string
 *          requestBody:
 *              description: Payload for creating pickUp
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              stationId:
 *                                  type: string
 *                              departureTime:
 *                                  type: string
 *                              price:
 *                                  type: integer
 *                              note:
 *                                  type: string
 *                              
 *          responses:
 *                   201:
 *                      description: Pickup station created successfully
 *                   400:
 *                      description: Bad Request
 *                   409:
 *                      description: PickUp/starting station alteady exists
 *                   500:
 *                      description: Internal server error
 *                          
 * /ride-stations/pickup/{rideId}/pickin:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [RIDE CREATION]
 *          description: In between stations of a ride
 *          summary: It helps to create other stations in between starting and dropoff station of ride.
 *          parameters:
 *           - name: rideId
 *             in: path
 *             required: true
 *             type: string
 *          requestBody:
 *              description: Payload for creating pickIn station
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              stationId:
 *                                  type: string
 *                              price:
 *                                  type: integer
 *                              departureTime:
 *                                  type: string
 *                              note:
 *                                  type: string
 *                              
 *          responses:
 *                   201:
 *                      description: PickIn station created successfully
 *                   400:
 *                      description: Bad Request
 *                   500:
 *                      description: Internal server error
 *          
 */
