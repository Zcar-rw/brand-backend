import mongoModels, { initMongoModels } from '../mongoose'
import { toPopulate } from '../mongoose/utils'
import { withGetArray } from './utils'

export default async (
  Model,
  condition = {},
  include = null,
  limit,
  offset,
  order,
) => {
  await initMongoModels()
  const M = mongoModels[Model]
  if (!M) throw new Error(`Mongo model not registered for ${Model}`)
  const sort = order && Array.isArray(order) && order.length
    ? order.reduce((acc, [field, dir]) => ({ ...acc, [field]: dir === 'DESC' ? -1 : 1 }), {})
    : { createdAt: -1 }
  const count = await M.countDocuments(condition)
  const rows = await M.find(condition)
    .populate(toPopulate(include))
    .sort(sort)
    .skip(Number(offset) || 0)
    .limit(Number(limit) || 0)
  return { response: withGetArray(rows.map(r => r.toObject({ virtuals: true }))), meta: { count } }
}
