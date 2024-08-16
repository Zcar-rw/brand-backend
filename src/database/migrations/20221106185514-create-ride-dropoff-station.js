'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RideDropoffStations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      rideId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rides',
          key: 'id'
        }
      },
      stationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id'
        }
      },
      dropoffNote: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RideDropoffStations');
  }
};