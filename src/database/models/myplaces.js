import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const MyPlace = sequelize.define(
    'MyPlace',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      joined: {
        type: DataTypes.BOOLEAN,
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
  MyPlace.associate = (models) => {
    MyPlace.belongsTo(models.Station, {
      foreignKey: 'stationId',
    });
    MyPlace.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return MyPlace;
};
