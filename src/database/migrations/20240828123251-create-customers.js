export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Customers', {
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
    companyId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Companies',
        key: 'id',
      },
    },
    type: {
      type: Sequelize.ENUM('company', 'individual', 'agent', 'other'),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
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
  down: queryInterface => queryInterface.dropTable('Customers')
};
