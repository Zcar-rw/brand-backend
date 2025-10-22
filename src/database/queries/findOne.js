import mongoModels, { initMongoModels } from '../mongoose'
import { toPopulate } from '../mongoose/utils'
import { withGet } from './utils'

export default async (Model, condition = {}, include = []) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  
  // Map 'id' to '_id' for Mongoose compatibility
  const queryCondition = { ...condition }
  if (queryCondition.id !== undefined) {
    queryCondition._id = queryCondition.id
    delete queryCondition.id
  }
  
  const doc = await M.findOne(queryCondition).populate(toPopulate(include))
  return doc ? withGet(doc.toObject({ virtuals: true })) : {}
}
