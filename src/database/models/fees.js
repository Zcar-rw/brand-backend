'use strict';
import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Fees = sequelize.define('Fees', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    VAT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 18
    },
    LOCAR_PROFIT_MARGIN: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 13
    },
    WITHHOLDING_TAX: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 15
    },
  }, {});

  return Fees;
};
