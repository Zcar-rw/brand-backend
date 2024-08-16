export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('ContactUs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAtLeast10Characters(value) {
            if (value.length < 10) {
              throw new Error('Message must be at least 10 characters long');
            }
          },
        },
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('general', 'bug', 'rides', 'payments', 'others'),
        defaultValue: 'general'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface) => queryInterface.dropTable('ContactUs'),
};
