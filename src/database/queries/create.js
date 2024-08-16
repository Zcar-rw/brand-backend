import db from '../models';

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, data = {}) => {
  const response = await db[Model].create(data, { logging: false });
  return response && response.get();
};
