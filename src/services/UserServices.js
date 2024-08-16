import { FindOne } from '../database/queries'
import db from '../database/models'

export default class UserServices {
    static async getUser(id){
        const include = [
            {
                model: db.Profile,
                as: 'user'
            }
        ]
        const response = await FindOne('User', { id }, include)
        return response
    }
}
