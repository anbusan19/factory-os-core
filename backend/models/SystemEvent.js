import mongoose from 'mongoose';

const systemEventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['machine', 'worker', 'procurement', 'quality', 'system'], 
    required: true 
  },
  message: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['info', 'warning', 'critical'], 
    default: 'info' 
  },
  machineId: { type: String, default: null },
  workerId: { type: String, default: null },
  orderId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SystemEvent', systemEventSchema);
