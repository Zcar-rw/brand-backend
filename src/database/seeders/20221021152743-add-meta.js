'use strict';
import { v4 as uuidv4 } from 'uuid'
import db from '../models';

function createCarMeta(cars) {
  const carMeta = [
    {
      id: uuidv4(),
      carId: cars[0].id,
      exteriorColor: 'Black',
      year: 2012,
      seats: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      carId: cars[1].id,
      exteriorColor: 'Red',
      year: 2009,
      seats: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  return carMeta
}

module.exports = {
  up: (queryInterface) => {
    return new Promise(async (resolve, reject) => {
      try {
        await queryInterface.sequelize.transaction(async (transaction) => {
          const cars = await db['Car'].findAll({ limit: 2, raw: true, transaction });
          await queryInterface.bulkInsert('CarMeta', createCarMeta(cars), { transaction });
        });

        // Resolve the promise when the migration is complete
        resolve();
      } catch (error) {
        // Reject the promise if an error occurs
        reject(error);
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('CarMeta', null, {});
  }
};
