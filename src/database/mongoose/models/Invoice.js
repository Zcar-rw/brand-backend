import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const InvoiceSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    status: { type: String, enum: ['created', 'paid', 'partially-paid', 'cancelled'], default: 'created' },
    bookingId: { type: String, ref: 'Booking', required: true },
    customerId: { type: String, ref: 'Customer' },
    amount: { type: Number },
    year: { type: Number },
    month: { type: Number },
    increment: { type: Number },
    createdBy: { type: String, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
)

InvoiceSchema.virtual('id').get(function () { return this._id })

InvoiceSchema.virtual('customer', {
  ref: 'Customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
})
InvoiceSchema.virtual('booking', {
  ref: 'Booking',
  localField: 'bookingId',
  foreignField: '_id',
  justOne: true,
})
InvoiceSchema.virtual('createdByUser', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
})

InvoiceSchema.set('toObject', { virtuals: true })
InvoiceSchema.set('toJSON', { virtuals: true })

export default registerModel('Invoice', InvoiceSchema)
