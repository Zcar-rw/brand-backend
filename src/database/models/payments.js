import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      payeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      payerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      bookingId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Bookings',
          key: 'id',
        },
      },
      businessInvoiceId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'BusinessInvoices',
          key: 'id',
        },
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      txRef: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      flwRef: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customer: {
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
  Payment.associate = (models) => {
    Payment.belongsTo(models.Profile, {
      foreignKey: 'payeeId',
      as: 'payee',
    });
    Payment.belongsTo(models.Profile, {
      foreignKey: 'payerId',
      as: 'payer',
    });
    Payment.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });
    Payment.belongsTo(models.BusinessInvoice, {
      foreignKey: 'businessInvoiceId',
      as: 'invoice',
    });
  };
  return Payment;
};
