import db from '../models'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (
  Model,
  condition = {},
  payload
) => {
  try {
    const [response, created] = await db[Model].findOrCreate(
      {
        where: condition,
        defaults: payload,
      },
    )
    return { response, created }
  } catch (error) {
    return error
  }
}

