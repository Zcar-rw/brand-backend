export default (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    'Schedule',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      driverId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      priceListId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'PriceLists',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'started',
          'cancelled',
          'completed',
          'overdue',
        ),
        defaultValue: 'pending',
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      initialAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      promoId: {
        type: DataTypes.UUID,
        allowNull: true,
        // references: {
        //   model: 'Promos',
        //   key: 'id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
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

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    Schedule.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
    Schedule.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });
    Schedule.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    });
    Schedule.belongsTo(models.User, {
      foreignKey: 'driverId',
      as: 'driver',
    });
    Schedule.belongsTo(models.PriceList, {
      foreignKey: 'priceListId',
      as: 'priceList',
    });
  };
  return Schedule;
};
