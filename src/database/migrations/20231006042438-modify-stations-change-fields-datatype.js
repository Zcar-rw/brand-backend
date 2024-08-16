'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'Stations',
        'longitude',
        {
          type: Sequelize.DECIMAL(10, 8),
          allowNull: true,
        },
      ),
      queryInterface.changeColumn(
        'Stations',
        'latitude',
        {
          type: Sequelize.DECIMAL(10, 8),
          allowNull: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.changeColumn(
        'Stations',
        'longitude',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.changeColumn(
        'Stations',
        'latitude',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
    ]);
  },
};
