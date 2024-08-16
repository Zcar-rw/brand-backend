export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('SellingInformation', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      carId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      currency: {
        type: Sequelize.ENUM('RWF', 'USD'),
        allowNull: false,
        defaultValue: 'RWF',
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
  down: (queryInterface) => queryInterface.dropTable('SellingInformation'),
};
