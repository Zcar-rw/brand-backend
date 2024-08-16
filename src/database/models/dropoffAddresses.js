import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const DropoffAddress = sequelize.define(
    'DropoffAddress',
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
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Bookings',
          key: 'id',
        },
      },
      driverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      dropoffDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dropoffTime: {
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
  DropoffAddress.associate = (models) => {
    DropoffAddress.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    DropoffAddress.belongsTo(models.Address, {
      foreignKey: 'addressId',
      as: 'address',
    });
    DropoffAddress.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });
    DropoffAddress.belongsTo(models.Profile, {
      foreignKey: 'driverId',
      as: 'driver',
    });
  };
  return DropoffAddress;
};
