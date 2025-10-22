export function inferPathFromAsOrModel(as, modelName) {
  if (as) return as
  if (!modelName) return undefined
  return modelName.charAt(0).toLowerCase() + modelName.slice(1)
}

export function toPopulate(include = []) {
  if (!include || !Array.isArray(include) || include.length === 0) return []
  return include.map((inc) => {
    const as = inc.as || inc.asName
    const modelName = inc.model && inc.model.modelName ? inc.model.modelName : inc.model?.name || as
    const path = inferPathFromAsOrModel(as, modelName)
    const populate = inc.include ? toPopulate(inc.include) : undefined
    const match = inc.where ? transformSequelizeWhereToMongo(inc.where) : undefined
    // Attributes/selection mapping can be improved later
    const spec = { path }
    if (populate && populate.length) spec.populate = populate
    if (match && Object.keys(match).length) spec.match = match
    return spec
  })
}

export function transformSequelizeWhereToMongo(where) {
  if (!where || typeof where !== 'object') return where
  const mongo = {}
  // Handle string keys
  for (const key of Object.keys(where)) {
    const val = where[key]
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const transformed = transformSequelizeWhereToMongo(val)
      if (Object.keys(transformed).length) mongo[key] = transformed
    } else {
      mongo[key] = val
    }
  }
  // Handle symbol operator keys from Sequelize.Op
  const symbols = Object.getOwnPropertySymbols(where)
  for (const sym of symbols) {
    const desc = sym.description || ''
    const val = where[sym]
    switch (desc) {
      case 'iLike': {
        // val expected like %foo%
        if (typeof val === 'string') {
          const pattern = val.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/%/g, '.*')
          return new RegExp(pattern, 'i')
        }
        break
      }
      case 'between': {
        if (Array.isArray(val) && val.length === 2) {
          const [start, end] = val
          mongo.$gte = castDateIfPossible(start)
          mongo.$lte = castDateIfPossible(end)
        }
        break
      }
      case 'gte': {
        mongo.$gte = castDateIfPossible(val)
        break
      }
      case 'lte': {
        mongo.$lte = castDateIfPossible(val)
        break
      }
      case 'contains': {
        mongo.$in = Array.isArray(val) ? val : [val]
        break
      }
      default:
        break
    }
  }
  return mongo
}

function castDateIfPossible(v) {
  const d = new Date(v)
  return isNaN(d.getTime()) ? v : d
}
