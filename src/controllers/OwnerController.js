import 'dotenv/config'
import _ from 'lodash'
import status from '../config/status'
import * as helper from '../helpers'
import { Create, FindAll, FindOne, Update } from '../database/queries'

export default class OwnerController {
  // Register a new owner (creates User + Owner)
  static async registerOwner(req, res) {
    const { type, name, phone, email, address, password } = req.body

    console.log({ type, name, phone, email, address, password });

    if (!type || !['individual', 'company'].includes(type)) {
      return res.status(status.BAD_REQUEST).json({ error: "Field 'type' must be 'individual' or 'company'" })
    }
    if (!email || !password) {
      return res.status(status.BAD_REQUEST).json({ error: 'Email and password are required' })
    }
    try {
      // Check if email already exists
      const existingUser = await FindOne('User', { email })
      if (existingUser && existingUser.id) {
        return res.status(status.CONFLICT).json({ error: 'Email already registered' })
      }

      // Get owner role
      const role = await FindOne('Role', { name: 'car-owner' })
      console.log({role, roles: await FindAll('Role')})
      if (!role || !role.id) {
        return res.status(status.SERVER_ERROR).json({ error: 'Owner role not found' })
      }
// Create user
      const hashedPassword = helper.password.hash(password)
      const newUser = await Create('User', {
        email,
        password: hashedPassword,
        firstName: name ? name.split(' ')[0] : '',
        lastName: name ? name.split(' ').slice(1).join(' ') : '',
        phoneNumber: phone || '',
        status: 'active',
        roleId: role.id,
        verified: false,
      })

      // Create owner profile
      const owner = await Create('Owner', {
        userId: newUser.id,
        type,
        name: name || '',
        phone: phone || '',
        email,
        address: address || '',
        verified: false,
        status: 'active',
      })

      delete newUser.password
      return res.status(status.CREATED).json({ response: { user: newUser, owner } })
    } catch (error) {
        console.log({ error });
      return res.status(status.BAD_REQUEST).json({ error: 'Failed to register owner' })
    }
  }

  static async upsertMyOwner(req, res) {
    const userId = req.user?.id
    const { type, name, phone, email, address } = req.body

    if (!userId) {
      return res.status(status.UNAUTHORIZED).json({ error: 'Not authenticated' })
    }
    if (!type || !['individual', 'company'].includes(type)) {
      return res.status(status.BAD_REQUEST).json({ error: "Field 'type' must be 'individual' or 'company'" })
    }
    try {
      const existing = await FindOne('Owner', { userId })
      if (existing && existing.id) {
        const updated = await Update('Owner', { type, name, phone, email, address }, { id: existing.id })
        return res.status(status.OK).json({ response: updated })
      }
      const response = await Create('Owner', { userId, type, name, phone, email, address, verified: false })
      return res.status(status.CREATED).json({ response })
    } catch (error) {
      return res.status(status.BAD_REQUEST).json({ error: 'Failed to save owner profile' })
    }
  }

  static async getMyOwner(req, res) {
    const userId = req.user?.id
    if (!userId) return res.status(status.UNAUTHORIZED).json({ error: 'Not authenticated' })
    try {
      const include = []
      const owner = await FindOne('Owner', { userId }, include)
      if (!owner || _.isEmpty(owner)) {
        return res.status(status.NOT_FOUND).json({ error: 'Owner profile not found' })
      }
      return res.status(status.OK).json({ response: owner })
    } catch (error) {
      return res.status(status.BAD_REQUEST).json({ error: 'Failed to load owner profile' })
    }
  }

  static async getAllOwners(req, res) {
    try {
      const include = [
        { model: { modelName: 'User' }, as: 'user' }
      ]
      const { response } = await FindAll('Owner', {}, include)
      return res.status(status.OK).json({ response: response || [] })
    } catch (error) {
      return res.status(status.BAD_REQUEST).json({ error: 'Failed to load owners' })
    }
  }

  static async getMyCars(req, res) {
    const userId = req.user?.id
    if (!userId) return res.status(status.UNAUTHORIZED).json({ error: 'Not authenticated' })
    try {
      const owner = await FindOne('Owner', { userId })
      if (!owner || _.isEmpty(owner)) {
        return res.status(status.NOT_FOUND).json({ response: [], error: 'Owner profile not found' })
      }
      const include = [
        // Keep includes minimal and compatible with Mongoose virtuals
        { model: { modelName: 'CarModel' }, as: 'carModel' },
        { model: { modelName: 'Supplier' }, as: 'supplier' },
      ]
      const { response } = await FindAll('Car', { ownerId: owner.id }, include)
      return res.status(status.OK).json({ response })
    } catch (error) {
      return res.status(status.BAD_REQUEST).json({ error: 'Failed to load cars' })
    }
  }

  static async getMyBookings(req, res) {
    const userId = req.user?.id
    if (!userId) return res.status(status.UNAUTHORIZED).json({ error: 'Not authenticated' })
    try {
      // 1) Get owner
      const owner = await FindOne('Owner', { userId })
      if (!owner || !owner.id) {
        return res.status(status.NOT_FOUND).json({ response: [], error: 'Owner profile not found' })
      }
      // 2) Get owner cars
      const { response: cars } = await FindAll('Car', { ownerId: owner.id })
      const carIds = (cars || []).map(c => c.id)
      if (!carIds.length) return res.status(status.OK).json({ response: [] })

      // 3) Get schedules for those cars and include booking via bookingDetail
      const include = [
        { model: { modelName: 'Car' }, as: 'car' },
        { model: { modelName: 'BookingDetail' }, as: 'bookingDetail', include: [
          { model: { modelName: 'Booking' }, as: 'booking' }
        ]}
      ]
      const { response: schedules } = await FindAll('Schedule', { carId: { $in: carIds } }, include)

      // 4) Map to booking summaries
      const bookings = (schedules || []).map(s => {
        const b = s.bookingDetail?.booking || {}
        return {
          id: b.id,
          service: b.service,
          status: b.status,
          totalPrice: b.totalPrice,
          createdAt: b.createdAt || s.createdAt,
          carPlate: s.car?.plateNumber,
          scheduleStatus: s.status,
          scheduleId: s.id,
        }
      }).filter(x => x.id)
      return res.status(status.OK).json({ response: bookings })
    } catch (error) {
      return res.status(status.BAD_REQUEST).json({ error: 'Failed to load bookings' })
    }
  }
}
