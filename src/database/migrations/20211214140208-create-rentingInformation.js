export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('RentingInformation', {
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
      pricePerDay: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pricePerHour: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pricePerMonth: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      selfDrive: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
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
  down: (queryInterface) => queryInterface.dropTable('RentingInformation'),
};
