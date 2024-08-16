'use strict';
import { v4 as uuidv4 } from 'uuid'
import db from '../models';

function createCarInsurance(userId, cars) {
  const carInsurances = [
    {
      id: uuidv4(),
      userId,
      carId: cars[0].id,
      insurer: 'Sanlam',
      insuranceExpireDate: '2023',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      userId,
      carId: cars[1].id,
      insurer: 'Britam',
      insuranceExpireDate: '2024',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  return carInsurances
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

        const cars = await db['Car'].findAll({ limit: 2, raw: true });

        await queryInterface.bulkInsert(
          'Insurance',
          createCarInsurance(user.id, cars),
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
    return queryInterface.bulkDelete('Insurance', null, {});
  }
};
