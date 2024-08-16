'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RidePickupStations', {
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
      type: {
        type: Sequelize.ENUM('starting', 'pickIn'),
        defaultValue: 'pickIn'
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      departureTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      note: {
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
    return queryInterface.dropTable('RidePickupStations');
  }
};