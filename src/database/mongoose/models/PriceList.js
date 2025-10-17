import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const PriceListSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    companyId: { type: String, ref: 'Company', required: true },
    carTypeId: { type: String, ref: 'CarType', required: true },
    class: { type: String, required: true },
    price: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false }
)

PriceListSchema.virtual('id').get(function () { return this._id })

PriceListSchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true,
})
PriceListSchema.virtual('car', {
  ref: 'CarType',
  localField: 'carTypeId',
  foreignField: '_id',
  justOne: true,
})

PriceListSchema.set('toObject', { virtuals: true })
PriceListSchema.set('toJSON', { virtuals: true })

export default registerModel('PriceList', PriceListSchema)
