import dotenv from 'dotenv';
import * as helper from './../../helpers';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerId: {
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
      groupCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'rejected', 'approved', 'deactivated'),
        allowNull: false,
        defaultValue: 'pending',
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
  Group.beforeCreate(async (data, options) => {
    data.bookingCode = await helper.generator.code('GROUP');
  });
  Group.associate = (models) => {
    Group.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
    Group.belongsTo(models.Address, {
      foreignKey: 'addressId',
      as: 'address',
    });
  };
  return Group;
};
