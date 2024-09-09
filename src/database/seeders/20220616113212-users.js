import { v4 as uuidv4 } from 'uuid';
import * as helper from './../../helpers';
import { FindOne } from './../queries';

import dotenv from 'dotenv';
dotenv.config();

const admin = FindOne('Role', { name: 'admin' });

const stations = [
  {
    id: uuidv4(),
    email: process.env.ADMIN_EMAIL,
    password: helper.password.hash(process.env.ADMIN_PASSWORD),
    firstName: 'Admin',
    lastName: 'Admin',
    phoneNumber: "0788000000",
    companyId: null,
    roleId: admin.id,
    status: 'active',
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', stations, {}),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
