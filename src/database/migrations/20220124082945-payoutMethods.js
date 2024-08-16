export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('PayoutMethods', {
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
      bankId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Banks',
          key: 'id',
        },
      },default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM('RWF', 'USD'),
        allowNull: false,
        defaultValue: 'RWF'
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
  down: (queryInterface) => queryInterface.dropTable('PayoutMethods'),
};
