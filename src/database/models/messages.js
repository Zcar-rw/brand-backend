import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      email: {
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
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'receiver',
    });
  };
  return Message;
};
