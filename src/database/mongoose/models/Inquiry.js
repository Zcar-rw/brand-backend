import { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { registerModel } from '../index'

const InquirySchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String },
    typeId: { type: String, ref: 'CarType' },
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: String, ref: 'User' },
    companyId: { type: String, ref: 'Company' },
  },
  { timestamps: true, versionKey: false }
)

InquirySchema.virtual('id').get(function () { return this._id })

export default registerModel('Inquiry', InquirySchema)
