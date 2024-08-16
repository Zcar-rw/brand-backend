export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Wallets', {
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
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastTransitionType: {
      type: Sequelize.ENUM('credited', 'debited'),
      allowNull: false,
    },
    lastTransitionAmount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
  down: queryInterface => queryInterface.dropTable('Wallets')
};
