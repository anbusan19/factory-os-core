import mongoose from 'mongoose';

const productionDataSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  production: { type: Number, required: true, min: 0 },
  defects: { type: Number, required: true, min: 0 },
  efficiency: { type: Number, min: 0, max: 100, default: 85 },
  qualityScore: { type: Number, min: 0, max: 100, default: 95 },
  machineId: { type: String, default: null },
  shift: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Night'], 
    default: 'Morning' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ProductionData', productionDataSchema);
