import dotenv from 'dotenv';

dotenv.config();

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
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      typeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
      },
      carMakeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CarMake',
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
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(['active', 'inactive']),
        allowNull: false,
        defaultValue: 'active',
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Profiles',
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
    Car.belongsTo(models.Profile, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    Car.belongsTo(models.Supplier, {
      foreignKey: 'supplierId',
      as: 'supplier',
    });

    Car.belongsTo(models.CarType, {
      foreignKey: 'typeId',
      as: 'carType',
    });
    Car.belongsTo(models.CarMake, {
      foreignKey: 'carMakeId',
      as: 'carMake',
    });
  };
  Car.refreshAttributes();
  return Car;
};
