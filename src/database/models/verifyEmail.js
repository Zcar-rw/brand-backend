import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const VerifyEmail = sequelize.define(
    'VerifyEmail',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  VerifyEmail.associate = (models) => {
  };
  return VerifyEmail;
};
