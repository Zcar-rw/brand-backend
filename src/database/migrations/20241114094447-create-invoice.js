'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      status: {
        type: Sequelize.ENUM('created', 'paid', 'partially-paid', 'cancelled'),
        defaultValue: 'created',
        allowNull: false,
      },
      bookingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      year: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      month: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      increment: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),

  down: async (queryInterface) => await queryInterface.dropTable('Invoices'),
};
