
import * as helper from './../../helpers';
import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const BusinessInvoice = sequelize.define(
    'BusinessInvoice',
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
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      inquiryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Inquiries',
          key: 'id',
        },
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TIN: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      house: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      streetNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'declined', 'paid'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentReferenceNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentReferenceFile: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      invoiceCode: {
        type: DataTypes.STRING,
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
  BusinessInvoice.beforeCreate(async (data, options) => {
    data.invoiceCode = await helper.generator.code('BUSINESS');
  });
  BusinessInvoice.associate = (models) => {
    BusinessInvoice.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    BusinessInvoice.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    });
    BusinessInvoice.belongsTo(models.Inquiry, {
      foreignKey: 'inquiryId',
      as: 'inquiry',
    });
  };
  return BusinessInvoice;
};
