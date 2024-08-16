import dotenv from 'dotenv'

dotenv.config()

export default (sequelize, DataTypes) => {
  const Station = sequelize.define(
    'Station',
    {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sector: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      streetNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      landmark: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      latitude: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      popularity: {
        type: DataTypes.ENUM(1, 2, 3, 4, 5),
        allowNull: false,
        defaultValue: 1,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
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
    {}
  )
  Station.associate = (models) => {
    Station.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'Station',
    })
  }
  Station.associate = (models) => {
    Station.hasOne(models.RideDropoffStation, {
      foreignKey: 'stationId',
      as: 'station',
      onDelete: 'CASCADE',
    })
  }
  Station.associate = (models) => {
    Station.hasMany(models.RidePickupStation, {
      foreignKey: 'stationId',
      as: 'station',
      onDelete: 'CASCADE',
    })
  }
  Station.associate = (models) => {
    Station.hasMany(models.MyPlace, {
      foreignKey: 'stationId',
      as: 'myplace',
    })
  }
  Station.associate = (models) => {
    Station.hasMany(models.PopularPlace, {
      foreignKey: 'stationId',
      as: 'popularplace',
      onDelete: 'CASCADE',
    })
  }
  return Station
}
