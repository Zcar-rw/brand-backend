export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Rides', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    carId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Cars',
        key: 'id',
      },
    },
    coveringAreas: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    status: {
      type: Sequelize.ENUM('unstarted', 'active', 'cancelled', 'completed'),
      defaultValue: 'unstarted',
    },
    numberOfSeats: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Rides')
};
