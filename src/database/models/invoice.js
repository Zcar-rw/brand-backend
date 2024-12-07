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
      status: {
        type: DataTypes.ENUM('created', 'paid', 'partially-paid', 'cancelled'),
        defaultValue: 'created',
        allowNull: false,
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
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      year: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      month: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      increment: {
        type: DataTypes.DECIMAL,
        allowNull: true,
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
    Invoice.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByUser',
    });
  };
  return Invoice;
};
