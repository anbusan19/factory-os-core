import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'idle', 'fault', 'maintenance'], 
    default: 'idle' 
  },
  workerId: { type: String, default: null },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  temperature: { type: Number, default: 65 },
  efficiency: { type: Number, default: 85 },
  lastMaintenance: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

machineSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Machine', machineSchema);
