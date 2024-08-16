/**
 * @openapi
 * 
 * /types:
 *      get:
 *          tags: [Cars]
 *          summary: This list all car types. 
 *          description: List car types.
 * 
 *          responses:
 *                  200:
 *                     description: CarTypes retrieved Succesfully!
 * /makes:
 *      get:
 *          tags: [Cars]
 *          summary: This list all car makes. 
 *          description: List car makes.
 * 
 *          responses:
 *                  200:
 *                     description: CarMakes retrieved Succesfully!
 * 
 * /cars:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [EXPIRED]
 *          summary: This helps users to create a new car. 
 *          description: Create a new car.
 *          requestBody:
 *              description: Provide an email
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              typeId:
 *                                  type: string
 *                              carMakeId:
 *                                  type: string
 *                              status:
 *                                  type: string
 *                                  example: 'Pending, Declined, Inactive, Available, Busy'
 * 
 *          responses:
 *                  201:
 *                     description: Car created Succesfully!
 *                  403: 
 *                     description: No token provided
 *                  500:
 *                     description: Internal Server Error            
 * 
 * /cars/create:
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Cars]
 *          summary: This helps users to create a new car. 
 *          description: Create a new car.
 *          requestBody:
 *              description: Create New Car
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              brandName:
 *                                  type: string
 *                              brandType:
 *                                  type: string
 *                              plateNumber:
 *                                  type: string
 *                              numberOfSeats:
 *                                  type: integer
 *                              yearOfFabrication:
 *                                  type: string
 *                              VIN:
 *                                  type: string
 *                              fuel:
 *                                  type: string
 *                                  example: 'gasoline, diesel, electric, biodisel'
 * 
 *          responses:
 *                  201:
 *                     description: Car created Succesfully!
 *                  400:
 *                     description: Bad Request
 *                  403: 
 *                     description: No token provided
 *                  409:
 *                     description: Car of this VIN or Plate Number exists 
 *                  500:
 *                     description: Internal Server Error   
 * 
 * /cars/owner/{id}:
 *      get:
 *          security:
 *              - BearerToken: []
 *          tags: [Cars]
 *          summary: This list all cars for individual. 
 *          description: List individual cars.
 *          parameters:
 *           - name: id
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
 *                     description: Cars retrieved Succesfully!
 *                  400: 
 *                     description: No cars found.
 * 
 * /cars/public:
 *      get:
 *          tags: [Cars]
 *          summary: This list all public cars. 
 *          description: List public cars.
 *          parameters:
 *           - name: page
 *             in: query
 *             required: true
 *           - name: limit
 *             in: query
 *             required: true
 *           - name: make
 *             in: query
 *           - name: type
 *             in: query
 *           - name: transmission
 *             in: query
 *           - name: driveType
 *             in: query
 *           - name: rentalType
 *             in: query
 * 
 *          responses:
 *                  200:
 *                     description: Public Cars retrieved Succesfully!
 *
 */
