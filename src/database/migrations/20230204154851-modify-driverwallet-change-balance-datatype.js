'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('DriverWallets', 'balance', {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('DriverWallets', 'balance', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  }
};
