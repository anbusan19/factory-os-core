import mongoose from 'mongoose';

const procurementOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  partId: { type: String, required: true },
  material: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  deliveryEta: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-transit', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  qualityScore: { type: Number, min: 0, max: 100, default: 95 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

procurementOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('ProcurementOrder', procurementOrderSchema);
