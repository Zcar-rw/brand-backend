import 'dotenv/config';
import _ from 'lodash';
import status from '../config/status';
import * as helper from '../helpers';
import { Create, FindAll, FindOne, Update } from '../database/queries';

export default class OwnerController {
  // Register a new owner (creates User + Owner)
  static async registerOwner(req, res) {
    const { firstName, lastName, phone, email, password, ownerType } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(status.BAD_REQUEST)
        .json({
          error: 'First name, last name, email and password are required',
        });
    }
    try {
      // Check if email already exists
      const existingUser = await FindOne('User', { email });
      if (existingUser && existingUser.id) {
        return res
          .status(status.CONFLICT)
          .json({ error: 'Email already registered' });
      }

      // Get owner role
      const role = await FindOne('Role', { name: 'car-owner' });
      if (!role || !role.id) {
        return res
          .status(status.SERVER_ERROR)
          .json({ error: 'Owner role not found' });
      }
      // Create user as car-owner
      const hashedPassword = helper.password.hash(password);
      const newUser = await Create('User', {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber: phone || '',
        ownerType: ['individual', 'company'].includes(ownerType)
          ? ownerType
          : 'individual',
        status: 'active',
        roleId: role.id,
        verified: false,
      });

      delete newUser.password;
      return res.status(status.CREATED).json({ response: { user: newUser } });
    } catch (error) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: 'Failed to register owner' });
    }
  }

  static async upsertMyOwner(req, res) {
    const userId = req.user?.id;
    const { firstName, lastName, phone, ownerType } = req.body;

    if (!userId) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: 'Not authenticated' });
    }
    try {
      const payload = { firstName, lastName, phoneNumber: phone };
      if (ownerType && ['individual', 'company'].includes(ownerType)) {
        payload.ownerType = ownerType;
      }
      const updated = await Update('User', payload, { id: userId });
      return res.status(status.OK).json({ response: updated });
    } catch (error) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: 'Failed to save owner profile' });
    }
  }

  static async getMyOwner(req, res) {
    const user = req.user;
    if (!user)
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: 'Not authenticated' });
    try {
      // Map to legacy owner-like shape for frontend compatibility
      // Determine ownerType: prefer stored value, else derive by company existence
      let computedOwnerType = user.ownerType;
      try {
        if (!computedOwnerType) {
          const anyCompany = await FindOne('Company', { ownerId: user.id });
          computedOwnerType =
            anyCompany && anyCompany.id ? 'company' : 'individual';
        }
      } catch (e) {
        computedOwnerType = user.ownerType || 'individual';
      }

      const ownerView = {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        phone: user.phoneNumber,
        status: user.status,
        verified: user.verified,
        ownerType: computedOwnerType,
        user,
      };
      return res.status(status.OK).json({ response: ownerView });
    } catch (error) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: 'Failed to load owner profile' });
    }
  }
  static async getAllOwners(req, res) {
    try {
      const role = await FindOne('Role', { name: 'car-owner' });
      if (!role || !role.id)
        return res.status(status.OK).json({ response: [] });
      const { response: users } = await FindAll('User', { roleId: role.id });
      const owners = (users || []).map((u) => ({
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: u.email,
        phone: u.phoneNumber,
        status: u.status,
        verified: u.verified,
        ownerType: u.ownerType || 'individual',
        user: u,
      }));
      return res.status(status.OK).json({ response: owners });
    } catch (error) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: 'Failed to load owners' });
    }
  }

  static async getMyCars(req, res) {
    const userId = req.user?.id;
    console.log({ userId });
    if (!userId)
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: 'Not authenticated' });
    try {
      const include = [
        {
          model: { modelName: 'CarModel' },
          as: 'carModel',
          include: [
            { model: { modelName: 'CarType' }, as: 'carType' },
            { model: { modelName: 'CarMake' }, as: 'carMake' },
          ],
        },
        { model: { modelName: 'Supplier' }, as: 'supplier' },
      ];
      const { response } = await FindAll('Car', { ownerId: userId }, include);
      return res.status(status.OK).json({ response });
    } catch (error) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: 'Failed to load cars' });
    }
  }

  static async getMyBookings(req, res) {
    const userId = req.user?.id;
    if (!userId)
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: 'Not authenticated' });
    try {
      // 1) Get owner cars (now userId)
      const { response: cars } = await FindAll('Car', { ownerId: userId });
      const carIds = (cars || []).map((c) => c.id);
      if (!carIds.length) return res.status(status.OK).json({ response: [] });

      // 2) Find bookings whose carId is any of the owner's cars
      const include = [
        {
          model: { modelName: 'Car' },
          as: 'car',
          include: [
            {
              model: { modelName: 'CarModel' },
              as: 'carModel',
              include: [
                { model: { modelName: 'CarType' }, as: 'carType' },
                { model: { modelName: 'CarMake' }, as: 'carMake' },
              ],
            },
            { model: { modelName: 'User' }, as: 'owner' },
          ],
        },
        {
          model: { modelName: 'Customer' },
          as: 'customer',
          include: [
            { model: { modelName: 'User' }, as: 'user' },
            { model: { modelName: 'Company' }, as: 'company' },
          ],
        },
        { model: { modelName: 'User' }, as: 'client' },
        { model: { modelName: 'BookingDetail' }, as: 'bookingDetails' },
      ];
      const { response: bookings } = await FindAll('Booking', { carId: { $in: carIds } }, include);
      console.log({ bookings });
      return res.status(status.OK).json({ response: bookings });

  // 3) Previous schedule-based mapping is no longer needed
      // const bookings = (schedules || []).map(s => {
      //   const b = s.bookingDetail?.booking || {}
      //   const customer = b.customer || null
      //   return {
      //     id: b.id,
      //     service: b.service,
      //     status: b.status,
      //     totalPrice: b.totalPrice,
      //     createdAt: b.createdAt || s.createdAt,
      //     carPlate: s.car?.plateNumber,
      //     car: s.car || b.car || null,
      //     scheduleStatus: s.status,
      //     scheduleId: s.id,
      //     customer,
      //   }
      // }).filter(x => x.id)
      // return res.status(status.OK).json({ response: bookings })
    } catch (error) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: 'Failed to load bookings' });
    }
  }
}
