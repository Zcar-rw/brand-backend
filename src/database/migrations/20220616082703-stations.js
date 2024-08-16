export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Stations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      province: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sector: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      streetNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      latitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      popularity: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5'),
        allowNull: false,
        defaultValue: '1',
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
  down: (queryInterface) => queryInterface.dropTable('Stations'),
}
