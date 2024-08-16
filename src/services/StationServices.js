import { FindAll, Create, FindOne, Update } from '../database/queries'

export default class StationService{
    static async getStationNameById(stationId){
        try {
            const condition = {
                id: stationId
            }
            const response = await FindOne('Station', condition)
            return {
                    name:response.name, 
                    province: response.province,
                    district: response.district,
                    sector: response.sector,
                    streetNumber: response.streetNumber,
                    landmark: response.landmark,
                }
            
        } catch (error) {
            console.log(error)
        }
        

    }
}