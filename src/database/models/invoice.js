export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
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
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'failed'),
        defaultValue: 'pending',
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
    {},
  );

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
    Invoice.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });
  };
  return Invoice;
};
