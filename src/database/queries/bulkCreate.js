import db from '../models'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, data = {}) => {
  // try {
  const response = await db[Model].bulkCreate(data, { logging: false })
  return response
}
