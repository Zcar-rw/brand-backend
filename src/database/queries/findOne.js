import db from '../models';
const Sequelize = require('sequelize');
/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, condition = {}, include = []) => {
  try {
    const response = await db[Model].findOne(
      {
        where: condition,
        include,
      },
      { logging: false }
    );
    return response || {};
  } catch (error) {
    return error;
  }
};
