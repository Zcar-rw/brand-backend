export default (sequelize, DataTypes) => {
  const Car = sequelize.define(
    'Car',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Plate number already exists!',
        },
      },
      supplierId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Suppliers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
      },
      modelId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CarModels',
          key: 'id',
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      baseAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mileage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Current mileage in kilometers',
      },
      status: {
        type: DataTypes.ENUM(['active', 'inactive']),
        allowNull: false,
        defaultValue: 'active',
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Users',
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

  
  Car.associate = (models) => {
    Car.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    Car.belongsTo(models.Supplier, {
      foreignKey: 'supplierId',
      as: 'supplier',
    });
    Car.belongsTo(models.CarModel, {
      foreignKey: 'modelId',
      as: 'carModel',
    });
  };
  Car.refreshAttributes();
  return Car;
};
