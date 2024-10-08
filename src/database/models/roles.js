'use strict';
import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('internal', 'cooperate', 'client', 'agent'),
        allowNull: false,
        defaultValue: 'internal',
      },
    },
    {}
  );

  return Roles;
};
