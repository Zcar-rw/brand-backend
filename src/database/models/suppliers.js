import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    'Supplier',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email address is already in use!',
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      tin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Profiles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
  Supplier.associate = (models) => {
    Supplier.belongsTo(models.Profile, {
      foreignKey: 'createdBy',
      as: 'supplier',
    });
  };
  return Supplier;
};
