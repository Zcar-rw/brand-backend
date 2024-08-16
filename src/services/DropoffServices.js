/* eslint-disable require-jsdoc */
import 'dotenv/config'
import {
  Create,
} from '../database/queries'

export default class DropOffServices {
    
    static async saveDropoff(rideId, userId, dropoff){
      const data = {
        ...dropoff,
        userId,
        rideId
      }

      try {
        const response = await Create('RideDropoffStation', data)
        return response
      } catch (error) {
        return { error: error.message }
      }
    }

}
