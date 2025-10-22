import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const BookingSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    createdBy: { type: String, ref: 'User' },
    customerId: { type: String, ref: 'Customer' },
    service: { type: String, enum: ['carHire', 'airportShuttle', 'events'], default: 'carHire' },
    comment: { type: Date, required: true },
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

BookingSchema.set('toObject', { virtuals: true })
BookingSchema.set('toJSON', { virtuals: true })

export default registerModel('Booking', BookingSchema)
