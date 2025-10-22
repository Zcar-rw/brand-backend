import mongoModels, { initMongoModels } from '../mongoose'
import { withGet } from './utils'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (
  Model,
  condition = {},
  payload
) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  
  // Map 'id' to '_id' for Mongoose compatibility
  const queryCondition = { ...condition }
  if (queryCondition.id !== undefined) {
    queryCondition._id = queryCondition.id
    delete queryCondition.id
  }
  
  let doc = await M.findOne(queryCondition)
  let created = false
  if (!doc) {
    doc = await M.create({ ...queryCondition, ...payload })
    created = true
  }
  return { response: withGet(doc.toObject({ virtuals: true })), created }
}

