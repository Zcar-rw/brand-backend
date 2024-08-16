import { FindOne } from '../database/queries';

/**
 * @param {object} where
 * @returns {boolean} return true if the user exists or false if not
 */
export default async (where) => {
  try {
    const response = await FindOne('User', where);
    return response;
  } catch (error) {
    return false;
  }
};
