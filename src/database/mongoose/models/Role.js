import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const RoleSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['internal', 'cooperate', 'client', 'agent'], default: 'internal' },
  },
  { timestamps: false, versionKey: false }
)

RoleSchema.virtual('id').get(function () { return this._id })

export default registerModel('Role', RoleSchema)
