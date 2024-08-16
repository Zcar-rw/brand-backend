import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const RideDropoffStation = sequelize.define('RideDropoffStation', {
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
        key: 'id'
      }
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
    dropoffNote: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  RideDropoffStation.associate = (models)=> {
    RideDropoffStation.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'user',
      onDelete: 'CASCADE'
    });
    RideDropoffStation.belongsTo(models.Station, {
      foreignKey: 'stationId', 
      as: 'station',
      onDelete: 'CASCADE'
    });
    RideDropoffStation.belongsTo(models.Ride, {
      foreignKey: 'rideId', 
      as: 'rideDropoff',
      onDelete: 'CASCADE'
    });
  };
  return RideDropoffStation;
};
