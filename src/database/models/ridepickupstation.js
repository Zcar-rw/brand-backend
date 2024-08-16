import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const RidePickupStation = sequelize.define('RidePickupStation', {
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
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Rides',
        key: 'id'
      }
    },
    stationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Stations',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('starting', 'pickIn'),
      defaultValue: 'pickIn'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {});
  RidePickupStation.associate = (models)=> {
    RidePickupStation.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'user',
      onDelete: 'CASCADE'
    });
    RidePickupStation.belongsTo(models.Station, {
      foreignKey: 'stationId', 
      as: 'station',
      onDelete: 'CASCADE'
    });
    RidePickupStation.belongsTo(models.Ride, {
      foreignKey: 'rideId',
      as: 'ridePickup',
      onDelete: 'CASCADE'
    });
    RidePickupStation.hasMany(models.UserRide, {
      foreignKey: 'pickupId',
      as: 'userRideStations',
      onDelete: 'CASCADE'
    });
  };
  return RidePickupStation;
};
