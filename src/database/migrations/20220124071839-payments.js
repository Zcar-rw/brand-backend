export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Payments', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    payeeId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Profiles',
        key: 'id',
      },
    },
    payerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Profiles',
        key: 'id',
      },
    },
    bookingId: {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'Bookings',
        key: 'id',
      },
    },
    businessInvoiceId: {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'BusinessInvoices',
        key: 'id',
      },
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    transactionCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    transactionId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    txRef: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    flwRef: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    customer: {
      type: Sequelize.STRING,
      allowNull: true,
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
  down: queryInterface => queryInterface.dropTable('Payments')
};
