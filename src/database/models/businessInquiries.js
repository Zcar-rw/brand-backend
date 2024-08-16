import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const BusinessInquiry = sequelize.define(
    'BusinessInquiry',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      carTypeId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'CarTypes',
          key: 'id',
        },
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.STRING,
        allowNull: false,
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
  BusinessInquiry.associate = (models) => {
    BusinessInquiry.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    BusinessInquiry.belongsTo(models.CarType, {
      foreignKey: 'carTypeId',
      as: 'carType',
    });
  };
  return BusinessInquiry;
};
