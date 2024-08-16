/**
 * @openapi
 *
 * /stations/search:
 *          get:
 *             tags: [Stations]
 *             description: Get stations by name
 *             summary: It helps to search station by characters
 *             parameters:
 *                 - name : name
 *                   type: string
 *                   in: query
 *                   required: true
 *
 *             responses:
 *                    200:
 *                       description: Stations searched successfully
 *                    400:
 *                       description: Bad Request
 *
 * /stations:
 *      get:
 *         tags: [Stations]
 *         description: Get all stations
 *         summary: It returns all stations
 *         parameters:
 *             - name: page
 *               required: true
 *               type: integer
 *               in: query
 *
 *             - name: limit
 *               type: integer
 *               in: query
 *         responses:
 *                 200:
 *                    description: Stations retrieved successfully
 *                 400:
 *                    description: Bad Request
 *
 *      post:
 *          security:
 *              - BearerToken: []
 *          tags: [Stations]
 *          description: Only Admin is allowed to create new station
 *          summary: It helps ADMIN to create new station
 *          requestBody:
 *              description: Only Admin create station
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  required: true
 *                              province:
 *                                  type: string
 *                                  required: true
 *                              district:
 *                                  type: string
 *                                  required: true
 *                              sector:
 *                                  type: string
 *                                  required: true
 *                              streetNumber:
 *                                  type: string
 *                                  required: true
 *                              landmark:
 *                                  type: string
 *                                  required: true
 *                              longitude:
 *                                  type: integer
 *                              latitude:
 *                                  type: integer
 *                              popularity:
 *                                  type: string
 *                                  required: true
 *                                  example: 1-5
 *          responses:
 *                        201:
 *                           description: Station created!
 *
 * /stations/{id}:
 *          get:
 *             tags: [Stations]
 *             description: Get single station by its id
 *             summary: It returns a station by its id
 *             parameters:
 *              - name : id
 *                type: string
 *                in: path
 *                required: true
 *
 *             responses:
 *                     200:
 *                       description: Stations retrieved successfully
 *                     400:
 *                       description: Bad Request
 *
 *
 */
