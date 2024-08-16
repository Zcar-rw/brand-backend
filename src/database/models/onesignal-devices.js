'use strict'

export default (sequelize, DataTypes) => {
  const OneSignalDevice = sequelize.define(
    'OneSignalDevice',
    {
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
      playerId: {
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
    {
      freezeTableName: true,
    }
  )

  OneSignalDevice.associate = (models) => {
    OneSignalDevice.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    })
  }

  return OneSignalDevice
}
