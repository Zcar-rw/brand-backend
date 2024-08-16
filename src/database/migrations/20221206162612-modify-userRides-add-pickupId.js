const { QueryTypes } = require('sequelize');
const {v4 : uuidv4} = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('UserRides','pickupId',{
      type: Sequelize.UUID,
    }).then((data) => {
      queryInterface.sequelize
        .query(`SELECT id from "UserRides"`, {
          type: QueryTypes.SELECT
        })
        .then((rows) => {
          rows.map((row) => {
            queryInterface.sequelize.query(
              `UPDATE "UserRides" SET "pickupId"='${uuidv4()}' WHERE id='${row.id}';`,{
                type: QueryTypes.UPDATE
              }
            );
          });
          Promise.resolve();
        })
        .then(() => {
          queryInterface.changeColumn('UserRides', 'pickupId', {
            type: Sequelize.UUID,
            allowNull: false,
          });
        });
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserRides', 'pickupId');
  }
};
