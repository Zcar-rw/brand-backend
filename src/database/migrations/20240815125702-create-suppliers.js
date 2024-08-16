export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Suppliers', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    tin: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    createdBy: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Profiles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
  down: queryInterface => queryInterface.dropTable('Suppliers')
};
