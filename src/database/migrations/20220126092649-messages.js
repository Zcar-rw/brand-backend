export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiverId: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('Messages'),
};
