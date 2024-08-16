import { v4 as uuidv4 } from 'uuid'
import db from '../models'

function addStations(userId) {
  const stations = [
    {
      id: uuidv4(),
      name: 'ku bitaro bya abachinwa',
      userId,
      province: 'Kigali',
      district: 'Kicukiro',
      sector: 'Masaka',
      streetNumber: 'Kicukiro',
      landmark: 'Kicukiro',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
  return stations
}

export default {
  up: async (queryInterface) => {
    const user = await db['User'].findOne({
      where: {
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        status: 'active',
        verified: true,
      },
      raw: true,
    })
    queryInterface.bulkInsert('Stations', addStations(user.id), {})
  },
  down: (queryInterface) => queryInterface.bulkDelete('Stations', null, {}),
}
