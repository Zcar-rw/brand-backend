import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const DriverWallet = sequelize.define('DriverWallet', {
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
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {});
  DriverWallet.associate = (models)=> {
    DriverWallet.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'driver',
      onDelete: 'CASCADE'
    });
    DriverWallet.hasMany(models.Transactions, {
      foreignKey: 'driverWalletId', 
      as: 'driverTransactions',
      onDelete: 'CASCADE'
    });
    DriverWallet.hasMany(models.TransitWallet, {
      foreignKey: 'driverWalletId', 
      as: 'driverTransitWallet',
      onDelete: 'CASCADE'
    });
  };
  return DriverWallet;
};
