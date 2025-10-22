import mongoModels, { initMongoModels } from '../mongoose'

/**
 * @param {object} modal
 * @returns {object} an object containing the information of the user or null
 */

export default async (Model, key = '', field) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  const regex = new RegExp(key, 'i')
  const docs = await M.find({ [field]: regex })
  return { response: docs.map(d => d.toObject({ virtuals: true })), meta: {} }
}
