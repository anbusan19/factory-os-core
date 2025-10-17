import express from 'express';
import ProcurementOrder from '../models/ProcurementOrder.js';
import FactoryOrder from '../models/FactoryOrder.js';

const router = express.Router();

// GET all procurement orders
router.get('/procurement', async (req, res) => {
  try {
    const orders = await ProcurementOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all factory orders
router.get('/factory', async (req, res) => {
  try {
    const orders = await FactoryOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET procurement order by ID
router.get('/procurement/:id', async (req, res) => {
  try {
    const order = await ProcurementOrder.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Procurement order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET factory order by ID
router.get('/factory/:id', async (req, res) => {
  try {
    const order = await FactoryOrder.findOne({ id: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Factory order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new procurement order
router.post('/procurement', async (req, res) => {
  try {
    const order = new ProcurementOrder(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST create new factory order
router.post('/factory', async (req, res) => {
  try {
    const order = new FactoryOrder(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update procurement order
router.put('/procurement/:id', async (req, res) => {
  try {
    const order = await ProcurementOrder.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Procurement order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update factory order
router.put('/factory/:id', async (req, res) => {
  try {
    const order = await FactoryOrder.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Factory order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
