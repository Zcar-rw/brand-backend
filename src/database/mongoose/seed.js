import { connectMongo } from '../mongo'
import { initMongoModels } from './index'
import * as helper from './../../helpers';

async function seed() {
  await connectMongo()
  await initMongoModels()
  const models = (await import('./index')).default
  const Role = models.Role
  const User = models.User

  // Seed roles
  const roles = [
    { name: 'admin', label: 'Admin', type: 'internal' },
    { name: 'cooperate-owner', label: 'Company Owner', type: 'cooperate' },
    { name: 'driver', label: 'Driver', type: 'client' },
    { name: 'user', label: 'User', type: 'client' },
  ]
  for (const role of roles) {
    await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true })
  }

  // Seed admin user if not exists
  const adminRole = await Role.findOne({ name: 'admin' })
  if (adminRole) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const admin = await User.findOne({ email: adminEmail })
    if (!admin) {
      await User.create({
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        password: helper.password.hash(adminPassword),
        status: 'active',
        roleId: adminRole._id,
        verified: true,
      })
      console.log('Seeded admin user:', adminEmail)
    }
  }
  console.log('MongoDB seed complete.')
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
}

export default seed
