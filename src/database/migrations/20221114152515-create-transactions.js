'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
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
      tax: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('topup', 'cashout', 'ride'),
        allowNull: false,
        defaultValue: 'ride'
      },
      transactionCode: {
        type: Sequelize.STRING,
        allowNull:  false,
        unique: true
      },
      LOCAR_NET_INCOME: {
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
    return queryInterface.dropTable('Transactions');
  }
};