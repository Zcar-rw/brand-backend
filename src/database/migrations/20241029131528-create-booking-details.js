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
        onDelete: 'SET NULL',
      },
      carType: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      suggestedCarTypes: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        defaultValue: [],
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
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
