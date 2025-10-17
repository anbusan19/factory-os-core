import mongoose from 'mongoose';
import faker from 'faker';
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

// Get scenario from command line arguments
const scenario = process.argv[2] || 'normal';
const clearData = process.argv.includes('--clear') || process.argv.includes('-c');

console.log(`🎯 Starting data generation for scenario: ${scenario}`);
if (clearData) console.log('🧹 Will clear existing data');

// Connect to database
await connectDB();

if (clearData) {
  console.log('🧹 Clearing existing data...');
  await Machine.deleteMany({});
  await Worker.deleteMany({});
  await SafetyAlert.deleteMany({});
  await SystemEvent.deleteMany({});
  await ProcurementOrder.deleteMany({});
  await FactoryOrder.deleteMany({});
  await ProductionData.deleteMany({});
  console.log('✅ Existing data cleared');
}

// Base data generation function
async function generateBaseData(config) {
  const { machineCount, workerCount, alertCount, eventCount, procurementCount, factoryCount, productionDays } = config;
  
  // Generate machines
  console.log('🏭 Creating machines...');
  const machines = [];
  const machineNames = [
    'CNC Mill A', 'Lathe B', 'Press C', 'Welding Station D', 'Assembly Line E',
    'Drill Press F', 'Grinder G', 'Cutter H', 'Injection Molder I', 'Packaging Line J',
    'Quality Control K', 'Testing Station L', 'Calibration Unit M', 'Inspection Line N', 'Final Assembly O'
  ];
  
  const positions = [
    { x: -6, y: 0, z: -6 }, { x: 6, y: 0, z: -6 }, { x: -6, y: 0, z: 6 },
    { x: 6, y: 0, z: 6 }, { x: 0, y: 0, z: 0 }, { x: -4, y: 0, z: -4 },
    { x: 4, y: 0, z: -4 }, { x: -4, y: 0, z: 4 }, { x: -2, y: 0, z: -2 },
    { x: 2, y: 0, z: 2 }, { x: -3, y: 0, z: -3 }, { x: 3, y: 0, z: -3 },
    { x: -3, y: 0, z: 3 }, { x: -1, y: 0, z: -1 }, { x: 1, y: 0, z: 1 }
  ];
  
  for (let i = 0; i < machineCount; i++) {
    const statuses = config.machineStatuses || ['active', 'idle', 'fault', 'maintenance'];
    const status = faker.random.arrayElement(statuses);
    
    machines.push({
      id: `M-${String(i + 1).padStart(3, '0')}`,
      name: machineNames[i] || `Machine ${i + 1}`,
      status,
      position: positions[i] || { x: 0, y: 0, z: 0 },
      temperature: faker.random.number({ min: config.tempRange?.min || 60, max: config.tempRange?.max || 90 }),
      efficiency: faker.random.number({ min: config.efficiencyRange?.min || 70, max: config.efficiencyRange?.max || 98 }),
      lastMaintenance: faker.date.recent(30),
      createdAt: faker.date.past(1),
      updatedAt: new Date()
    });
  }
  
  await Machine.insertMany(machines);
  console.log(`✅ Created ${machines.length} machines`);
  
  // Generate workers
  console.log('👥 Creating workers...');
  const workers = [];
  const departments = ['Production', 'Quality', 'Maintenance', 'Assembly', 'Packaging', 'Safety'];
  const shifts = ['Morning', 'Afternoon', 'Night'];
  
  for (let i = 0; i < workerCount; i++) {
    const statuses = config.workerStatuses || ['active', 'on-break', 'reassigned'];
    const status = faker.random.arrayElement(statuses);
    const department = faker.random.arrayElement(departments);
    const shift = faker.random.arrayElement(shifts);
    
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
      riskIndex: faker.random.number({ min: config.riskRange?.min || 5, max: config.riskRange?.max || 85 }),
      shift,
      department,
      experience: faker.random.number({ min: 1, max: 20 }),
      createdAt: faker.date.past(2),
      updatedAt: new Date()
    });
  }
  
  await Worker.insertMany(workers);
  console.log(`✅ Created ${workers.length} workers`);
  
  // Generate safety alerts
  console.log('⚠️ Creating safety alerts...');
  const safetyAlerts = [];
  const alertTypes = config.alertTypes || ['critical', 'warning', 'info'];
  const alertMessages = config.alertMessages || [
    'Machine temperature exceeds safe limits',
    'Worker risk index elevated - monitor closely',
    'Safety equipment check required',
    'Emergency stop activated',
    'Maintenance schedule overdue',
    'Quality control alert triggered',
    'Environmental conditions outside normal range',
    'Worker fatigue detected'
  ];
  
  for (let i = 0; i < alertCount; i++) {
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
  
  // Generate system events
  console.log('📊 Creating system events...');
  const systemEvents = [];
  const eventTypes = ['machine', 'worker', 'procurement', 'quality', 'system'];
  const eventMessages = config.eventMessages || [
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
  
  for (let i = 0; i < eventCount; i++) {
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
  
  // Generate procurement orders
  console.log('📦 Creating procurement orders...');
  const procurementOrders = [];
  const suppliers = ['Steel Corp', 'Polymer Industries', 'Metal Works Inc', 'Chemical Supply Co', 'Raw Materials Ltd'];
  const materials = ['Steel Grade A', 'PVC Resin', 'Aluminum Alloy', 'Carbon Fiber', 'Titanium', 'Copper Wire', 'Plastic Pellets'];
  
  for (let i = 0; i < procurementCount; i++) {
    const quantity = faker.random.number({ min: 100, max: 1000 });
    const unitPrice = faker.random.number({ min: 10, max: 500, precision: 0.01 });
    const statuses = config.procurementStatuses || ['pending', 'in-transit', 'delivered'];
    const status = faker.random.arrayElement(statuses);
    
    procurementOrders.push({
      id: `PO-${String(i + 1).padStart(3, '0')}`,
      supplier: faker.random.arrayElement(suppliers),
      partId: `P-${faker.random.number({ min: 1000, max: 9999 })}`,
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
  
  // Generate factory orders
  console.log('🏭 Creating factory orders...');
  const factoryOrders = [];
  const factoryNames = ['AutoParts Manufacturing', 'Precision Components Ltd', 'Industrial Solutions Inc', 'Tech Manufacturing Co'];
  const areas = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central Hub'];
  
  for (let i = 0; i < factoryCount; i++) {
    const quantity = faker.random.number({ min: 50, max: 500 });
    const unitPrice = faker.random.number({ min: 25, max: 200, precision: 0.01 });
    const statuses = config.factoryStatuses || ['placed', 'in-transit', 'out-for-delivery', 'in-production', 'completed'];
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
      leadTimeDays: faker.random.number({ min: 3, max: 14 }),
      status,
      paymentStatus,
      createdAt: faker.date.past(60),
      updatedAt: new Date()
    });
  }
  
  await FactoryOrder.insertMany(factoryOrders);
  console.log(`✅ Created ${factoryOrders.length} factory orders`);
  
  // Generate production data
  console.log('📈 Creating production data...');
  const productionData = [];
  const shifts = ['Morning', 'Afternoon', 'Night'];
  
  for (let day = 0; day < productionDays; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(Date.now() - (productionDays - 1 - day) * 24 * 60 * 60 * 1000 - (23 - hour) * 60 * 60 * 1000);
      const shift = shifts[Math.floor(hour / 8)];
      
      let baseProduction = config.baseProduction || 60;
      if (shift === 'Morning') baseProduction = config.morningProduction || 80;
      else if (shift === 'Afternoon') baseProduction = config.afternoonProduction || 70;
      else baseProduction = config.nightProduction || 40;
      
      const production = faker.random.number({ 
        min: Math.max(10, baseProduction - 20), 
        max: baseProduction + 20 
      });
      
      productionData.push({
        timestamp,
        production,
        defects: faker.random.number({ min: 0, max: Math.max(1, Math.floor(production * 0.1)) }),
        efficiency: faker.random.number({ min: config.efficiencyRange?.min || 75, max: config.efficiencyRange?.max || 98 }),
        qualityScore: faker.random.number({ min: 90, max: 100 }),
        machineId: faker.random.arrayElement(machines).id,
        shift,
        createdAt: timestamp
      });
    }
  }
  
  await ProductionData.insertMany(productionData);
  console.log(`✅ Created ${productionData.length} production data points`);
  
  return { machines, workers, safetyAlerts, systemEvents, procurementOrders, factoryOrders, productionData };
}

// Scenario configurations
const scenarios = {
  normal: {
    machineCount: 10,
    workerCount: 15,
    alertCount: 15,
    eventCount: 25,
    procurementCount: 8,
    factoryCount: 6,
    productionDays: 7,
    machineStatuses: ['active', 'idle', 'fault', 'maintenance'],
    workerStatuses: ['active', 'on-break', 'reassigned'],
    alertTypes: ['critical', 'warning', 'info'],
    procurementStatuses: ['pending', 'in-transit', 'delivered'],
    factoryStatuses: ['placed', 'in-transit', 'out-for-delivery', 'in-production', 'completed'],
    tempRange: { min: 60, max: 90 },
    efficiencyRange: { min: 70, max: 98 },
    riskRange: { min: 5, max: 85 },
    baseProduction: 60,
    morningProduction: 80,
    afternoonProduction: 70,
    nightProduction: 40
  },
  
  highPerformance: {
    machineCount: 12,
    workerCount: 20,
    alertCount: 5,
    eventCount: 20,
    procurementCount: 10,
    factoryCount: 8,
    productionDays: 7,
    machineStatuses: ['active', 'idle'],
    workerStatuses: ['active', 'on-break'],
    alertTypes: ['info', 'warning'],
    procurementStatuses: ['delivered', 'in-transit'],
    factoryStatuses: ['completed', 'in-production'],
    tempRange: { min: 65, max: 75 },
    efficiencyRange: { min: 90, max: 98 },
    riskRange: { min: 5, max: 35 },
    baseProduction: 80,
    morningProduction: 95,
    afternoonProduction: 85,
    nightProduction: 70
  },
  
  struggling: {
    machineCount: 8,
    workerCount: 12,
    alertCount: 25,
    eventCount: 30,
    procurementCount: 6,
    factoryCount: 4,
    productionDays: 7,
    machineStatuses: ['fault', 'maintenance', 'idle'],
    workerStatuses: ['reassigned', 'on-break'],
    alertTypes: ['critical', 'warning'],
    procurementStatuses: ['pending', 'cancelled'],
    factoryStatuses: ['cancelled', 'placed'],
    tempRange: { min: 80, max: 95 },
    efficiencyRange: { min: 40, max: 70 },
    riskRange: { min: 60, max: 95 },
    baseProduction: 30,
    morningProduction: 40,
    afternoonProduction: 35,
    nightProduction: 20
  },
  
  startup: {
    machineCount: 5,
    workerCount: 8,
    alertCount: 3,
    eventCount: 10,
    procurementCount: 4,
    factoryCount: 2,
    productionDays: 3,
    machineStatuses: ['active', 'idle'],
    workerStatuses: ['active'],
    alertTypes: ['info'],
    procurementStatuses: ['pending', 'in-transit'],
    factoryStatuses: ['placed', 'in-production'],
    tempRange: { min: 65, max: 80 },
    efficiencyRange: { min: 60, max: 85 },
    riskRange: { min: 10, max: 50 },
    baseProduction: 40,
    morningProduction: 50,
    afternoonProduction: 45,
    nightProduction: 30
  }
};

// Generate data based on scenario
const config = scenarios[scenario] || scenarios.normal;
console.log(`📋 Using configuration for scenario: ${scenario}`);

const result = await generateBaseData(config);

console.log('\n🎉 Data generation completed successfully!');
console.log(`📊 Summary for ${scenario} scenario:`);
console.log(`   • ${result.machines.length} machines`);
console.log(`   • ${result.workers.length} workers`);
console.log(`   • ${result.safetyAlerts.length} safety alerts`);
console.log(`   • ${result.systemEvents.length} system events`);
console.log(`   • ${result.procurementOrders.length} procurement orders`);
console.log(`   • ${result.factoryOrders.length} factory orders`);
console.log(`   • ${result.productionData.length} production data points`);
console.log('\n🚀 Data generation completed!');

process.exit(0);
