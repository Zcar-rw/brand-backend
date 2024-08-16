import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email address is already in use!',
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      role: {
        type: DataTypes.ENUM('admin', 'super', 'normal'),
        allowNull: false,
        defaultValue: 'normal',
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  );
  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: 'user'
    });
    User.hasMany(models.Car, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Ride, {
      foreignKey: 'userId', 
      as: 'ride',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.RideDropoffStation, {
      foreignKey: 'userId', 
      as: 'userdropoffstation',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.RidePickupStation, {
      foreignKey: 'userId', 
      as: 'userpickupstation',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Transactions, {
      foreignKey: 'userId', 
      as: 'usertransactions',
      onDelete: 'CASCADE'
    });
    User.hasOne(models.RiderWallet, {
      foreignKey: 'userId', 
      as: 'riderwallet',
      onDelete: 'CASCADE'
    });
    User.hasOne(models.DriverWallet, {
      foreignKey: 'userId', 
      as: 'driverwallet',
      onDelete: 'CASCADE'
    });  
    User.hasMany(models.UserRide, {
      foreignKey: 'userId',
      as: 'userride',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.TransitWallet, {
      foreignKey: 'userId', 
      as: 'transitwallet',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Activity, {
      foreignKey: 'userId', 
      as: 'activities',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return User;
};
