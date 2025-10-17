import express from 'express';
import SafetyAlert from '../models/SafetyAlert.js';
import SystemEvent from '../models/SystemEvent.js';

const router = express.Router();

// GET all safety alerts
router.get('/safety', async (req, res) => {
  try {
    const alerts = await SafetyAlert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all system events
router.get('/events', async (req, res) => {
  try {
    const events = await SystemEvent.find().sort({ timestamp: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new safety alert
router.post('/safety', async (req, res) => {
  try {
    const alert = new SafetyAlert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST create new system event
router.post('/events', async (req, res) => {
  try {
    const event = new SystemEvent(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update safety alert
router.put('/safety/:id', async (req, res) => {
  try {
    const alert = await SafetyAlert.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!alert) {
      return res.status(404).json({ message: 'Safety alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
