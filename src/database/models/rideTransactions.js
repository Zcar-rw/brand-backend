import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const RideTransaction = sequelize.define('RideTransaction', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    creditedWalletId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Wallets',
        key: 'id',
      },
    },
    debitedWalletId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Wallets',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.ENUM('RWF', 'USD'),
      allowNull: false,
      defaultValue: 'RWF',
    },
    channel: {
      type: DataTypes.ENUM('Momo', 'Card', 'Paypal', 'Other'),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('debited', 'credited'),
      allowNull: false,
    },
    transactionCode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  RideTransaction.associate = (models) => {
    RideTransaction.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    RideTransaction.belongsTo(models.Wallet, {
      foreignKey: 'walletId',
      onDelete: 'CASCADE',
    });
  };
  return RideTransaction;
};
