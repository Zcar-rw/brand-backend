export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('RideRoutes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      rideId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rides',
          key: 'id',
        },
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.ENUM('RWF', 'USD'),
        allowNull: false,
        defaultValue: 'RWF',
      },
      stationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM('pickup', 'pickin', 'dropoff'),
        allowNull: false,
        defaultValue: 'pickup',
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateRide: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      timeRide: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('RideRoutes'),
}
