# FactoryOS - Manufacturing Command Center

<div align="center">
  <img src="frontend/public/FactoryOS Banner - Light.png" alt="FactoryOS Banner" width="600" />
</div>

---

**FactoryOS** is a cutting-edge Digital Twin Dashboard for smart manufacturing, built with React, TypeScript, and modern web technologies. It provides real-time visibility into factory operations, intelligent quality control, and AI-powered insights for the future of manufacturing.

## Overview

FactoryOS transforms traditional manufacturing operations into an intelligent, data-driven ecosystem. Our platform combines real-time monitoring, predictive analytics, and AI assistance to optimize production efficiency, ensure quality control, and enhance worker safety.

## Key Features

### Real-Time Dashboard
- **Live Operational Metrics**: Real-time monitoring of machines, workers, orders, and safety alerts
- **Production Analytics**: Advanced trend visualization comparing production output vs. defect rates
- **System Events Feed**: Live event streaming with Socket.IO integration for instant updates
- **Interactive Status Cards**: Animated glassmorphic design with smooth transitions
- **KPI Monitoring**: Key performance indicators with historical data and predictive insights

### Digital Twin Visualization
- **3D Factory Floor**: Immersive Three.js-powered interactive factory environment
- **Real-Time Status Indicators**: Live machine status (Active, Idle, Fault, Maintenance) with color coding
- **Machine Details**: Comprehensive hover tooltips with performance metrics and maintenance schedules
- **Efficiency Metrics**: Visual representation of production efficiency and machine utilization
- **Navigation Controls**: Intuitive orbit controls for seamless 3D navigation

### Procurement & Quality Management
- **Automated Order Tracking**: End-to-end material procurement workflow automation
- **Quality Analytics**: Advanced inspection analytics with pass/fail ratios and trend analysis
- **Supplier Dashboard**: Comprehensive supplier performance monitoring and management
- **Real-Time Notifications**: Instant alerts for procurement updates and quality issues
- **Inventory Management**: Smart inventory tracking with predictive restocking

### Workforce Management
- **Worker-Machine Assignment**: Intelligent assignment tracking and optimization algorithms
- **Safety Risk Monitoring**: Advanced safety risk index with predictive analytics
- **Shift Management**: Comprehensive shift scheduling and worker status tracking
- **Interactive Reassignment**: Drag-and-drop interface for efficient resource allocation
- **Performance Analytics**: Worker productivity metrics and skill assessment

### AI Assistant (Cognitive Core)
- **Natural Language Processing**: Advanced NLP for intuitive factory queries and commands
- **Smart Query Suggestions**: Context-aware query recommendations based on current operations
- **Real-Time Insights**: Instant AI-powered analysis of factory data and trends
- **Predictive Analytics**: Machine learning-powered predictions for maintenance and optimization
- **Voice Integration**: Voice-activated commands for hands-free operation

### Quality Control & Defect Detection
- **Computer Vision**: YOLO-based defect detection for real-time quality assurance
- **Automated Inspection**: AI-powered visual inspection of manufactured parts
- **Defect Classification**: Intelligent categorization of defects with severity assessment
- **Quality Reports**: Comprehensive quality control reports with statistical analysis
- **Integration Ready**: Seamless integration with existing quality control systems

## Design System

**Theme**: Monochrome Industrial with Minimalist Design

**Colors**:
- **Primary**: Black (`#000000`) - Text, borders, primary elements
- **Secondary**: White (`#FFFFFF`) - Background, contrast elements
- **Gray Scale**: Various shades for depth and hierarchy
- **Background**: Clean white with subtle gray accents

**Typography**: Space Grotesk - Technical, modern industrial aesthetic

**Effects**:
- Subtle shadows for depth
- Clean borders and dividers
- Smooth transitions
- Minimalist design patterns

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **3D Graphics**: Three.js + React Three Fiber
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Real-time**: Socket.IO Client (simulated)
- **Date Handling**: date-fns

## Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **yarn** 1.22+)
- **Git** for version control
- **Modern browser** with WebGL support (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/factory-os-core.git
   cd factory-os-core
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   # Copy example configuration
   cp backend/config.example.js backend/config.js
   
   # Edit configuration with your database settings
   nano backend/config.js
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm start

   # Terminal 2: Start frontend development server
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs


### Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# Start production server
npm run preview

# Build backend for production
cd ../backend
npm run build
npm start
```

## 📁 Project Structure

```
factory-os-core/
├── backend/                    # Node.js/Express backend
│   ├── config/                 # Database and app configuration
│   ├── models/                 # Database models (MongoDB/Mongoose)
│   ├── routes/                 # API route handlers
│   ├── scripts/                # Data generation and seeding scripts
│   └── server.js              # Main server entry point
├── frontend/                   # React/TypeScript frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ai/            # AI chat widget
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   ├── digitaltwin/   # 3D factory visualization
│   │   │   ├── fileviewer/    # File and model viewers
│   │   │   ├── layout/        # Layout components
│   │   │   ├── qualitycontrol/# Quality control components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route pages
│   │   ├── store/             # Zustand state management
│   │   └── lib/               # Utilities and API client
│   └── public/                # Static assets
├── render/                     # Quality control ML models
│   ├── dataset/               # Training data
│   ├── runs/                  # Model training runs
│   └── *.py                   # Python ML scripts
└── README.md                  # This file
```

## 🔌 API Documentation

### Core Endpoints

#### Dashboard Data
```http
GET /api/dashboard/overview
GET /api/dashboard/metrics
GET /api/dashboard/events
```

#### Machine Management
```http
GET /api/machines              # Get all machines
GET /api/machines/:id          # Get specific machine
PUT /api/machines/:id/status   # Update machine status
GET /api/machines/:id/metrics  # Get machine metrics
```

#### Production Data
```http
GET /api/production/data       # Get production data
POST /api/production/record    # Record production data
GET /api/production/analytics  # Get production analytics
```

#### Quality Control
```http
POST /api/quality/analyze      # Analyze image for defects
GET /api/quality/reports       # Get quality reports
GET /api/quality/defects       # Get defect statistics
```

#### Workforce Management
```http
GET /api/workers              # Get all workers
GET /api/workers/:id          # Get specific worker
PUT /api/workers/:id/assign   # Assign worker to machine
GET /api/workers/safety       # Get safety metrics
```

#### Orders & Procurement
```http
GET /api/orders               # Get all orders
POST /api/orders              # Create new order
PUT /api/orders/:id/status    # Update order status
GET /api/procurement/suppliers # Get supplier data
```

### WebSocket Events

```javascript
// Real-time updates
socket.on('machine_status_update', (data) => {
  // Handle machine status changes
});

socket.on('production_update', (data) => {
  // Handle production data updates
});

socket.on('safety_alert', (data) => {
  // Handle safety alerts
});

socket.on('quality_alert', (data) => {
  // Handle quality control alerts
});
```

## Key Components

### Dashboard Page
- Overview of factory operations
- Live metrics and KPIs
- System events feed
- Production analytics

### Digital Twin Page  
- 3D visualization of factory floor
- Interactive machine cards
- Real-time status updates
- OrbitControls for navigation

### Procurement Page
- Order tracking table
- Quality inspection charts
- Supplier performance metrics
- Activity timeline

### Workforce Page
- Worker list and status
- Machine allocation overview
- Safety risk profiles
- Assignment management

## Real-Time Updates

The app uses a simulated real-time system (`useRealtime` hook) that:
- Generates system events every 15 seconds
- Creates safety alerts every 30 seconds
- Updates machine statuses every 20 seconds
- Displays toast notifications for critical events

**Production Note**: Replace with actual Socket.IO connection:
```typescript
// Connect to your backend
const socket = io('your-backend-url');
socket.on('event', (data) => {
  // Handle real-time updates
});
```

## AI Assistant

The Cognitive Core AI assistant is a floating chat widget that:
- Responds to natural language queries
- Provides factory insights
- Suggests common queries
- Simulates typing indicators

**Production Note**: Replace with actual AI API endpoint:
```typescript
const response = await fetch('/cognitive-core/query', {
  method: 'POST',
  body: JSON.stringify({ prompt: userMessage })
});
```

## Customization

### Colors
Edit `src/index.css` to customize the color scheme:
```css
:root {
  --primary: 0 0% 0%;         /* Black */
  --secondary: 0 0% 100%;     /* White */
  --border: 0 0% 85%;         /* Light Gray */
  --muted: 0 0% 96%;          /* Background Gray */
}
```

### Animations
Custom animations are defined in `src/index.css`:
- `.card` - Clean card design
- `.border` - Subtle border effects
- `.shadow` - Depth shadows
- `.transition-smooth` - Smooth transitions

## Responsive Design

The dashboard is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Status Indicators

- **Active**: Machine is running normally (Dark Gray)
- **Idle**: Machine is ready but not in use (Medium Gray)
- **Fault**: Machine requires attention (Black with border)
- **Maintenance**: Machine is under maintenance (Light Gray)

## Deployment & Production

### Environment Configuration

Create production environment files:

```bash
# Backend environment
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://your-mongodb-connection
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key

# Frontend environment
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-websocket-domain.com
```

### Production Deployment

#### Option 1: Traditional VPS/Server
```bash
# Install PM2 for process management
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name "factory-os-backend"

# Build and serve frontend
cd frontend
npm run build
pm2 serve dist 3000 --name "factory-os-frontend"
```

#### Option 2: Docker Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/factoryos
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Option 3: Cloud Deployment

**Vercel (Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Railway/Render (Backend)**
```bash
# Connect to Railway
railway login
railway link
railway up
```

### Performance Optimization

```javascript
// Backend optimizations
app.use(compression());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Frontend optimizations
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber']
        }
      }
    }
  }
});
```

### Monitoring & Logging

```javascript
// Add monitoring
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Security Best Practices

### Authentication & Authorization
- Implement JWT-based authentication
- Use role-based access control (RBAC)
- Secure WebSocket connections with authentication
- Implement rate limiting and request validation

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS/WSS for all communications
- Implement input validation and sanitization
- Regular security audits and dependency updates

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connections secured
- [ ] HTTPS certificates installed
- [ ] CORS policies configured
- [ ] Rate limiting implemented
- [ ] Error handling and logging configured
- [ ] Backup strategies in place
- [ ] Monitoring and alerting setup

## Troubleshooting & FAQ

### Common Issues

#### Frontend Issues
**Problem**: 3D models not loading
```bash
# Solution: Check WebGL support
# Visit: https://get.webgl.org/
# Ensure hardware acceleration is enabled
```

**Problem**: Build errors with Three.js
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Hot reload not working
```bash
# Solution: Check Vite configuration
# Ensure VITE_API_URL is set correctly
```

#### Backend Issues
**Problem**: Database connection failed
```bash
# Solution: Check MongoDB connection
# Verify MONGODB_URI in config.js
# Ensure MongoDB is running
```

**Problem**: CORS errors
```bash
# Solution: Update CORS configuration in server.js
app.use(cors({
  origin: ['http://localhost:8080', 'https://factoryos.vercel.app'],
  credentials: true
}));
```

**Problem**: WebSocket connection failed
```bash
# Solution: Check Socket.IO configuration
# Verify CORS settings for WebSocket
# Check firewall settings
```

### Performance Issues

#### Slow 3D Rendering
- Reduce model complexity
- Implement LOD (Level of Detail)
- Use texture compression
- Enable hardware acceleration

#### High Memory Usage
- Implement object pooling
- Dispose unused geometries
- Optimize texture sizes
- Use instanced rendering

#### API Response Times
- Implement caching strategies
- Use database indexing
- Optimize queries
- Add response compression

### Development Tips

#### Debugging 3D Scenes
```javascript
// Add orbit controls for debugging
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Add grid helper
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
```

#### API Testing
```bash
# Test API endpoints
curl -X GET http://localhost:3001/api/machines
curl -X POST http://localhost:3001/api/quality/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "base64-encoded-image"}'
```

#### Database Seeding
```bash
# Generate sample data
cd backend/scripts
node generateDataScenarios.js
node insertSyntheticData.js
```

### FAQ

**Q: Can I use a different database?**
A: Yes, FactoryOS supports MongoDB, PostgreSQL, and MySQL. Update the database configuration in `backend/config/database.js`.

**Q: How do I add new machine types?**
A: Extend the Machine model in `backend/models/Machine.js` and update the frontend components accordingly.

**Q: Can I customize the 3D factory layout?**
A: Yes, modify the factory layout in `frontend/src/components/digitaltwin/FactoryFloor.tsx`.

**Q: How do I integrate with existing ERP systems?**
A: Use the API endpoints to sync data with your ERP system. Implement webhooks for real-time updates.

**Q: Is the AI assistant customizable?**
A: Yes, modify the AI responses in `frontend/src/components/ai/AIChatWidget.tsx` or integrate with your preferred AI service.

**Q: How do I add new quality control checks?**
A: Extend the quality control models and add new detection algorithms in the `render/` directory.

## Additional Resources

### Documentation
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)


### Contributing
We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>🏭 Made for the future of manufacturing 🏭</strong>
  <br>
  <em>Transforming factories with intelligent digital twins</em>
</div>