import mongoose from 'mongoose';

const factoryOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  factoryId: { type: String, required: true },
  factoryName: { type: String, required: true },
  area: { type: String, required: true },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  leadTimeDays: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ['placed', 'in-transit', 'out-for-delivery', 'in-production', 'completed', 'cancelled'], 
    default: 'placed' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'pending', 'not-paid'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

factoryOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('FactoryOrder', factoryOrderSchema);
