# Factory OS Core - Setup Guide

This guide will help you set up the Factory OS Core application with a MongoDB backend and synthetic data.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/factory-os
   PORT=3001
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   - If using local MongoDB, make sure it's running on port 27017
   - If using MongoDB Atlas, update the `MONGODB_URI` in your `.env` file

5. **Seed the database with synthetic data:**
   ```bash
   npm run seed
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3001`

## Frontend Setup

1. **Navigate to the root directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## API Endpoints

The backend provides the following API endpoints:

- **Machines**: `/api/machines`
- **Workers**: `/api/workers`
- **Orders**: `/api/orders/procurement` and `/api/orders/factory`
- **Alerts**: `/api/alerts/safety` and `/api/alerts/events`
- **Production**: `/api/production`
- **Health Check**: `/api/health`

## Data Models

The application includes the following data models:

- **Machine**: Manufacturing equipment with status, position, temperature, efficiency
- **Worker**: Factory workers with risk index, shift, department
- **SafetyAlert**: Safety incidents and warnings
- **SystemEvent**: System events and notifications
- **ProcurementOrder**: Raw material orders from suppliers
- **FactoryOrder**: Manufacturing orders placed with factories
- **ProductionData**: Production metrics and quality data

## Features

- Real-time dashboard with live data
- Machine status monitoring
- Worker management and safety tracking
- Order management (procurement and factory orders)
- Warehouse inventory tracking
- Production analytics and charts
- 3D warehouse visualization

## Troubleshooting

1. **Backend connection issues:**
   - Ensure MongoDB is running
   - Check the `MONGODB_URI` in your `.env` file
   - Verify the backend server is running on port 3001

2. **Frontend API errors:**
   - Ensure the backend is running
   - Check browser console for CORS errors
   - Verify API endpoints are accessible

3. **Data not loading:**
   - Run the seed script: `npm run seed` in the backend directory
   - Check MongoDB connection
   - Verify database contains seeded data

## Development

- Backend uses Express.js with MongoDB
- Frontend uses React with TypeScript and Vite
- State management with Zustand
- Real-time updates with Socket.IO
- UI components with shadcn/ui and Tailwind CSS
