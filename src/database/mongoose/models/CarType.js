import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const CarTypeSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String },
    favorite: { type: Boolean, default: false },
    photo: { type: String },
  },
  { timestamps: true, versionKey: false }
)

CarTypeSchema.virtual('id').get(function () { return this._id })

CarTypeSchema.virtual('priceLists', {
  ref: 'PriceList',
  localField: '_id',
  foreignField: 'carTypeId',
})

CarTypeSchema.set('toObject', { virtuals: true })
CarTypeSchema.set('toJSON', { virtuals: true })

export default registerModel('CarType', CarTypeSchema)
