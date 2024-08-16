export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      callingCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      intlPhoneNumber: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNumberVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      selfie: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      drivingLicenseNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      drivingLicenseExpireDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      drivingLicensePhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      IDPhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      driver: {
        type: Sequelize.ENUM('uninterested', 'requested', 'approved','declined'),
        allowNull: true,
        defaultValue: 'uninterested'
      },
      vendor: {
        type: Sequelize.ENUM('uninterested', 'requested', 'approved','declined'),
        allowNull: true,
        defaultValue: 'uninterested'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('Profiles'),
};
