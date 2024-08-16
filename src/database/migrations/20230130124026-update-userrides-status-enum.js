'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const enumValues = await queryInterface.sequelize.query(
      `SELECT unnest(enum_range(NULL::"enum_UserRides_status"))`
    );
    
    const values = enumValues[0].map((value) => value.unnest);
    if (!values.includes('accepted')) {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_UserRides_status" ADD VALUE 'accepted'`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const enumValues = await queryInterface.sequelize.query(
      `SELECT unnest(enum_range(NULL::"enum_UserRides_status"))`
    );
  
    const values = enumValues[0].map((value) => value.unnest);
    if (values.includes('accepted')) {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_UserRides_status" DROP VALUE 'accepted'`
        // `ALTER TYPE "enum_UserRides_status" RENAME VALUE 'accepted' TO ''`

      );
    }
  },
};
