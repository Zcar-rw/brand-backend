import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const GroupTerm = sequelize.define(
    'GroupTerm',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      term: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Groups',
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
  GroupTerm.associate = (models) => {
    GroupTerm.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
    });
  };
  return GroupTerm;
};
