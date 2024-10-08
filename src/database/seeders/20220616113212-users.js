import { v4 as uuidv4 } from 'uuid';
import * as helper from './../../helpers';
import { FindOne } from './../queries';
import dotenv from 'dotenv';

dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      const admin = await FindOne('Role', { name: 'admin' });
      if (!admin) {
        throw new Error('Admin role not found');
      }

      const users = [
        {
          id: uuidv4(),
          email: ADMIN_EMAIL,
          password: helper.password.hash(ADMIN_PASSWORD),
          firstName: 'Admin',
          lastName: 'Admin',
          phoneNumber: '+250788000000',
          roleId: admin.id,
          status: 'active',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      console.log('Seeding data:', users);
      await queryInterface.bulkInsert('Users', users, {});
      console.log('Seeding completed successfully');
    } catch (error) {
      console.error('Detailed error in users seeder:', error);
      throw error;
    }
  },
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
