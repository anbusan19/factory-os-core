import mongoose from 'mongoose';

const safetyAlertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['critical', 'warning', 'info'], 
    required: true 
  },
  message: { type: String, required: true },
  machineId: { type: String, default: null },
  workerId: { type: String, default: null },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },
  resolved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SafetyAlert', safetyAlertSchema);
