'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Rides', // table name
        'rideCode', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: Date.now()
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Rides', 'rideCode'),
    ]);
  },
};
