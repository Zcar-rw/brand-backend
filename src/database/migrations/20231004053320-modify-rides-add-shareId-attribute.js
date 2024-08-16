'use strict';
const { generateRideShareId } = require('../../helpers/generator/rideShare');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      try {
        await queryInterface.addColumn('Rides', 'shareId', {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        });

        const ridesWithNullShareId = await queryInterface.sequelize.query(
          'SELECT * FROM "Rides" WHERE "shareId" IS NULL',
          { type: Sequelize.QueryTypes.SELECT }
        );
        // Generate and update 'shareId' for existing records with null 'shareId'
        const updatePromises = ridesWithNullShareId.map(async (ride) => {
          const shareId = generateRideShareId();
          await queryInterface.sequelize.query(
            `UPDATE "Rides" SET "shareId"='${shareId}' WHERE "id"='${ride.id}'`
          );
        });
        await Promise.all(updatePromises);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  down: async (queryInterface) => {
    // Remove the 'shareId' column
    await queryInterface.removeColumn('Rides', 'shareId');
  },
};
