export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('BusinessInvoices', {
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
      },
      carId: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      inquiryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Inquiries',
          key: 'id',
        },
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      TIN: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      province: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      district: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      house: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      streetNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'declined', 'paid'),
        allowNull: false,
        defaultValue: 'pending'
      },
      paymentReferenceNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      paymentReferenceFile: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      invoiceCode: {
        type: Sequelize.STRING,
        allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('BusinessInvoices'),
};
