import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Galleries = sequelize.define(
    'Galleries',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('front', 'back', 'side', 'interior'),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  );
  Galleries.associate = (models) => {
    Galleries.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car'
    });
  };
  return Galleries;
};