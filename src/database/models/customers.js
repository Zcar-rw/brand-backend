import dotenv from 'dotenv';

dotenv.config();

const Customer = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Companies',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('company', 'individual', 'agent', 'other'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
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
    {},
  );
  Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Customer.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
  };
  return Customer;
};

export default Customer;
