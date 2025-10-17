import mongoModels, { initMongoModels } from '../mongoose'
import { withGet } from './utils'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */
export default async (Model, data = {}, where) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  const doc = await M.findOneAndUpdate(where, data, { new: true })
  return doc ? withGet(doc.toObject({ virtuals: true })) : {}
}
