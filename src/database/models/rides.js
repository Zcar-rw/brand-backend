import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Ride = sequelize.define('Ride', {
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
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ['unstarted', 'active', 'cancelled', 'completed'],
      defaultValue: 'unstarted',
    },
    numberOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coveringAreas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rideCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfRide: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shareId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {});
  Ride.associate = (models) => {
    Ride.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car'
    });
    Ride.hasMany(models.RideRoute, {
      foreignKey: 'rideId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Ride.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'user',
      onDelete: 'CASCADE'
    });
    Ride.hasOne(models.RideDropoffStation, {
      foreignKey: 'rideId', 
      as: 'rideDropoff',
      onDelete: 'CASCADE'
    });
    Ride.hasMany(models.RidePickupStation, {
      foreignKey: 'rideId', 
      as: 'ridePickup',
      onDelete: 'CASCADE'
    });
    Ride.hasMany(models.Transactions, {
      foreignKey: 'rideId', 
      as: 'rideTransaction',
    });
    Ride.hasMany(models.UserRide, {
      foreignKey: 'rideId', 
      as: 'riders',
      onDelete: 'CASCADE'
    });
  };
  return Ride;
};
