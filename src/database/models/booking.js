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
      // typeId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   references: {
      //     model: 'CarTypes',
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'SET NULL',
      // },
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
      // startDate: {
      //   allowNull: false,
      //   type: DataTypes.DATE,
      // },
      // endDate: {
      //   allowNull: false,
      //   type: DataTypes.DATE,
      // },
      // firstName: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // lastName: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // email: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // phone: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      service: {
        type: DataTypes.ENUM('carHire', 'airportShuttle', 'events'),
        defaultValue: 'carHire',
        allowNull: true,
      },
      message: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
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
  // Booking.associate = (models) => {
  //   Booking.belongsTo(models.Company, {
  //     foreignKey: 'companyId',
  //     as: 'company',
  //   });
  //   Booking.belongsTo(models.User, {
  //     foreignKey: 'createdBy',
  //     as: 'user',
  //   });
  //   Booking.belongsTo(models.CarType, {
  //     foreignKey: 'typeId',
  //     as: 'carType',
  //   });
  // };
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    Booking.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
  };
  return Booking;
};

