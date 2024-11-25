'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.createTable('BookingDetails', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      bookingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      carType: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pickupLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dropoffLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pickupTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      dropoffTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
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

  down: async (queryInterface) =>
    await queryInterface.dropTable('BookingDetails'),
};
