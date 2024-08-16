'use strict';
import { v4 as uuidv4 } from 'uuid'
import db from '../models';

function createCars(userId, carMakeId, typeId, profileId) {  
  const cars = [
    {
      id: uuidv4(),
      name: 'Honda',
      slug: 'Honda',
      plateNumber: 'RAA478F',
      fuelType: 'gasoline',
      transmission: 'manual',
      userId,
      ownerId: profileId,
      typeId,
      carMakeId,
      driveType: '2WD',
      VIN: '4Y1SL65848Z411439',
      status: 'Available',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      name: 'Toyota',
      slug: 'Toyota',
      plateNumber: 'RAA897F',
      fuelType: 'electric',
      transmission: 'automatic',
      userId,
      ownerId: profileId,
      typeId,
      carMakeId,
      driveType: '4WD',
      VIN: '4Y1SL65848Z411440',
      status: 'Busy',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]

  return cars;
}

module.exports = {
  up: async (queryInterface) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db['User'].findOne({
          where: {
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
            status: 'active',
            verified: true,
          },
          raw: true,
        });

        if (!user) {
          throw new Error(`Cannot find admin user with email ${process.env.ADMIN_EMAIL}`);
        }

        const profile = await db['Profile'].findOne({
          where: {
            userId: user.id,
          },
          raw: true,
        });

        if (!profile) {
          throw new Error(`Cannot find profile for user with id ${user.id}`);
        }

        const carTypes = await db['CarType'].findAll({ limit: 1, raw: true });
        const carMakes = await db['CarMake'].findAll({ limit: 1, raw: true });

        await queryInterface.bulkInsert(
          'Cars',
          createCars(user.id, carMakes[0].id, carTypes[0].id, profile.id),
          {}
        );

        // Resolve the promise when the migration is complete
        resolve();
      } catch (error) {
        // Reject the promise if an error occurs
        reject(error);
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Cars', null, {});
  },
};
