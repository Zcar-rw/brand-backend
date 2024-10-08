export default (sequelize, DataTypes) => {
  const CarModel = sequelize.define(
    'CarModel',
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
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      typeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      carMakeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CarMakes',
          key: 'id',
        },
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: DataTypes.ENUM(['active', 'inactive']),
        allowNull: false,
        defaultValue: 'active',
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
  CarModel.associate = (models) => {
    CarModel.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    CarModel.belongsTo(models.CarType, {
      foreignKey: 'typeId',
      as: 'carType',
    });
    CarModel.belongsTo(models.CarMake, {
      foreignKey: 'carMakeId',
      as: 'carMake',
    });
  };
  CarModel.refreshAttributes();
  return CarModel;
};
