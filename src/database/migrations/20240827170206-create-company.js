export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      TIN: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      invoiceValidity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commissionType: {
        type: Sequelize.ENUM('flat', 'percentage'),
        allowNull: true,
      },
      commissionFlat: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      commissionPercentage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  down: queryInterface => queryInterface.dropTable('Companies')
};
