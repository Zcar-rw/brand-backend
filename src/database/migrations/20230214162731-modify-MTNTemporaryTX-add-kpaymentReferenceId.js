'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'MTNTemporaryTxes', 
        'kpaymentReferenceId', 
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'MTNTemporaryTxes', 
        'kpaymentReferenceId', 
        {
          type: Sequelize.STRING,
          allowNull: false
        })
    ])
    return 
  }
};
