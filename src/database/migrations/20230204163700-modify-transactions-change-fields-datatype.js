'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'Transactions',
        'tax',
        {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
      ),
      queryInterface.changeColumn(
        'Transactions',
        'LOCAR_NET_INCOME',
        {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.changeColumn(
        'Transactions',
        'tax',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      ),
      queryInterface.changeColumn(
        'Transactions',
        'LOCAR_NET_INCOME',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      ),
    ]);
  },
};
