import { v4 as uuidv4 } from 'uuid';
const roles = [
  // INTERNAL ROLES
  {
    id: uuidv4(),
    name: 'admin',
    label: 'Admin',
    type: 'internal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'driver',
    label: 'Driver',
    type: 'internal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'operation',
    label: 'Operation',
    type: 'internal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // COMPANIES ROLES
  {
    id: uuidv4(),
    name: 'company-owner',
    label: 'Company owner',
    type: 'company',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'company-user',
    label: 'Company user',
    type: 'company',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // CLIENTS
  {
    id: uuidv4(),
    name: 'client',
    label: 'Client',
    type: 'client',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', roles, {}),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {}),
};
