import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const CarType = sequelize.define(
    'CarType',
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
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      photo: {
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
    {}
  );
  CarType.associate = (models) => {
    CarType.hasMany(models.CarModel, {
      foreignKey: 'typeId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    CarType.hasMany(models.PriceList, {
      foreignKey: 'carTypeId',
      as: 'priceLists',
    });

  };
  return CarType;
};
