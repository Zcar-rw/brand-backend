import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const PopularPlace = sequelize.define(
    'PopularPlace',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      stationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Stations',
          key: 'id',
        },
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
  PopularPlace.associate = (models) => {
    PopularPlace.belongsTo(models.Station, {
      foreignKey: 'stationId',
      as: 'station',
    });
  };
  return PopularPlace;
};
