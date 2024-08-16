export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PickupAddresses', {
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
    addressId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Addresses',
        key: 'id',
      },
    },
    bookingId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Bookings',
        key: 'id',
      },
    },
    driverId: {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'Profiles',
        key: 'id',
      },
    },
    pickupDate: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pickupTime: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('PickupAddresses')
};
