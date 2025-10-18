import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from '../config/database.js';
import dotenv from 'dotenv';

// Import routes
import machineRoutes from '../routes/machines.js';
import workerRoutes from '../routes/workers.js';
import orderRoutes from '../routes/orders.js';
import alertRoutes from '../routes/alerts.js';
import productionRoutes from '../routes/production.js';
import qualityControlRoutes from '../routes/qualityControl.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:8080", 
      "http://localhost:5173",
      "https://factoryos.vercel.app"
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/machines', machineRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/quality-control', qualityControlRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested from:', req.headers.origin);
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to test CORS
app.get('/api/cors-test', (req, res) => {
  console.log('CORS test requested from:', req.headers.origin);
  res.json({ 
    message: 'CORS is working!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export the Express app for Vercel
export default app;
