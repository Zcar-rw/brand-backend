'use strict'

export default (sequelize, DataTypes) => {
  const FirebaseToken = sequelize.define(
    'FirebaseToken',
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
      token: {
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

  FirebaseToken.associate = (models) => {
    FirebaseToken.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    })
  }

  return FirebaseToken
}
