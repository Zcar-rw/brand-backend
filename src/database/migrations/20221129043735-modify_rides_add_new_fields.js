'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Rides', // table name
        'isCompleted', // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Rides', 'isCompleted'),
    ]);
  },
};
