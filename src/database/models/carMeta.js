import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const CarMeta = sequelize.define(
    'CarMeta',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id',
        },
      },
      gps: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      radio: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      AC: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      CDPlayer: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      bluetooth: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      foldingSideMirror: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      backCamera: { 
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      navigator: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      seats: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      doors: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      engineSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mileage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      exteriorColor: {
        type: DataTypes.ENUM(
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
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  CarMeta.associate = (models) => {
    CarMeta.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'car',
    });
  };
  return CarMeta;
};
