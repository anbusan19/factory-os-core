# Factory OS Backend

Backend API for Factory OS Core application with MongoDB integration.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
Create a `.env` file in the backend directory with:
```
MONGODB_URI=mongodb://localhost:27017/factory-os
PORT=3001
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Seed the database with synthetic data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Machines
- `GET /api/machines` - Get all machines
- `GET /api/machines/:id` - Get machine by ID
- `POST /api/machines` - Create new machine
- `PUT /api/machines/:id` - Update machine
- `DELETE /api/machines/:id` - Delete machine

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get worker by ID
- `POST /api/workers` - Create new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Orders
- `GET /api/orders/procurement` - Get all procurement orders
- `GET /api/orders/factory` - Get all factory orders
- `GET /api/orders/procurement/:id` - Get procurement order by ID
- `GET /api/orders/factory/:id` - Get factory order by ID
- `POST /api/orders/procurement` - Create procurement order
- `POST /api/orders/factory` - Create factory order
- `PUT /api/orders/procurement/:id` - Update procurement order
- `PUT /api/orders/factory/:id` - Update factory order

### Alerts & Events
- `GET /api/alerts/safety` - Get all safety alerts
- `GET /api/alerts/events` - Get all system events
- `POST /api/alerts/safety` - Create safety alert
- `POST /api/alerts/events` - Create system event
- `PUT /api/alerts/safety/:id` - Update safety alert

### Production Data
- `GET /api/production` - Get production data
- `GET /api/production/chart` - Get production data for charts
- `POST /api/production` - Create production data

### Health Check
- `GET /api/health` - Server health status

## Data Models

The backend includes the following data models:
- **Machine**: Manufacturing equipment with status, position, temperature, efficiency
- **Worker**: Factory workers with risk index, shift, department
- **SafetyAlert**: Safety incidents and warnings
- **SystemEvent**: System events and notifications
- **ProcurementOrder**: Raw material orders from suppliers
- **FactoryOrder**: Manufacturing orders placed with factories
- **ProductionData**: Production metrics and quality data

## Real-time Updates

The backend includes Socket.IO for real-time updates. Connect to `http://localhost:3001` to receive real-time data updates.
