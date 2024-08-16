import dotenv from 'dotenv'

dotenv.config()

export default (sequelize, DataTypes) => {
  const Inquiry = sequelize.define(
    'Inquiry',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
      },
      periodType: {
        allowNull: true,
        type: DataTypes.ENUM('Day', 'Month', 'Hour'),
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'paid', 'closed'),
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      iteration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      driverFees: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rentalFees: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      endDate: {
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
  )
  Inquiry.associate = (models) => {
    Inquiry.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    })
    Inquiry.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    })
  }
  return Inquiry
}
