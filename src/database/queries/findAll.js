import mongoModels, { initMongoModels } from '../mongoose'
import { toPopulate } from '../mongoose/utils'
import { withGetArray } from './utils'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, condition = {}, include = null, order = null) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  
  // Map 'id' to '_id' for Mongoose compatibility
  const queryCondition = { ...condition }
  if (queryCondition.id !== undefined) {
    queryCondition._id = queryCondition.id
    delete queryCondition.id
  }
  
  const sort = order && Array.isArray(order) && order.length
    ? order.reduce((acc, [field, dir]) => ({ ...acc, [field]: dir === 'DESC' ? -1 : 1 }), {})
    : { createdAt: -1 }
  const docs = await M.find(queryCondition).populate(toPopulate(include)).sort(sort)
  return { response: withGetArray(docs.map(d => d.toObject({ virtuals: true }))), meta: {} }
}
