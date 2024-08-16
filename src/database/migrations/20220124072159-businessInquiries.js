export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('BusinessInquiry', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      carTypeId: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endDate: {
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
  down: (queryInterface) => queryInterface.dropTable('BusinessInquiry'),
};
