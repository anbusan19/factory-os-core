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

// Connect to database
await connectDB();

// Clear existing data
await Machine.deleteMany({});
await Worker.deleteMany({});
await SafetyAlert.deleteMany({});
await SystemEvent.deleteMany({});
await ProcurementOrder.deleteMany({});
await FactoryOrder.deleteMany({});
await ProductionData.deleteMany({});

console.log('Cleared existing data...');

// Generate synthetic machines
const machines = [];
const machineNames = ['CNC Mill A', 'Lathe B', 'Press C', 'Welding Station D', 'Assembly Line E', 'Drill Press F', 'Grinder G', 'Cutter H'];
const positions = [
  { x: -5, y: 0, z: -5 }, { x: 5, y: 0, z: -5 }, { x: -5, y: 0, z: 5 },
  { x: 5, y: 0, z: 5 }, { x: 0, y: 0, z: 0 }, { x: -3, y: 0, z: -3 },
  { x: 3, y: 0, z: -3 }, { x: -3, y: 0, z: 3 }
];

for (let i = 0; i < 8; i++) {
  const statuses = ['active', 'idle', 'fault', 'maintenance'];
  const status = faker.helpers.arrayElement(statuses);
  
  machines.push({
    id: `M-${String(i + 1).padStart(3, '0')}`,
    name: machineNames[i],
    status,
    position: positions[i],
    temperature: faker.number.int({ min: 60, max: 90 }),
    efficiency: faker.number.int({ min: 70, max: 98 }),
    lastMaintenance: faker.date.recent({ days: 30 })
  });
}

await Machine.insertMany(machines);
console.log('Created machines...');

// Generate synthetic workers
const workers = [];
const firstNames = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Robert', 'Jennifer', 'Michael', 'Jessica'];
const lastNames = ['Smith', 'Johnson', 'Chen', 'Davis', 'Wilson', 'Brown', 'Miller', 'Garcia', 'Martinez', 'Anderson'];

for (let i = 0; i < 10; i++) {
  const statuses = ['active', 'on-break', 'reassigned'];
  const shifts = ['Morning', 'Afternoon', 'Night'];
  const departments = ['Production', 'Quality', 'Maintenance', 'Assembly'];
  
  workers.push({
    id: `W-${String(i + 1).padStart(3, '0')}`,
    name: `${faker.helpers.arrayElement(firstNames)} ${faker.helpers.arrayElement(lastNames)}`,
    status: faker.helpers.arrayElement(statuses),
    machineId: i < 8 ? machines[i].id : null,
    riskIndex: faker.number.int({ min: 5, max: 85 }),
    shift: faker.helpers.arrayElement(shifts),
    department: faker.helpers.arrayElement(departments),
    experience: faker.number.int({ min: 1, max: 15 })
  });
}

await Worker.insertMany(workers);
console.log('Created workers...');

// Generate synthetic safety alerts
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
  'Worker fatigue detected'
];

for (let i = 0; i < 15; i++) {
  safetyAlerts.push({
    id: `SA-${String(i + 1).padStart(3, '0')}`,
    type: faker.helpers.arrayElement(alertTypes),
    message: faker.helpers.arrayElement(alertMessages),
    machineId: faker.helpers.arrayElement(machines).id,
    workerId: faker.helpers.arrayElement(workers).id,
    severity: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    resolved: faker.datatype.boolean({ probability: 0.3 }),
    timestamp: faker.date.recent({ days: 7 })
  });
}

await SafetyAlert.insertMany(safetyAlerts);
console.log('Created safety alerts...');

// Generate synthetic system events
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
  'Quality alert resolved'
];

for (let i = 0; i < 25; i++) {
  systemEvents.push({
    id: `E-${String(i + 1).padStart(3, '0')}`,
    type: faker.helpers.arrayElement(eventTypes),
    message: faker.helpers.arrayElement(eventMessages),
    severity: faker.helpers.arrayElement(['info', 'warning', 'critical']),
    machineId: faker.helpers.arrayElement(machines).id,
    workerId: faker.helpers.arrayElement(workers).id,
    timestamp: faker.date.recent({ days: 3 })
  });
}

await SystemEvent.insertMany(systemEvents);
console.log('Created system events...');

// Generate synthetic procurement orders
const procurementOrders = [];
const suppliers = ['Steel Corp', 'Polymer Industries', 'Metal Works Inc', 'Chemical Supply Co', 'Raw Materials Ltd'];
const materials = ['Steel Grade A', 'PVC Resin', 'Aluminum Alloy', 'Carbon Fiber', 'Titanium', 'Copper Wire', 'Plastic Pellets'];
const partIds = ['P-4512', 'P-2234', 'P-8891', 'P-1234', 'P-5678', 'P-9012', 'P-3456'];

for (let i = 0; i < 8; i++) {
  const quantity = faker.number.int({ min: 100, max: 1000 });
  const unitPrice = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
  const statuses = ['pending', 'in-transit', 'delivered'];
  
  procurementOrders.push({
    id: `PO-${String(i + 1).padStart(3, '0')}`,
    supplier: faker.helpers.arrayElement(suppliers),
    partId: faker.helpers.arrayElement(partIds),
    material: faker.helpers.arrayElement(materials),
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    deliveryEta: faker.date.future({ days: 10 }),
    status: faker.helpers.arrayElement(statuses),
    qualityScore: faker.number.int({ min: 85, max: 100 })
  });
}

await ProcurementOrder.insertMany(procurementOrders);
console.log('Created procurement orders...');

// Generate synthetic factory orders
const factoryOrders = [];
const factoryNames = ['AutoParts Manufacturing', 'Precision Components Ltd', 'Industrial Solutions Inc', 'Tech Manufacturing Co'];
const areas = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central Hub'];

for (let i = 0; i < 6; i++) {
  const quantity = faker.number.int({ min: 50, max: 500 });
  const unitPrice = faker.number.float({ min: 25, max: 200, fractionDigits: 2 });
  const statuses = ['placed', 'in-transit', 'out-for-delivery', 'in-production', 'completed'];
  const paymentStatuses = ['paid', 'pending', 'not-paid'];
  
  factoryOrders.push({
    id: `FO-${String(i + 1).padStart(3, '0')}`,
    factoryId: `F-${String(i + 1).padStart(3, '0')}`,
    factoryName: faker.helpers.arrayElement(factoryNames),
    area: faker.helpers.arrayElement(areas),
    unitPrice,
    quantity,
    totalPrice: quantity * unitPrice,
    leadTimeDays: faker.number.int({ min: 3, max: 14 }),
    status: faker.helpers.arrayElement(statuses),
    paymentStatus: faker.helpers.arrayElement(paymentStatuses),
    createdAt: faker.date.recent({ days: 10 })
  });
}

await FactoryOrder.insertMany(factoryOrders);
console.log('Created factory orders...');

// Generate synthetic production data
const productionData = [];
const shifts = ['Morning', 'Afternoon', 'Night'];

// Generate data for the last 24 hours
for (let i = 0; i < 24; i++) {
  const timestamp = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
  const shift = shifts[Math.floor(i / 8)];
  
  productionData.push({
    timestamp,
    production: faker.number.int({ min: 40, max: 100 }),
    defects: faker.number.int({ min: 0, max: 8 }),
    efficiency: faker.number.int({ min: 75, max: 98 }),
    qualityScore: faker.number.int({ min: 90, max: 100 }),
    machineId: faker.helpers.arrayElement(machines).id,
    shift
  });
}

await ProductionData.insertMany(productionData);
console.log('Created production data...');

console.log('Database seeded successfully!');
console.log(`Created ${machines.length} machines`);
console.log(`Created ${workers.length} workers`);
console.log(`Created ${safetyAlerts.length} safety alerts`);
console.log(`Created ${systemEvents.length} system events`);
console.log(`Created ${procurementOrders.length} procurement orders`);
console.log(`Created ${factoryOrders.length} factory orders`);
console.log(`Created ${productionData.length} production data points`);

process.exit(0);
