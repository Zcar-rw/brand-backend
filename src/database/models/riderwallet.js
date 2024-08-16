import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const RiderWallet = sequelize.define('RiderWallet', {
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
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {});
  RiderWallet.associate = (models)=> {
    RiderWallet.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'rider',
      onDelete: 'CASCADE'
    });
    RiderWallet.hasMany(models.MTNTemporaryTx, {
      foreignKey: 'riderWalletId', 
      as: 'temporary',
      onDelete: 'CASCADE'
    });
    RiderWallet.hasMany(models.Transactions, {
      foreignKey: 'riderWalletId', 
      as: 'riderTransactions',
      onDelete: 'Null'
    });
    RiderWallet.hasMany(models.TransitWallet, {
      foreignKey: 'riderWalletId', 
      as: 'riderTransitWallet',
      onDelete: 'CASCADE'
    });
  };
  return RiderWallet;
};
