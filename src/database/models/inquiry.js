const Inquiry = (sequelize, DataTypes) => {
  const Inquiry = sequelize.define(
    'Inquiry',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      typeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      endDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      message: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('company', 'client', 'unknown'),
        allowNull: true,
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
    {},
  );
  Inquiry.associate = (models) => {
    Inquiry.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
    Inquiry.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    Inquiry.belongsTo(models.CarType, {
      foreignKey: 'typeId',
      as: 'carType',
    });
  };
  return Inquiry;
};

export default Inquiry;
