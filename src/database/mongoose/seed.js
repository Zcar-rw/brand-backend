import { connectMongo } from '../mongo';
import { initMongoModels } from './index';
import * as helper from './../../helpers';

async function seed() {
  await connectMongo();
  await initMongoModels();
  const models = (await import('./index')).default;
  const Role = models.Role;
  const User = models.User;
  const CarType = models.CarType;
  const CarMake = models.CarMake;

  // Seed roles
  const roles = [
    { name: 'admin', label: 'Admin', type: 'internal' },
    { name: 'cooperate-owner', label: 'Company Owner', type: 'cooperate' },
    { name: 'driver', label: 'Driver', type: 'client' },
    { name: 'user', label: 'User', type: 'client' },
    { name: 'car-owner', label: 'Car Owner', type: 'owner' },
  ];
  for (const role of roles) {
    await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true });
  }

  // Seed admin user if not exists
  const adminRole = await Role.findOne({ name: 'admin' });
  if (adminRole) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        password: helper.password.hash(adminPassword),
        status: 'active',
        roleId: adminRole._id,
        verified: true,
      });
      console.log('Seeded admin user:', adminEmail);
    }
  }

  // Seed car types and car makes
  const { default: carTypes } = await import('./data/carTypes.js');
  const { default: carMakes } = await import('./data/carMakes.js');
  if (CarType) {
    for (const t of carTypes) {
      await CarType.findOneAndUpdate({ slug: t.slug }, t, { upsert: true });
    }
  }
  if (CarMake) {
    for (const m of carMakes) {
      await CarMake.findOneAndUpdate({ slug: m.slug }, m, { upsert: true });
    }
  }
  console.log('MongoDB seed complete.');

  // Seed suppliers
  const Supplier = models.Supplier;
  if (Supplier) {
    try {
      const adminUser = await User.findOne({
        email: process.env.ADMIN_EMAIL || 'admin@localhost',
      });
      if (adminUser) {
        const suppliers = [
          {
            name: 'ABC Car Rentals',
            email: 'contact@abcrentals.com',
            address: 'KN 5 Ave, Kigali, Rwanda',
            phone: '+250788111111',
            tin: 100123456,
            status: 'active',
            createdBy: adminUser._id,
          },
          {
            name: 'XYZ Motors',
            email: 'info@xyzmotors.com',
            address: 'KG 12 St, Kigali, Rwanda',
            phone: '+250788222222',
            tin: 100234567,
            status: 'active',
            createdBy: adminUser._id,
          },
          {
            name: 'Premium Auto Supply',
            email: 'sales@premiumauto.rw',
            address: 'Kimihurura, Kigali, Rwanda',
            phone: '+250788333333',
            tin: 100345678,
            status: 'active',
            createdBy: adminUser._id,
          },
        ];

        for (const supplier of suppliers) {
          await Supplier.findOneAndUpdate({ email: supplier.email }, supplier, {
            upsert: true,
            new: true,
          });
        }
        console.log('Seeded suppliers');
      }
    } catch (e) {
      console.warn('Failed to seed suppliers:', e?.message || e);
    }
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default seed;
