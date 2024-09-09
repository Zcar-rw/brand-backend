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
          'payment',
          'inquiry',
          'invite',
          'subscribe',
          'misc',
        ),
        defaultValue: 'misc',
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
    {},
  );
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'receiver',
    });
  };
  return Notification;
};
