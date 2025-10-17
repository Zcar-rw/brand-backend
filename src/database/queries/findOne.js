import mongoModels, { initMongoModels } from '../mongoose'
import { toPopulate } from '../mongoose/utils'
import { withGet } from './utils'

export default async (Model, condition = {}, include = []) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  const doc = await M.findOne(condition).populate(toPopulate(include))
  return doc ? withGet(doc.toObject({ virtuals: true })) : {}
}
