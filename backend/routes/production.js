import express from 'express';
import ProductionData from '../models/ProductionData.js';

const router = express.Router();

// GET production data
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, machineId, shift } = req.query;
    let query = {};
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (machineId) {
      query.machineId = machineId;
    }
    
    if (shift) {
      query.shift = shift;
    }
    
    const data = await ProductionData.find(query).sort({ timestamp: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET production data for charts (last 24 hours)
router.get('/chart', async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    const data = await ProductionData.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: 1 });
    
    // Group by hour for chart data
    const hourlyData = {};
    data.forEach(item => {
      const hour = new Date(item.timestamp).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { production: 0, defects: 0, count: 0 };
      }
      hourlyData[hour].production += item.production;
      hourlyData[hour].defects += item.defects;
      hourlyData[hour].count += 1;
    });
    
    const chartData = Object.keys(hourlyData).map(hour => ({
      time: `${hour.padStart(2, '0')}:00`,
      production: Math.round(hourlyData[hour].production / hourlyData[hour].count),
      defects: Math.round(hourlyData[hour].defects / hourlyData[hour].count)
    }));
    
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create production data
router.post('/', async (req, res) => {
  try {
    const data = new ProductionData(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
