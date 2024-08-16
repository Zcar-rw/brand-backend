import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Insurance = sequelize.define(
    'Insurance',
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
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
      },
      insurer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      insuranceExpireDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      insuranceFile: {
        type: DataTypes.STRING,
        allowNull: true,
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
    {
      freezeTableName: true,
    }
  );
  Insurance.associate = (models) => {
    Insurance.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Insurance.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    });
  };
  return Insurance;
};
