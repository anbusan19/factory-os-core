import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'on-break', 'reassigned'], 
    default: 'active' 
  },
  machineId: { type: String, default: null },
  riskIndex: { type: Number, min: 0, max: 100, default: 25 },
  shift: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Night'], 
    default: 'Morning' 
  },
  department: { type: String, default: 'Production' },
  experience: { type: Number, default: 2 }, // years
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

workerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Worker', workerSchema);
