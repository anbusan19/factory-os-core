import express from 'express';
import Machine from '../models/Machine.js';

const router = express.Router();

// GET all machines
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET machine by ID
router.get('/:id', async (req, res) => {
  try {
    const machine = await Machine.findOne({ id: req.params.id });
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new machine
router.post('/', async (req, res) => {
  try {
    const machine = new Machine(req.body);
    await machine.save();
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update machine
router.put('/:id', async (req, res) => {
  try {
    const machine = await Machine.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE machine
router.delete('/:id', async (req, res) => {
  try {
    const machine = await Machine.findOneAndDelete({ id: req.params.id });
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.json({ message: 'Machine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
