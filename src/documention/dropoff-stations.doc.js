/**
 * @openapi
 * 
 * /ride-stations/dropoff/{rideId}:
 *          post:
 *              security:
 *                  - BearerToken: []
 *              tags: [RIDE CREATION]
 *              description: Create new dropoff station
 *              summary: It helps to create new dropoff station on ride
 *              parameters:
 *              - name: rideId
 *                in: path
 *                type: string
 *                required: true
 *              requestBody:
 *                  description: Create New Station
 *                  required: true
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  stationId:
 *                                      type: string
 *                                  dropoffNote:
 *                                      type: string
 *                              
 *              responses:
 *                      201:
 *                         description: dropoff station created successfully
 *                      400:
 *                         description: Bad Request
 *                      403:
 *                         description: You need token to perform this task
 *                      500:
 *                         description: Internal server error
 *               
 * 
 *          get:
 *             tags: [RIDE CREATION]
 *             description: Get a dropoff station
 *             summary: Get a dropoff station
 *             parameters:
 *              - name: rideId
 *                in: path
 *                type: string
 *                required: true
 * 
 *             responses:
 *                      200:
 *                         description: Dropoff retrieved succesfully!
 *                      204:
 *                         description: No content for this ride or Ride doesn't exist
 *                      400:
 *                         description: Bad Request
 *                      409: 
 *                         description: Dropoff already exist on this ride
 */