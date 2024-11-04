import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'Company',
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
      ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TIN: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      invoiceValidity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commissionType: {
        type: DataTypes.ENUM('flat', 'percentage'),
        allowNull: true,
      },
      commissionFlat: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commissionPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      theme: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    {},
  );
  Company.associate = (models) => {
    Company.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
  };
  return Company;
};