import mongoModels, { initMongoModels } from '../mongoose'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, where) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  const res = await M.deleteMany(where)
  return { response: res.deletedCount }
}
