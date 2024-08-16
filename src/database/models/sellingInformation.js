import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const SellingInformation = sequelize.define(
    'SellingInformation',
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
  SellingInformation.associate = (models) => {};
  return SellingInformation;
};
