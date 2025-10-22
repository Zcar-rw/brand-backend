import mongoModels, { initMongoModels } from '../mongoose'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, where) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  
  // Map 'id' to '_id' for Mongoose compatibility
  const queryCondition = { ...where }
  if (queryCondition.id !== undefined) {
    queryCondition._id = queryCondition.id
    delete queryCondition.id
  }
  
  const res = await M.deleteMany(queryCondition)
  return { response: res.deletedCount }
}
