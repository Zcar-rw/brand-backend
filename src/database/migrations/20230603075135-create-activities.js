export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'USER REGISTRATION',
          'CAR REGISTRATION',
          'DRIVER REGISTRATION',
          'WALLET TOPUP',
          'RIDE CREATION',
          'RIDE REQUEST',
          'ENTER CAR',
          'RIDE COMPLETED'
        ),
        allowNull: false,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM('SUCCESS', 'FAILURE'),
        allowNull: false,
        defaultValue: 'SUCCESS'
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
  down: (queryInterface) => queryInterface.dropTable('Activities'),
};
