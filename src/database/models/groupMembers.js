import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const GroupMember = sequelize.define(
    'GroupMember',
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
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
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
  GroupMember.associate = (models) => {
    GroupMember.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    GroupMember.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
    });
  };
  return GroupMember;
};
