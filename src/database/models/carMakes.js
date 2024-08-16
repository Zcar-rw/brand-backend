import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const CarMake = sequelize.define(
    'CarMake',
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
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      popular: {
        type: DataTypes.BOOLEAN,
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
  CarMake.associate = (models) => {
    CarMake.hasMany(models.Car, {
      foreignKey: 'carMakeId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };
  return CarMake;
};
