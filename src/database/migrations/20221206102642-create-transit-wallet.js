'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TransitWallets', {
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
        allowNull: true,
        references: {
          model: 'Rides',
          key: 'id'
        }
      },
      riderWalletId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'RiderWallets',
          key: 'id'
        }
      },
      driverWalletId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'DriverWallets',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM('transit', 'refund', 'pay'),
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM('credited', 'debited'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('TransitWallets');
  }
};
