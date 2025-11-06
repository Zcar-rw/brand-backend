import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const BookingSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    createdBy: { type: String, ref: 'User' },
  // Deprecated: we will migrate from customerId (Customer) to clientId (User)
  customerId: { type: String, ref: 'Customer' },
  // New: direct reference to the client User when booking is created for a client user
  clientId: { type: String, ref: 'User' },
    // Specific car chosen for this booking (for plate-based bookings)
    carId: { type: String, ref: 'Car' },
  service: { type: String, enum: ['carHire', 'airportShuttle', 'events'], default: 'carHire' },
  // Free-text comment about the booking (was incorrectly typed as Date)
  comment: { type: String, required: true },
    status: { type: String, enum: ['created', 'pending', 'approved', 'declined', 'cancelled', 'completed'], default: 'created' },
    totalPrice: { type: Number },
  },
  { timestamps: true, versionKey: false }
)

BookingSchema.virtual('id').get(function () { return this._id })

BookingSchema.virtual('user', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
})
BookingSchema.virtual('customer', {
  ref: 'Customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
})
// Direct client user (when provided)
BookingSchema.virtual('client', {
  ref: 'User',
  localField: 'clientId',
  foreignField: '_id',
  justOne: true,
})
BookingSchema.virtual('bookingDetails', {
  ref: 'BookingDetail',
  localField: '_id',
  foreignField: 'bookingId',
})
BookingSchema.virtual('invoice', {
  ref: 'Invoice',
  localField: '_id',
  foreignField: 'bookingId',
  justOne: true,
})

// Populate selected car and its relations
BookingSchema.virtual('car', {
  ref: 'Car',
  localField: 'carId',
  foreignField: '_id',
  justOne: true,
})

BookingSchema.set('toObject', { virtuals: true })
BookingSchema.set('toJSON', { virtuals: true })

export default registerModel('Booking', BookingSchema)
