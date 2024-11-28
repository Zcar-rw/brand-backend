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
      bookingDetailId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'BookingDetail',
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
      status: {
        type: DataTypes.ENUM('created', 'started', 'stopped', 'completed'),
        defaultValue: 'created',
        allowNull: false,
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
      // amount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // initialAmount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      // promoId: {
      //   type: DataTypes.UUID,
      //   allowNull: true,
      //   references: {
      //     model: 'Promos',
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'SET NULL',
      // },
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
    Schedule.belongsTo(models.BookingDetail, {
      foreignKey: 'bookingDetailId',
      as: 'bookingDetail',
    });
    Schedule.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    });
    Schedule.belongsTo(models.User, {
      foreignKey: 'driverId',
      as: 'driver',
    });
  };
  return Schedule;
};
