'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Rides',
        'dateOfRide',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn(
        'Rides', 
        'dateOfRide',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        ),
    ]);
  },
};
