
export default (sequelize, DataTypes) => {
  const TransitWallet = sequelize.define('TransitWallet', {
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
    type: {
      type: DataTypes.ENUM('transit', 'refund', 'pay'),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM('credited', 'debited'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  TransitWallet.associate = (models)=> {
    TransitWallet.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'transitwallet',
      onDelete: 'CASCADE'
    });
    TransitWallet.belongsTo(models.Ride, {
      foreignKey: 'rideId', 
      as: 'rideTransitWallet',
      onDelete: 'CASCADE'
    });
    TransitWallet.belongsTo(models.RiderWallet, {
      foreignKey: 'riderWalletId', 
      as: 'riderTransitWallet',
      onDelete: 'CASCADE'
    });
    TransitWallet.belongsTo(models.DriverWallet, {
      foreignKey: 'driverWalletId', 
      as: 'driverTransitWallet',
      onDelete: 'CASCADE'
    });

    TransitWallet.hasOne(models.Transactions, {
      foreignKey: 'transitWalletId', 
      as: 'transitTransactions',
      onDelete: 'CASCADE'
    });
  };
  return TransitWallet;
};
