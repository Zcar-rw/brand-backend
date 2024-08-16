'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Transactions',
        'kpaymentReferenceId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Transactions',
        'oltranzpaymentReferenceId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Transactions',
        'aggregator',
        {
          type: Sequelize.ENUM('KPAY', 'OLTRANZ'),
          allowNull: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn(
        'Transactions',
        'kpaymentReferenceId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.removeColumn(
        'Transactions',
        'oltranzpaymentReferenceId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.removeColumn(
        'Transactions',
        'aggregator',
        {
          type: Sequelize.ENUM('KPAY', 'OLTRANZ'),
          allowNull: true,
        },
      ),
    ]);
  },
};
