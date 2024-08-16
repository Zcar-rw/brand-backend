import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    'Profile',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      callingCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      intlPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumberVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      selfie: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      drivingLicenseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      drivingLicenseExpireDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      drivingLicensePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      IDPhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      driver: {
        type: DataTypes.ENUM('uninterested', 'requested', 'approved','declined'),
        allowNull: true,
        defaultValue: 'uninterested'
      },
      vendor: {
        type: DataTypes.ENUM('uninterested', 'requested', 'approved','declined'),
        allowNull: true,
        defaultValue: 'uninterested'
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
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'profile'
    });
  };
  return Profile;
};
