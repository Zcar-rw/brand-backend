'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_Activities_type" ADD VALUE 'DRIVER PAYOUT'`
    )
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_Activities_type" ADD VALUE 'USER LOGIN'`
    )
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_Activities_type" ADD VALUE 'PASSWORD RESET'`
    )
  },

  down: async (queryInterface, Sequelize) => {},
}
