import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '../config/database.js';
import Machine from '../models/Machine.js';
import Worker from '../models/Worker.js';
import SafetyAlert from '../models/SafetyAlert.js';
import SystemEvent from '../models/SystemEvent.js';
import ProcurementOrder from '../models/ProcurementOrder.js';
import FactoryOrder from '../models/FactoryOrder.js';
import ProductionData from '../models/ProductionData.js';

// Set faker locale
faker.locale = 'en_US';

// Connect to database
await connectDB();

console.log('🚀 Starting synthetic data insertion...');

// Clear existing data
console.log('🧹 Clearing existing data...');
await Machine.deleteMany({});
await Worker.deleteMany({});
await SafetyAlert.deleteMany({});
await SystemEvent.deleteMany({});
await ProcurementOrder.deleteMany({});
await FactoryOrder.deleteMany({});
await ProductionData.deleteMany({});

console.log('✅ Existing data cleared');

// Generate synthetic machines
console.log('🏭 Creating machines...');
const machines = [];
const machineTypes = [
  { name: 'CNC Mill A', type: 'milling', baseEfficiency: 95 },
  { name: 'Lathe B', type: 'turning', baseEfficiency: 88 },
  { name: 'Press C', type: 'pressing', baseEfficiency: 82 },
  { name: 'Welding Station D', type: 'welding', baseEfficiency: 90 },
  { name: 'Assembly Line E', type: 'assembly', baseEfficiency: 96 },
  { name: 'Drill Press F', type: 'drilling', baseEfficiency: 85 },
  { name: 'Grinder G', type: 'grinding', baseEfficiency: 87 },
  { name: 'Cutter H', type: 'cutting', baseEfficiency: 89 },
  { name: 'Injection Molder I', type: 'molding', baseEfficiency: 92 },
  { name: 'Packaging Line J', type: 'packaging', baseEfficiency: 94 }
];

const positions = [
  { x: -5, y: 0, z: -5 }, { x: 5, y: 0, z: -5 }, { x: -5, y: 0, z: 5 },
  { x: 5, y: 0, z: 5 }, { x: 0, y: 0, z: 0 }, { x: -3, y: 0, z: -3 },
  { x: 3, y: 0, z: -3 }, { x: -3, y: 0, z: 3 }, { x: -2, y: 0, z: -2 },
  { x: 2, y: 0, z: 2 }
];

for (let i = 0; i < machineTypes.length; i++) {
  const machineType = machineTypes[i];
  const statuses = ['active', 'idle', 'fault', 'maintenance'];
  const status = faker.random.arrayElement(statuses);
  
  // Adjust efficiency based on status
  let efficiency = machineType.baseEfficiency;
  if (status === 'fault') efficiency = faker.random.number({ min: 20, max: 50 });
  else if (status === 'maintenance') efficiency = faker.random.number({ min: 60, max: 80 });
  else if (status === 'idle') efficiency = faker.random.number({ min: 70, max: 85 });
  
  machines.push({
    id: `M-${String(i + 1).padStart(3, '0')}`,
    name: machineType.name,
    status,
    position: positions[i],
    temperature: faker.random.number({ min: 60, max: 90 }),
    efficiency,
    lastMaintenance: faker.date.recent(30),
    createdAt: faker.date.past(1),
    updatedAt: new Date()
  });
}

await Machine.insertMany(machines);
console.log(`✅ Created ${machines.length} machines`);

// Generate synthetic workers
console.log('👥 Creating workers...');
const workers = [];
const departments = ['Production', 'Quality', 'Maintenance', 'Assembly', 'Packaging', 'Safety'];
const shifts = ['Morning', 'Afternoon', 'Night'];
const skills = ['CNC Operation', 'Quality Control', 'Maintenance', 'Assembly', 'Welding', 'Packaging'];

for (let i = 0; i < 15; i++) {
  const statuses = ['active', 'on-break', 'reassigned'];
  const status = faker.random.arrayElement(statuses);
  const department = faker.random.arrayElement(departments);
  const shift = faker.random.arrayElement(shifts);
  
  // Assign machine based on department and availability
  let machineId = null;
  if (status === 'active' && department === 'Production') {
    const availableMachines = machines.filter(m => m.status === 'active' || m.status === 'idle');
    if (availableMachines.length > 0) {
      machineId = faker.random.arrayElement(availableMachines).id;
    }
  }
  
  workers.push({
    id: `W-${String(i + 1).padStart(3, '0')}`,
    name: faker.name.findName(),
    status,
    machineId,
    riskIndex: faker.random.number({ min: 5, max: 85 }),
    shift,
    department,
    experience: faker.random.number({ min: 1, max: 20 }),
    skills: faker.random.arrayElements(skills, faker.random.number({ min: 1, max: 3 })),
    createdAt: faker.date.past(2),
    updatedAt: new Date()
  });
}

await Worker.insertMany(workers);
console.log(`✅ Created ${workers.length} workers`);

// Generate synthetic safety alerts
console.log('⚠️ Creating safety alerts...');
const safetyAlerts = [];
const alertTypes = ['critical', 'warning', 'info'];
const alertMessages = [
  'Machine temperature exceeds safe limits',
  'Worker risk index elevated - monitor closely',
  'Safety equipment check required',
  'Emergency stop activated',
  'Maintenance schedule overdue',
  'Quality control alert triggered',
  'Environmental conditions outside normal range',
  'Worker fatigue detected',
  'Chemical exposure limit exceeded',
  'Equipment malfunction detected',
  'Fire suppression system activated',
  'Worker injury reported',
  'Hazardous material spill detected',
  'Electrical fault in machine',
  'Ventilation system failure'
];

for (let i = 0; i < 20; i++) {
  const alertType = faker.random.arrayElement(alertTypes);
  const severity = alertType === 'critical' ? 'critical' : 
                  alertType === 'warning' ? 'high' : 
                  faker.random.arrayElement(['low', 'medium']);
  
  safetyAlerts.push({
    id: `SA-${String(i + 1).padStart(3, '0')}`,
    type: alertType,
    message: faker.random.arrayElement(alertMessages),
    machineId: faker.random.arrayElement(machines).id,
    workerId: faker.random.arrayElement(workers).id,
    severity,
    resolved: faker.random.boolean() && faker.random.number({ min: 1, max: 10 }) > 3,
    timestamp: faker.date.recent(7),
    createdAt: faker.date.recent(7)
  });
}

await SafetyAlert.insertMany(safetyAlerts);
console.log(`✅ Created ${safetyAlerts.length} safety alerts`);

// Generate synthetic system events
console.log('📊 Creating system events...');
const systemEvents = [];
const eventTypes = ['machine', 'worker', 'procurement', 'quality', 'system'];
const eventMessages = [
  'Machine started production cycle',
  'Inspection passed for batch',
  'Machine reported fault - maintenance required',
  'Worker shift change completed',
  'Quality control process initiated',
  'System backup completed',
  'New order received',
  'Production target achieved',
  'Maintenance completed successfully',
  'Quality alert resolved',
  'Worker assigned to new machine',
  'Production line stopped for maintenance',
  'Quality inspection failed - batch rejected',
  'New worker onboarded',
  'Machine efficiency improved after calibration',
  'Safety protocol updated',
  'Inventory levels low - reorder triggered',
  'Production schedule updated',
  'Worker performance review completed',
  'Machine calibration scheduled'
];

for (let i = 0; i < 30; i++) {
  const eventType = faker.random.arrayElement(eventTypes);
  const severity = faker.random.arrayElement(['info', 'warning', 'critical']);
  
  systemEvents.push({
    id: `E-${String(i + 1).padStart(3, '0')}`,
    type: eventType,
    message: faker.random.arrayElement(eventMessages),
    severity,
    machineId: eventType === 'machine' ? faker.random.arrayElement(machines).id : null,
    workerId: eventType === 'worker' ? faker.random.arrayElement(workers).id : null,
    timestamp: faker.date.recent(5),
    createdAt: faker.date.recent(5)
  });
}

await SystemEvent.insertMany(systemEvents);
console.log(`✅ Created ${systemEvents.length} system events`);

// Generate synthetic procurement orders
console.log('📦 Creating procurement orders...');
const procurementOrders = [];
const suppliers = [
  'Steel Corp', 'Polymer Industries', 'Metal Works Inc', 'Chemical Supply Co', 
  'Raw Materials Ltd', 'Industrial Components', 'Advanced Materials Co', 
  'Precision Parts Supply', 'Global Materials Inc', 'Tech Components Ltd'
];
const materials = [
  'Steel Grade A', 'PVC Resin', 'Aluminum Alloy', 'Carbon Fiber', 'Titanium',
  'Copper Wire', 'Plastic Pellets', 'Stainless Steel', 'Brass Rods', 'Rubber Sheets',
  'Ceramic Components', 'Glass Fibers', 'Composite Materials', 'Titanium Alloy',
  'Nickel Plating', 'Zinc Coating', 'Epoxy Resin', 'Polyurethane Foam'
];
const partIds = ['P-4512', 'P-2234', 'P-8891', 'P-1234', 'P-5678', 'P-9012', 'P-3456', 'P-7890', 'P-2468', 'P-1357'];

for (let i = 0; i < 12; i++) {
  const quantity = faker.random.number({ min: 100, max: 2000 });
  const unitPrice = faker.random.number({ min: 10, max: 500, precision: 0.01 });
  const statuses = ['pending', 'in-transit', 'delivered', 'cancelled'];
  const status = faker.random.arrayElement(statuses);
  
  procurementOrders.push({
    id: `PO-${String(i + 1).padStart(3, '0')}`,
    supplier: faker.random.arrayElement(suppliers),
    partId: faker.random.arrayElement(partIds),
    material: faker.random.arrayElement(materials),
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    deliveryEta: faker.date.future(14),
    status,
    qualityScore: faker.random.number({ min: 85, max: 100 }),
    createdAt: faker.date.past(30),
    updatedAt: new Date()
  });
}

await ProcurementOrder.insertMany(procurementOrders);
console.log(`✅ Created ${procurementOrders.length} procurement orders`);

// Generate synthetic factory orders
console.log('🏭 Creating factory orders...');
const factoryOrders = [];
const factoryNames = [
  'AutoParts Manufacturing', 'Precision Components Ltd', 'Industrial Solutions Inc', 
  'Tech Manufacturing Co', 'Advanced Production Systems', 'Quality Components Inc',
  'Modern Manufacturing Co', 'Elite Production Ltd', 'Innovation Manufacturing',
  'Superior Components Co'
];
const areas = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central Hub', 'Production Floor A', 'Assembly Line B', 'Quality Control Zone'];

for (let i = 0; i < 10; i++) {
  const quantity = faker.random.number({ min: 50, max: 1000 });
  const unitPrice = faker.random.number({ min: 25, max: 500, precision: 0.01 });
  const statuses = ['placed', 'in-transit', 'out-for-delivery', 'in-production', 'completed', 'cancelled'];
  const status = faker.random.arrayElement(statuses);
  const paymentStatuses = ['paid', 'pending', 'not-paid'];
  const paymentStatus = status === 'completed' ? 'paid' : 
                       status === 'cancelled' ? 'not-paid' : 
                       faker.random.arrayElement(paymentStatuses);
  
  factoryOrders.push({
    id: `FO-${String(i + 1).padStart(3, '0')}`,
    factoryId: `F-${String(i + 1).padStart(3, '0')}`,
    factoryName: faker.random.arrayElement(factoryNames),
    area: faker.random.arrayElement(areas),
    unitPrice,
    quantity,
    totalPrice: quantity * unitPrice,
    leadTimeDays: faker.random.number({ min: 3, max: 21 }),
    status,
    paymentStatus,
    createdAt: faker.date.past(60),
    updatedAt: new Date()
  });
}

await FactoryOrder.insertMany(factoryOrders);
console.log(`✅ Created ${factoryOrders.length} factory orders`);

// Generate synthetic production data
console.log('📈 Creating production data...');
const productionData = [];

// Generate data for the last 7 days
for (let day = 0; day < 7; day++) {
  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date(Date.now() - (6 - day) * 24 * 60 * 60 * 1000 - (23 - hour) * 60 * 60 * 1000);
    const shift = shifts[Math.floor(hour / 8)];
    
    // Production varies by shift and day of week
    let baseProduction = 60;
    if (shift === 'Morning') baseProduction = 80;
    else if (shift === 'Afternoon') baseProduction = 70;
    else baseProduction = 40; // Night shift typically lower
    
    // Weekend production is lower
    if (timestamp.getDay() === 0 || timestamp.getDay() === 6) {
      baseProduction *= 0.6;
    }
    
    const production = faker.random.number({ 
      min: Math.max(10, baseProduction - 20), 
      max: baseProduction + 20 
    });
    
    productionData.push({
      timestamp,
      production,
      defects: faker.random.number({ min: 0, max: Math.max(1, Math.floor(production * 0.1)) }),
      efficiency: faker.random.number({ min: 75, max: 98 }),
      qualityScore: faker.random.number({ min: 90, max: 100 }),
      machineId: faker.random.arrayElement(machines).id,
      shift,
      createdAt: timestamp
    });
  }
}

await ProductionData.insertMany(productionData);
console.log(`✅ Created ${productionData.length} production data points`);

// Generate additional historical data for better analytics
console.log('📊 Creating historical analytics data...');
const historicalData = [];

// Generate monthly data for the past 6 months
for (let month = 0; month < 6; month++) {
  const monthDate = new Date();
  monthDate.setMonth(monthDate.getMonth() - (5 - month));
  
  for (let day = 1; day <= 28; day += 7) { // Weekly data points
    const timestamp = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    
    historicalData.push({
      timestamp,
      production: faker.random.number({ min: 800, max: 1200 }),
      defects: faker.random.number({ min: 5, max: 50 }),
      efficiency: faker.random.number({ min: 80, max: 95 }),
      qualityScore: faker.random.number({ min: 85, max: 98 }),
      machineId: faker.random.arrayElement(machines).id,
      shift: faker.random.arrayElement(shifts),
      createdAt: timestamp
    });
  }
}

await ProductionData.insertMany(historicalData);
console.log(`✅ Created ${historicalData.length} historical data points`);

console.log('\n🎉 Database seeded successfully!');
console.log(`📊 Summary:`);
console.log(`   • ${machines.length} machines`);
console.log(`   • ${workers.length} workers`);
console.log(`   • ${safetyAlerts.length} safety alerts`);
console.log(`   • ${systemEvents.length} system events`);
console.log(`   • ${procurementOrders.length} procurement orders`);
console.log(`   • ${factoryOrders.length} factory orders`);
console.log(`   • ${productionData.length + historicalData.length} production data points`);
console.log('\n🚀 Synthetic data insertion completed!');

process.exit(0);
