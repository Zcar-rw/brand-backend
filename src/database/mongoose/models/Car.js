import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { registerModel } from '../index';

const CarSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    plateNumber: { type: String, required: true, unique: true },
    ownerId: { type: String, ref: 'User' },
    supplierId: { type: String, ref: 'Supplier' },
    modelId: { type: String, ref: 'CarModel', required: true },
    amount: { type: Number },
    baseAmount: { type: Number },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: String, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false },
);

CarSchema.virtual('id').get(function () {
  return this._id;
});

CarSchema.virtual('user', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
});
CarSchema.virtual('supplier', {
  ref: 'Supplier',
  localField: 'supplierId',
  foreignField: '_id',
  justOne: true,
});
CarSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
CarSchema.virtual('carModel', {
  ref: 'CarModel',
  localField: 'modelId',
  foreignField: '_id',
  justOne: true,
});

CarSchema.set('toObject', { virtuals: true });
CarSchema.set('toJSON', { virtuals: true });

export default registerModel('Car', CarSchema);
