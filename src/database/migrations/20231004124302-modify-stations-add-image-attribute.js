'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Stations',
      'image',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
     queryInterface.removeColumn('Stations', 'image')
    ])
  }
};
