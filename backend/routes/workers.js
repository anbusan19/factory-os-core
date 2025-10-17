import express from 'express';
import Worker from '../models/Worker.js';

const router = express.Router();

// GET all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET worker by ID
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOne({ id: req.params.id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new worker
router.post('/', async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update worker
router.put('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE worker
router.delete('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOneAndDelete({ id: req.params.id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
