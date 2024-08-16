import dotenv from 'dotenv'

dotenv.config()

export default (sequelize, DataTypes) => {
  const UserRide = sequelize.define('UserRide', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
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
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Rides',
        key: 'id',
      },
    },
    pickupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'RidePickupStations',
        key: 'id'
      }
  },
    pickupNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'rejected', 'joined', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    joinedTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    completedTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    cancelledTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    rejectedTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  })
  UserRide.associate = (models) => {
    UserRide.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
    UserRide.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
      onDelete: 'CASCADE',
    })
    UserRide.belongsTo(models.Ride, {
      foreignKey: 'rideId',
      as: 'rides',
      onDelete: 'CASCADE'
    });
    UserRide.belongsTo(models.RidePickupStation, {
      foreignKey: 'pickupId',
      as: 'pickUp',
      onDelete: 'CASCADE'
    });
  }
  return UserRide
}
