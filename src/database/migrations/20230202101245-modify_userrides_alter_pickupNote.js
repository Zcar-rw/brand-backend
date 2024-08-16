'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'UserRides', // table name
        'pickupNote', // field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.changeColumn(
        'UserRides', // table name
        'pickupNote', // field name
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      ),
    ]);
  },
};
