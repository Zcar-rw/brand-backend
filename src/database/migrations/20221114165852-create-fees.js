'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Fees', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      VAT: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 18
      },
      LOCAR_PROFIT_MARGIN: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 13
      },
      WITHHOLDING_TAX: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 15
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Fees');
  }
};