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
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      customerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      service: {
        type: DataTypes.ENUM('carHire', 'airportShuttle', 'events'),
        defaultValue: 'carHire',
        allowNull: true,
      },
      comment: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'created', // company
          'pending', // Kale
          'approved', // company
          'declined', // company
          'cancelled', // company or Kale
          'completed', // Invoice sent
        ),
        defaultValue: 'created',
        allowNull: false,
      },
      totalPrice: {
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

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    Booking.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
    Booking.hasMany(models.BookingDetail, {
      foreignKey: 'bookingId',
      as: 'bookingDetails',
    });
    Booking.hasOne(models.Schedule, {
      foreignKey: 'bookingId',
      as: 'schedule',
    });
  };
  return Booking;
};
