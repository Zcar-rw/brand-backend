import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const CarModelSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    photo: { type: String },
    typeId: { type: String, ref: 'CarType', required: true },
    carMakeId: { type: String, ref: 'CarMake', required: true },
    createdBy: { type: String, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true, versionKey: false }
)

CarModelSchema.virtual('id').get(function () { return this._id })

CarModelSchema.virtual('user', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
})
CarModelSchema.virtual('carType', {
  ref: 'CarType',
  localField: 'typeId',
  foreignField: '_id',
  justOne: true,
})
CarModelSchema.virtual('carMake', {
  ref: 'CarMake',
  localField: 'carMakeId',
  foreignField: '_id',
  justOne: true,
})

CarModelSchema.set('toObject', { virtuals: true })
CarModelSchema.set('toJSON', { virtuals: true })

export default registerModel('CarModel', CarModelSchema)
