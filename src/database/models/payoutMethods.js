import dotenv from 'dotenv'

dotenv.config()

export default (sequelize, DataTypes) => {
  const PayoutMethod = sequelize.define(
    'PayoutMethod',
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
      bankId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Banks',
          key: 'id',
        },
      },
      default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: {
        type: DataTypes.ENUM('RWF', 'USD'),
        allowNull: false,
        defaultValue: 'RWF',
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
  )
  PayoutMethod.associate = (models) => {
    PayoutMethod.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    })
    PayoutMethod.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      as: 'bank',
    })
  }
  return PayoutMethod
}
