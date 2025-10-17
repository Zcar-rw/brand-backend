import mongoModels, { initMongoModels } from '../mongoose'
import { withGetArray } from './utils'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, data = []) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  const docs = await M.insertMany(data)
  return withGetArray(docs.map(d => d.toObject({ virtuals: true })))
}
