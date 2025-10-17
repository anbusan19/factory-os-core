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

// Connect to database
await connectDB();

console.log('🎯 Starting data scenario generation...');

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

// Scenario 1: High Production Efficiency Factory
console.log('🏭 Creating high-efficiency factory scenario...');
const highEfficiencyMachines = [];
const machineNames = [
  'Precision CNC Mill A', 'Advanced Lathe B', 'High-Speed Press C', 
  'Automated Welding Station D', 'Smart Assembly Line E', 'Precision Drill F',
  'Automated Grinder G', 'Laser Cutter H', '3D Printer I', 'Quality Control Station J'
];

const positions = [
  { x: -6, y: 0, z: -6 }, { x: 6, y: 0, z: -6 }, { x: -6, y: 0, z: 6 },
  { x: 6, y: 0, z: 6 }, { x: 0, y: 0, z: 0 }, { x: -4, y: 0, z: -4 },
  { x: 4, y: 0, z: -4 }, { x: -4, y: 0, z: 4 }, { x: -2, y: 0, z: -2 },
  { x: 2, y: 0, z: 2 }
];

for (let i = 0; i < machineNames.length; i++) {
  const statuses = ['active', 'idle'];
  const status = faker.random.arrayElement(statuses);
  
  highEfficiencyMachines.push({
    id: `M-${String(i + 1).padStart(3, '0')}`,
    name: machineNames[i],
    status,
    position: positions[i],
    temperature: faker.random.number({ min: 65, max: 75 }), // Lower, more efficient
    efficiency: faker.random.number({ min: 90, max: 98 }), // High efficiency
    lastMaintenance: faker.date.recent(7), // Recent maintenance
    createdAt: faker.date.past(1),
    updatedAt: new Date()
  });
}

await Machine.insertMany(highEfficiencyMachines);
console.log(`✅ Created ${highEfficiencyMachines.length} high-efficiency machines`);

// Scenario 2: Experienced Workforce
console.log('👥 Creating experienced workforce...');
const experiencedWorkers = [];
const departments = ['Production', 'Quality', 'Maintenance', 'Assembly', 'Packaging'];
const shifts = ['Morning', 'Afternoon', 'Night'];
const skills = ['CNC Operation', 'Quality Control', 'Maintenance', 'Assembly', 'Welding', 'Packaging', 'Programming', 'Troubleshooting'];

for (let i = 0; i < 20; i++) {
  const statuses = ['active', 'on-break'];
  const status = faker.random.arrayElement(statuses);
  const department = faker.random.arrayElement(departments);
  const shift = faker.random.arrayElement(shifts);
  
  // Assign machine based on department
  let machineId = null;
  if (status === 'active' && department === 'Production') {
    const availableMachines = highEfficiencyMachines.filter(m => m.status === 'active');
    if (availableMachines.length > 0) {
      machineId = faker.random.arrayElement(availableMachines).id;
    }
  }
  
  experiencedWorkers.push({
    id: `W-${String(i + 1).padStart(3, '0')}`,
    name: faker.name.findName(),
    status,
    machineId,
    riskIndex: faker.random.number({ min: 5, max: 35 }), // Lower risk for experienced workers
    shift,
    department,
    experience: faker.random.number({ min: 3, max: 25 }), // More experienced
    skills: faker.random.arrayElements(skills, faker.random.number({ min: 2, max: 5 })),
    createdAt: faker.date.past(3),
    updatedAt: new Date()
  });
}

await Worker.insertMany(experiencedWorkers);
console.log(`✅ Created ${experiencedWorkers.length} experienced workers`);

// Scenario 3: Minimal Safety Issues
console.log('⚠️ Creating minimal safety alerts...');
const minimalSafetyAlerts = [];
const alertTypes = ['info', 'warning']; // Mostly info and warnings
const alertMessages = [
  'Routine safety equipment check completed',
  'Worker training session scheduled',
  'Safety protocol reminder sent',
  'Equipment inspection due soon',
  'Safety meeting scheduled',
  'PPE inventory check completed',
  'Safety signage updated',
  'Emergency drill scheduled'
];

for (let i = 0; i < 8; i++) {
  const alertType = faker.random.arrayElement(alertTypes);
  const severity = alertType === 'warning' ? 'medium' : 'low';
  
  minimalSafetyAlerts.push({
    id: `SA-${String(i + 1).padStart(3, '0')}`,
    type: alertType,
    message: faker.random.arrayElement(alertMessages),
    machineId: faker.random.arrayElement(highEfficiencyMachines).id,
    workerId: faker.random.arrayElement(experiencedWorkers).id,
    severity,
    resolved: faker.random.boolean() && faker.random.number({ min: 1, max: 10 }) > 2, // Mostly resolved
    timestamp: faker.date.recent(3),
    createdAt: faker.date.recent(3)
  });
}

await SafetyAlert.insertMany(minimalSafetyAlerts);
console.log(`✅ Created ${minimalSafetyAlerts.length} minimal safety alerts`);

// Scenario 4: Positive System Events
console.log('📊 Creating positive system events...');
const positiveSystemEvents = [];
const eventTypes = ['machine', 'worker', 'quality', 'system'];
const positiveMessages = [
  'Machine efficiency improved after calibration',
  'Quality control process completed successfully',
  'Production target exceeded for the day',
  'Worker performance review completed - excellent rating',
  'System backup completed successfully',
  'New safety protocol implemented',
  'Machine maintenance completed ahead of schedule',
  'Quality inspection passed with flying colors',
  'Worker training completed successfully',
  'Production line optimized for better performance',
  'Safety equipment upgraded',
  'Worker recognition program launched',
  'Quality metrics improved significantly',
  'Machine uptime increased',
  'Worker satisfaction survey completed'
];

for (let i = 0; i < 20; i++) {
  const eventType = faker.random.arrayElement(eventTypes);
  const severity = 'info'; // Mostly positive info events
  
  positiveSystemEvents.push({
    id: `E-${String(i + 1).padStart(3, '0')}`,
    type: eventType,
    message: faker.random.arrayElement(positiveMessages),
    severity,
    machineId: eventType === 'machine' ? faker.random.arrayElement(highEfficiencyMachines).id : null,
    workerId: eventType === 'worker' ? faker.random.arrayElement(experiencedWorkers).id : null,
    timestamp: faker.date.recent(3),
    createdAt: faker.date.recent(3)
  });
}

await SystemEvent.insertMany(positiveSystemEvents);
console.log(`✅ Created ${positiveSystemEvents.length} positive system events`);

// Scenario 5: Successful Procurement Orders
console.log('📦 Creating successful procurement orders...');
const successfulProcurementOrders = [];
const suppliers = [
  'Premium Steel Corp', 'Quality Polymer Industries', 'Reliable Metal Works', 
  'Advanced Chemical Supply', 'Elite Raw Materials Ltd', 'Precision Components Inc'
];
const materials = [
  'Premium Steel Grade A', 'High-Quality PVC Resin', 'Aerospace Aluminum Alloy', 
  'Carbon Fiber Composite', 'Titanium Grade 5', 'Copper Wire Premium',
  'Stainless Steel 316', 'Brass Rods Precision', 'Rubber Sheets Industrial',
  'Ceramic Components Advanced'
];

for (let i = 0; i < 10; i++) {
  const quantity = faker.random.number({ min: 200, max: 1500 });
  const unitPrice = faker.random.number({ min: 15, max: 300, precision: 0.01 });
  const statuses = ['delivered', 'in-transit']; // Mostly successful orders
  const status = faker.random.arrayElement(statuses);
  
  successfulProcurementOrders.push({
    id: `PO-${String(i + 1).padStart(3, '0')}`,
    supplier: faker.random.arrayElement(suppliers),
    partId: `P-${faker.random.number({ min: 1000, max: 9999 })}`,
    material: faker.random.arrayElement(materials),
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    deliveryEta: faker.date.future(7),
    status,
    qualityScore: faker.random.number({ min: 95, max: 100 }), // High quality
    createdAt: faker.date.past(30),
    updatedAt: new Date()
  });
}

await ProcurementOrder.insertMany(successfulProcurementOrders);
console.log(`✅ Created ${successfulProcurementOrders.length} successful procurement orders`);

// Scenario 6: Completed Factory Orders
console.log('🏭 Creating completed factory orders...');
const completedFactoryOrders = [];
const factoryNames = [
  'Elite AutoParts Manufacturing', 'Precision Components Ltd', 'Advanced Industrial Solutions', 
  'Tech Manufacturing Excellence', 'Quality Production Systems', 'Superior Components Inc'
];
const areas = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central Hub', 'Production Floor A'];

for (let i = 0; i < 8; i++) {
  const quantity = faker.random.number({ min: 100, max: 800 });
  const unitPrice = faker.random.number({ min: 30, max: 400, precision: 0.01 });
  const statuses = ['completed', 'in-production']; // Mostly completed or in production
  const status = faker.random.arrayElement(statuses);
  const paymentStatus = status === 'completed' ? 'paid' : 'pending';
  
  completedFactoryOrders.push({
    id: `FO-${String(i + 1).padStart(3, '0')}`,
    factoryId: `F-${String(i + 1).padStart(3, '0')}`,
    factoryName: faker.random.arrayElement(factoryNames),
    area: faker.random.arrayElement(areas),
    unitPrice,
    quantity,
    totalPrice: quantity * unitPrice,
    leadTimeDays: faker.random.number({ min: 5, max: 14 }),
    status,
    paymentStatus,
    createdAt: faker.date.past(45),
    updatedAt: new Date()
  });
}

await FactoryOrder.insertMany(completedFactoryOrders);
console.log(`✅ Created ${completedFactoryOrders.length} completed factory orders`);

// Scenario 7: High-Performance Production Data
console.log('📈 Creating high-performance production data...');
const highPerformanceData = [];
const shifts = ['Morning', 'Afternoon', 'Night'];

// Generate data for the last 7 days with high performance
for (let day = 0; day < 7; day++) {
  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date(Date.now() - (6 - day) * 24 * 60 * 60 * 1000 - (23 - hour) * 60 * 60 * 1000);
    const shift = shifts[Math.floor(hour / 8)];
    
    // High production with low defects
    let baseProduction = 80;
    if (shift === 'Morning') baseProduction = 95;
    else if (shift === 'Afternoon') baseProduction = 85;
    else baseProduction = 70;
    
    const production = faker.random.number({ 
      min: baseProduction - 10, 
      max: baseProduction + 15 
    });
    
    highPerformanceData.push({
      timestamp,
      production,
      defects: faker.random.number({ min: 0, max: 2 }), // Very low defects
      efficiency: faker.random.number({ min: 90, max: 98 }), // High efficiency
      qualityScore: faker.random.number({ min: 95, max: 100 }), // High quality
      machineId: faker.random.arrayElement(highEfficiencyMachines).id,
      shift,
      createdAt: timestamp
    });
  }
}

await ProductionData.insertMany(highPerformanceData);
console.log(`✅ Created ${highPerformanceData.length} high-performance production data points`);

// Generate additional historical data showing improvement over time
console.log('📊 Creating historical improvement data...');
const historicalImprovementData = [];

// Generate monthly data for the past 6 months showing improvement
for (let month = 0; month < 6; month++) {
  const monthDate = new Date();
  monthDate.setMonth(monthDate.getMonth() - (5 - month));
  
  for (let day = 1; day <= 28; day += 7) {
    const timestamp = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    
    // Show improvement over time (earlier months have lower performance)
    const improvementFactor = (month + 1) / 6; // 0.17 to 1.0
    const baseProduction = 600 + (improvementFactor * 400); // 600 to 1000
    const baseEfficiency = 75 + (improvementFactor * 20); // 75 to 95
    const baseQuality = 80 + (improvementFactor * 15); // 80 to 95
    
    historicalImprovementData.push({
      timestamp,
      production: faker.random.number({ 
        min: Math.floor(baseProduction * 0.9), 
        max: Math.floor(baseProduction * 1.1) 
      }),
      defects: faker.random.number({ 
        min: 0, 
        max: Math.max(1, Math.floor(20 * (1 - improvementFactor))) 
      }),
      efficiency: faker.random.number({ 
        min: Math.floor(baseEfficiency - 5), 
        max: Math.floor(baseEfficiency + 5) 
      }),
      qualityScore: faker.random.number({ 
        min: Math.floor(baseQuality - 5), 
        max: Math.floor(baseQuality + 5) 
      }),
      machineId: faker.random.arrayElement(highEfficiencyMachines).id,
      shift: faker.random.arrayElement(shifts),
      createdAt: timestamp
    });
  }
}

await ProductionData.insertMany(historicalImprovementData);
console.log(`✅ Created ${historicalImprovementData.length} historical improvement data points`);

console.log('\n🎉 High-performance factory scenario created successfully!');
console.log(`📊 Summary:`);
console.log(`   • ${highEfficiencyMachines.length} high-efficiency machines`);
console.log(`   • ${experiencedWorkers.length} experienced workers`);
console.log(`   • ${minimalSafetyAlerts.length} minimal safety alerts`);
console.log(`   • ${positiveSystemEvents.length} positive system events`);
console.log(`   • ${successfulProcurementOrders.length} successful procurement orders`);
console.log(`   • ${completedFactoryOrders.length} completed factory orders`);
console.log(`   • ${highPerformanceData.length + historicalImprovementData.length} production data points`);
console.log('\n🚀 High-performance factory scenario completed!');

process.exit(0);
