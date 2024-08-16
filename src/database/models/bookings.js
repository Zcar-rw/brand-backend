import dotenv from 'dotenv'
import * as helper from '../../helpers'

dotenv.config()

export default (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
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
      renterProfileId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      ownerProfileId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Profiles',
          key: 'id',
        },
      },
      inquiryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Inquiries',
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
      driverFees: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rentalFees: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bookingPeriodType: {
        type: DataTypes.ENUM('hour', 'day', 'week', 'month'),
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startingDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      endingDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['created', 'carDelivered', 'carReturned', 'closed'],
        allowNull: false,
      },
      bookingCode: {
        type: DataTypes.INTEGER,
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
    {}
  )
  Booking.beforeCreate(async (data, options) => {
    data.bookingCode = await helper.generator.code('BOOKING')
  })
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    })
    Booking.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    })
    Booking.belongsTo(models.Profile, {
      foreignKey: 'renterProfileId',
      as: 'renter',
    })
    Booking.belongsTo(models.Profile, {
      foreignKey: 'ownerProfileId',
      as: 'owner',
    })
    Booking.belongsTo(models.Inquiry, {
      foreignKey: 'inquiryId',
      as: 'inquiry',
    })
  }
  return Booking
}
