import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const CompanySchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    ownerId: { type: String, ref: 'User' },
    address: { type: String, required: true },
    TIN: { type: Number },
    invoiceValidity: { type: String },
    commissionType: { type: String, enum: ['flat', 'percentage'] },
    commissionFlat: { type: Number },
    commissionPercentage: { type: Number },
    theme: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
)

CompanySchema.virtual('id').get(function () { return this._id })

CompanySchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
})

CompanySchema.virtual('customers', {
  ref: 'Customer',
  localField: '_id',
  foreignField: 'companyId',
})

CompanySchema.virtual('priceLists', {
  ref: 'PriceList',
  localField: '_id',
  foreignField: 'companyId',
})

CompanySchema.set('toObject', { virtuals: true })
CompanySchema.set('toJSON', { virtuals: true })

export default registerModel('Company', CompanySchema)
