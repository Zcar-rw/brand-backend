import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
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
        key: 'id'
      }
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Rides',
        key: 'id'
      }
    },
    riderWalletId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'RiderWallets',
        key: 'id'
      }
    },
    driverWalletId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'DriverWallets',
        key: 'id'
      }
    },
    transitWalletId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'TransitWallets',
        key: 'id'
      }
    },
    tax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('topup', 'cashout', 'ride'),
      allowNull: false,
      defaultValue: 'ride'
    },
    transactionCode: {
      type: DataTypes.STRING,
      allowNull:  false,
      unique: true
    },
    LOCAR_NET_INCOME: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kpaymentReferenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oltranzpaymentReferenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aggregator: {
      type: DataTypes.ENUM('KPAY', 'OLTRANZ'),
      allowNull: true,
    },
  }, {});
  Transactions.associate = (models)=> {
    Transactions.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'user',
      onDelete: 'CASCADE'
    });
    Transactions.belongsTo(models.Ride, {
      foreignKey: 'rideId', 
      as: 'ride',
      onDelete: 'CASCADE'
    });
    Transactions.belongsTo(models.RiderWallet, {
      foreignKey: 'riderWalletId', 
      as: 'riderwallet',
      onDelete: 'CASCADE'
    });
    Transactions.belongsTo(models.DriverWallet, {
      foreignKey: 'driverWalletId', 
      as: 'driverwallet',
      onDelete: 'CASCADE'
    });
    Transactions.belongsTo(models.TransitWallet, {
      foreignKey: 'transitWalletId', 
      as: 'transitwallet',
      onDelete: 'CASCADE'
    });
  };
  return Transactions;
};
