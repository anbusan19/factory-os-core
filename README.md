# FactoryOS - Manufacturing Command Center

A cutting-edge Digital Twin Dashboard for smart manufacturing, built with React, TypeScript, and modern web technologies.

## Features

### Real-Time Dashboard
- Live operational metrics (machines, workers, orders, safety alerts)
- Production vs. defects trend visualization
- System events feed with Socket.IO updates
- Animated status cards with glassmorphic design

### Digital Twin Visualization
- Interactive 3D factory floor using Three.js
- Real-time machine status indicators (Active, Idle, Fault, Maintenance)
- Hover tooltips with machine details
- Color-coded status system with efficiency metrics

### Procurement & Quality Management
- Automated material order tracking
- Quality inspection analytics with pass/fail ratios
- Supplier management dashboard
- Real-time procurement notifications

### Workforce Management
- Worker-to-machine assignment tracking
- Safety risk index monitoring
- Shift management and worker status
- Interactive reassignment capabilities

### AI Assistant (Cognitive Core)
- Floating chat widget with natural language queries
- Suggested query shortcuts
- Real-time response simulation
- Context-aware factory insights

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

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ai/              # AI chat widget
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Layout components
│   └── ui/              # shadcn UI components
├── hooks/               # Custom React hooks
├── pages/               # Route pages
├── store/               # Zustand store
└── lib/                 # Utilities

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

## Security Notes

For production deployment:
- Implement proper authentication
- Secure WebSocket connections
- Validate all user inputs
- Use environment variables for API keys
- Enable HTTPS

## License

This project is part of the Lovable platform.

---

**Made for the future of manufacturing**