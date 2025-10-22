import mongoose from '../mongo'
import { connectMongo } from '../mongo'
import { v4 as uuidv4 } from 'uuid'
import * as helper from '../../helpers'

// Import registering side-effects after connection
async function registerModels() {
  await import('./register')
}

function collectionName(modelName) {
  // Use Mongoose's default collection naming
  const m = mongoose.models[modelName]
  return m ? m.collection.name : undefined
}

export async function bootstrapMongo({ seed = false } = {}) {
  await connectMongo()
  await registerModels()

  const conn = mongoose.connection

  const modelNames = [
    'Role',
    'User',
    'Company',
    'Customer',
    'CarType',
    'CarMake',
    'CarModel',
    'Supplier',
    'Car',
    'Booking',
    'BookingDetail',
    'Invoice',
    'Schedule',
    'PriceList',
    'Notification',
    'Inquiry',
    'ResetPassword',
    'VerifyEmail',
    'DiscountTier',
  ]

  // Ensure collections exist
  for (const name of modelNames) {
    const col = collectionName(name)
    if (!col) continue
    const exists = (await conn.db.listCollections({ name: col }).toArray()).length > 0
    if (!exists) {
      await conn.db.createCollection(col)
    }
  }

  // Seed roles if empty or if seeding forced
  const Role = mongoose.models.Role
  const User = mongoose.models.User
  if (seed || (await Role.countDocuments()) === 0) {
    const roles = [
      { _id: uuidv4(), name: 'admin', label: 'Admin', type: 'internal' },
      { _id: uuidv4(), name: 'driver', label: 'Driver', type: 'internal' },
      { _id: uuidv4(), name: 'operation', label: 'Operation', type: 'internal' },
      { _id: uuidv4(), name: 'cooperate-owner', label: 'Cooperate representative', type: 'cooperate' },
      { _id: uuidv4(), name: 'cooperate-user', label: 'Cooperate user', type: 'cooperate' },
      { _id: uuidv4(), name: 'client', label: 'Client', type: 'client' },
      { _id: uuidv4(), name: 'agent', label: 'Agent', type: 'agent' },
      { _id: uuidv4(), name: 'car-owner', label: 'Car Owner', type: 'owner' },
    ]
    await Role.insertMany(roles)
  }

  // Seed car types and car makes when requested or if empty
  const CarType = mongoose.models.CarType
  const CarMake = mongoose.models.CarMake
  if (CarType && CarMake && (seed || (await CarType.countDocuments()) === 0 || (await CarMake.countDocuments()) === 0)) {
    const { default: carTypes } = await import('./data/carTypes.js')
    const { default: carMakes } = await import('./data/carMakes.js')

    // Upsert car types by slug
    for (const t of carTypes) {
      await CarType.updateOne({ slug: t.slug }, { $set: t }, { upsert: true })
    }

    // Upsert car makes by slug
    for (const m of carMakes) {
      await CarMake.updateOne({ slug: m.slug }, { $set: m }, { upsert: true })
    }
  }

  // Seed admin user if env present and user missing
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const adminRole = await Role.findOne({ name: 'admin' })
    if (adminRole) {
      const exists = await User.findOne({ email: ADMIN_EMAIL })
      if (!exists) {
        // Lazy import to avoid circular imports
        // const { default: helper } = await import('../../helpers/index.js')
        const hashed = helper.password.hash(ADMIN_PASSWORD)
        await User.create({
          _id: uuidv4(),
          email: ADMIN_EMAIL,
          password: hashed,
          firstName: 'Admin',
          lastName: 'Admin',
          phoneNumber: '+250788000000',
          roleId: adminRole._id,
          status: 'active',
          verified: true,
        })
      }
    }
  }
}
