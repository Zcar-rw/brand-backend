export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('RideTransactions', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    creditedWalletId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Wallets',
        key: 'id',
      },
    },
    debitedWalletId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Wallets',
        key: 'id',
      },
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: Sequelize.ENUM('RWF', 'USD'),
      allowNull: false,
      defaultValue: 'RWF',
    },
    channel: {
      type: Sequelize.ENUM('Momo', 'Card', 'Paypal', 'Other'),
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('debited', 'credited'),
      allowNull: false,
    },
    transactionCode: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    note: {
      type: Sequelize.STRING,
      allowNull: false,
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
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),
  down: queryInterface => queryInterface.dropTable('RideTransactions'),
};
