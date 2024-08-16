export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiverId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM(
          'account',
          'car',
          'booking',
          'group',
          'payment',
          'address',
          'inquiry',
          'invite',
          'ride',
          'subscribe',
          'misc'
        ),
        allowNull: false,
        defaultValue: null,
      },
      isForUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      itemId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      rideId: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      },
      accountType: {
        type: Sequelize.ENUM('driver', 'passenger'),
        allowNull: true,
        defaultValue: 'passenger',
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  down: (queryInterface) => queryInterface.dropTable('Notifications'),
}
