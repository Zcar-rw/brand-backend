import db from '../models';
import { Op } from 'sequelize';

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, key = {}, field, include = [], order = []) => {
  const meta = {};
  order = order || [['createdAt', 'DESC']];
  try {
    const response = await db[Model].findAll(
      {
        where: {
          [field]: {
            [Op.iLike]: `%${key}%`,
          },
        },
        include,
        order,
      },
      { logging: false }
    );
    return { response, meta };
  } catch (error) {
    return error;
  }
};
