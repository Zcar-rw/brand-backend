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
  let doc = await M.findOne(condition)
  let created = false
  if (!doc) {
    doc = await M.create({ ...condition, ...payload })
    created = true
  }
  return { response: withGet(doc.toObject({ virtuals: true })), created }
}

