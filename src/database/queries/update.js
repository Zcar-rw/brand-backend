import db from '../models';

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */
export default async (Model, data = {}, where) => {
  try {
    const response = await db[Model].update(data, {
      where,
      logging: false,
      returning: true,
    });
    return response[0] ? response[1][0].get() : {};
  } catch (error) {
    return error;
  }
};
