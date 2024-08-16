export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('UserRides', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      rideId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rides',
          key: 'id',
        },
      },
      carId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
      },
      pickupNote: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'rejected', 'joined', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      joinedTime: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      completedTime: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      cancelledTime: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      rejectedTime: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('UserRides'),
}
