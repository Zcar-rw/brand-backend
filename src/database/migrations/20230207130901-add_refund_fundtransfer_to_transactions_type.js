'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Transactions_type" ADD VALUE 'refund'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Transactions_type" ADD VALUE 'fundTransfer'`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Transactions_type" RENAME TO "enum_Transactions_type_backup"`);
    await queryInterface.sequelize.query(`CREATE TYPE "enum_Transactions_type" AS ENUM('topup', 'cashout', 'ride')`);
    await queryInterface.sequelize.query(`ALTER TABLE "Transactions" ALTER COLUMN "type" TYPE "enum_Transactions_type" USING "type"::"text"::"enum_Transactions_type"`);
    await queryInterface.sequelize.query(`DROP TYPE "enum_Transactions_type_backup"`);
  }
};
