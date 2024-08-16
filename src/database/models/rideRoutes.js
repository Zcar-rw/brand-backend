import dotenv from 'dotenv'

dotenv.config()

export default (sequelize, DataTypes) => {
  const RideRoute = sequelize.define('RideRoute', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Rides',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.ENUM('RWF', 'USD'),
      allowNull: false,
      defaultValue: 'RWF',
    },
    stationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Stations',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('pickup', 'pickin', 'dropoff'),
      allowNull: false,
      defaultValue: 'pickup',
    },
    timeRide: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    dateRide: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  })
  RideRoute.associate = (models) => {
    RideRoute.belongsTo(models.Ride, {
      foreignKey: 'rideId',
      as: 'ride',
    })
    RideRoute.belongsTo(models.Station, {
      foreignKey: 'stationId',
      as: 'station',
    })
  }
  return RideRoute
}
