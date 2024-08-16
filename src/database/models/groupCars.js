import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const GroupCar = sequelize.define(
    'GroupCar',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
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
  GroupCar.associate = (models) => {
    GroupCar.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    GroupCar.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
    });
    GroupCar.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    });
  };
  return GroupCar;
};
