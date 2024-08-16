import db from '../models';
import { Op } from 'sequelize';

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, where) => {
  try {
    const response = await db[Model].destroy({
      where,
    });
    return { response };
  } catch (error) {
    return error;
  }
};
