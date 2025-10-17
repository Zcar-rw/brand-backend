import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_URI = process.env.MONGODB_URI || process.env.MONGO_URL || ''

let isConnected = false

export async function connectMongo(uri = DEFAULT_URI) {
  if (isConnected) return mongoose.connection
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables')
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, {
    // options can be tuned if needed
    autoIndex: true,
  })
  isConnected = true
  return mongoose.connection
}

export default mongoose
