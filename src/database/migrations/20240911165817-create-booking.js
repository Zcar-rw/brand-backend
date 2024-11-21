'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      service: {
        type: Sequelize.ENUM('carHire', 'airportShuttle', 'events'),
        defaultValue: 'carHire',
        allowNull: true,
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'cancelled', 'completed'),
        defaultValue: 'pending',
        allowNull: true,
      },
      reviewStatus: {
        type: Sequelize.ENUM('none', 'done', 'updated', 'denied'),
        defaultValue: 'none',
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
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

  down: async (queryInterface) => await queryInterface.dropTable('Bookings'),
};
