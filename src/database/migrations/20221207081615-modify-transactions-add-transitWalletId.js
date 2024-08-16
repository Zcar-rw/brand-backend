'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Transactions', // table name
        'transitWalletId', // new field name
        {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'TransitWallets',
            key: 'id'
          }
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Transactions', 'transitWalletId'),
    ]);
  },
};
