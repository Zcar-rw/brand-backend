import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Bank = sequelize.define(
    'Bank',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      IBAN: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
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
  Bank.associate = (models) => {};
  return Bank;
};
