export default (sequelize, DataTypes) => {
  const BookingDetail = sequelize.define(
    'BookingDetail',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      carType: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dropoffLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pickupTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      dropoffTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
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
    {},
  );

  BookingDetail.associate = (models) => {
    BookingDetail.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });
    BookingDetail.belongsTo(models.CarType, {
      foreignKey: 'carType',
      as: 'car',
    });
  };
  return BookingDetail;
};
