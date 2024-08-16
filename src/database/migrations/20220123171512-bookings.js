export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Bookings', {
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
      renterProfileId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      ownerProfileId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      inquiryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Inquiries',
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
      driverFees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rentalFees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bookingPeriodType: {
        type: Sequelize.ENUM('month', 'day', 'hour', 'week'),
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      startingDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      endingDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['created', 'carDelivered', 'carReturned', 'closed'],
        allowNull: false,
      },
      bookingCode: {
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
  down: (queryInterface) => queryInterface.dropTable('Bookings'),
}
