export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      // typeId: {
      //   type: Sequelize.UUID,
      //   allowNull: false,
      //   references: {
      //     model: 'CarTypes',
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'SET NULL',
      // },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // startDate: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
      // endDate: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
      // firstName: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // lastName: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // email: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // phone: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      service: {
        type: Sequelize.ENUM('carHire', 'airportShuttle', 'events'),
        defaultValue: 'carHire',
        allowNull: true,
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
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
  down: (queryInterface) => queryInterface.dropTable('Bookings'),
};
