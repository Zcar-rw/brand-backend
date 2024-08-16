import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const RentingInformation = sequelize.define(
    'RentingInformation',
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
      pricePerHour: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pricePerDay: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pricePerMonth: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      selfDrive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      currency: {
        type: DataTypes.ENUM('RWF', 'USD'),
        allowNull: false,
        defaultValue: 'RWF',
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
  RentingInformation.associate = (models) => {
    RentingInformation.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car'
    });
  };
  return RentingInformation;
};
