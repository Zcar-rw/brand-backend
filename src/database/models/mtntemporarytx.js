import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const MTNTemporaryTx = sequelize.define('MTNTemporaryTx', {
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
    riderWalletId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'RiderWallets',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'timedout', 'paid'),
      allowNull: false,
      defaultValue: 'pending'
    },
    kpaymentReferenceId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  MTNTemporaryTx.associate = (models)=> {
    MTNTemporaryTx.belongsTo(models.RiderWallet, {
      foreignKey: 'riderWalletId', 
      as: 'temporary',
      onDelete: 'CASCADE'
    });
  };
  return MTNTemporaryTx;
};
