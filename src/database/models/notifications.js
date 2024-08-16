import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM(
          'account',
          'car',
          'booking',
          'group',
          'payment',
          'address',
          'inquiry',
          'invite',
          'ride',
          'subscribe',
          'misc'
        ),
        defaultValue: 'misc'
      },
      accountType: {
        type: DataTypes.ENUM(
          'driver',
          'passenger',
        ),
        defaultValue: 'passenger'
      },
      isForUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      itemId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      rideId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'receiver',
    });
  };
  return Notification;
};
