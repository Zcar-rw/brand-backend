import mongoose from '../mongo'
import { connectMongo } from '../mongo'


// Exported registry similar to Sequelize's db object
const models = {}

export async function initMongoModels() {
  await connectMongo()
  // Defer model registration to avoid circular import issues
  await import('./register')
  return models
}

export function registerModel(name, schema) {
  if (!mongoose.models[name]) {
    models[name] = mongoose.model(name, schema)
  } 
  return models[name]
}

export default models
