'use strict'
export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Inquiries', {
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
      carId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
      },
      periodType: {
        allowNull: true,
        type: Sequelize.ENUM('Day', 'Month', 'Hour'),
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM('pending', 'approved', 'paid', 'closed'),
        defaultValue: 'pending',
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      iteration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      driverFees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rentalFees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.STRING,
        allowNull: true,
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
  down: (queryInterface) => queryInterface.dropTable('Inquiries'),
}
