import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const SupplierSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    tin: { type: Number },
    createdBy: { type: String, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false }
)

SupplierSchema.virtual('id').get(function () { return this._id })

export default registerModel('Supplier', SupplierSchema)
