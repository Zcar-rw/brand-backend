export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Groups', {
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
      summary: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      groupCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'rejected', 'approved', 'deactivated'),
        allowNull: false,
        defaultValue: 'pending'
      },
      addressId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Addresses',
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
  down: (queryInterface) => queryInterface.dropTable('Groups'),
};
