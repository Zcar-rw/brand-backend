import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const CarMakeSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    photo: { type: String },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
)

CarMakeSchema.virtual('id').get(function () { return this._id })

export default registerModel('CarMake', CarMakeSchema)
