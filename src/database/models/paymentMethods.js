import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define(
    'PaymentMethod',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        type: DataTypes.ENUM('momo', 'card', 'other'),
        allowNull: true,
        defaultValue: null,
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
  PaymentMethod.associate = (models) => {};
  return PaymentMethod;
};
