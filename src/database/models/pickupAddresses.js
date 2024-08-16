import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const PickupAddress = sequelize.define(
    'PickupAddress',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      addressId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Addresses',
          key: 'id',
        },
      },
      bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id',
        },
      },
      driverId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      pickupDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pickupTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  PickupAddress.associate = (models) => {
    PickupAddress.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    PickupAddress.belongsTo(models.Address, {
      foreignKey: 'addressId',
      as: 'address',
    });
    PickupAddress.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });
    PickupAddress.belongsTo(models.Profile, {
      foreignKey: 'driverId',
      as: 'driver',
    });
  };
  return PickupAddress;
};
