export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('CarMeta', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      carId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      gps: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      radio: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      AC: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      CDPlayer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      bluetooth: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      foldingSideMirror: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      backCamera: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      navigator: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      seats: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      doors: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      engineSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mileage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      exteriorColor: {
        type: Sequelize.ENUM(
          'White',
          'Black',
          'Gray',
          'Silver',
          'Red',
          'Blue',
          'Brown',
          'Green',
          'Beige',
          'Orange',
          'Gold',
          'Yellow',
          'Purple'
        ),
        allowNull: true,
        defaultValue: null,
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
  down: (queryInterface) => queryInterface.dropTable('CarMeta'),
};
