export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('GroupTerms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      term: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      groupId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
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
  down: (queryInterface) => queryInterface.dropTable('GroupTerms'),
};
