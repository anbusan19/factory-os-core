import { create } from 'zustand';

export type MachineStatus = 'active' | 'idle' | 'fault' | 'maintenance';
export type WorkerStatus = 'active' | 'on-break' | 'reassigned';

export interface Machine {
  id: string;
  name: string;
  status: MachineStatus;
  workerId?: string;
  position: { x: number; y: number; z: number };
  temperature?: number;
  efficiency?: number;
}

export interface Worker {
  id: string;
  name: string;
  status: WorkerStatus;
  machineId?: string;
  riskIndex: number;
  shift: string;
}

export interface SafetyAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  machineId?: string;
  timestamp: Date;
}

export interface SystemEvent {
  id: string;
  type: 'machine' | 'worker' | 'procurement' | 'quality' | 'system';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
}

export interface ProcurementOrder {
  id: string;
  supplier: string;
  partId: string;
  material: string;
  quantity: number;
  deliveryEta: Date;
  status: 'pending' | 'in-transit' | 'delivered';
}

export interface FactoryOrder {
  id: string;
  factoryId: string;
  factoryName: string;
  area: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  leadTimeDays: number;
  createdAt: Date;
  status: 'placed' | 'in-production' | 'completed' | 'cancelled';
}

interface FactoryState {
  machines: Machine[];
  workers: Worker[];
  safetyAlerts: SafetyAlert[];
  systemEvents: SystemEvent[];
  procurementOrders: ProcurementOrder[];
  factoryOrders: FactoryOrder[];
  
  addMachine: (machine: Machine) => void;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  addSafetyAlert: (alert: SafetyAlert) => void;
  addSystemEvent: (event: SystemEvent) => void;
  addProcurementOrder: (order: ProcurementOrder) => void;
  updateProcurementOrder: (id: string, updates: Partial<ProcurementOrder>) => void;
  addFactoryOrder: (order: FactoryOrder) => void;
}

export const useFactoryStore = create<FactoryState>((set) => ({
  machines: [
    { id: 'M-001', name: 'CNC Mill A', status: 'active', position: { x: -5, y: 0, z: -5 }, workerId: 'W-001', temperature: 72, efficiency: 94 },
    { id: 'M-002', name: 'Lathe B', status: 'idle', position: { x: 5, y: 0, z: -5 }, temperature: 65, efficiency: 87 },
    { id: 'M-003', name: 'Press C', status: 'fault', position: { x: -5, y: 0, z: 5 }, workerId: 'W-003', temperature: 85, efficiency: 42 },
    { id: 'M-004', name: 'Welding Station D', status: 'active', position: { x: 5, y: 0, z: 5 }, workerId: 'W-002', temperature: 78, efficiency: 91 },
    { id: 'M-005', name: 'Assembly Line E', status: 'active', position: { x: 0, y: 0, z: 0 }, workerId: 'W-004', temperature: 70, efficiency: 96 },
  ],
  workers: [
    { id: 'W-001', name: 'John Smith', status: 'active', machineId: 'M-001', riskIndex: 25, shift: 'Morning' },
    { id: 'W-002', name: 'Sarah Johnson', status: 'active', machineId: 'M-004', riskIndex: 18, shift: 'Morning' },
    { id: 'W-003', name: 'Mike Chen', status: 'active', machineId: 'M-003', riskIndex: 62, shift: 'Morning' },
    { id: 'W-004', name: 'Emily Davis', status: 'active', machineId: 'M-005', riskIndex: 15, shift: 'Morning' },
    { id: 'W-005', name: 'David Wilson', status: 'on-break', riskIndex: 8, shift: 'Morning' },
  ],
  safetyAlerts: [
    { id: 'SA-001', type: 'critical', message: 'Machine M-003 temperature exceeds safe limits', machineId: 'M-003', timestamp: new Date() },
    { id: 'SA-002', type: 'warning', message: 'Worker W-003 risk index elevated - monitor closely', timestamp: new Date() },
  ],
  systemEvents: [
    { id: 'E-001', type: 'machine', message: 'M-001 started production cycle', timestamp: new Date(), severity: 'info' },
    { id: 'E-002', type: 'quality', message: 'Inspection passed for batch #B-4521', timestamp: new Date(), severity: 'info' },
    { id: 'E-003', type: 'machine', message: 'M-003 reported fault - maintenance required', timestamp: new Date(), severity: 'critical' },
  ],
  procurementOrders: [
    { id: 'PO-001', supplier: 'Steel Corp', partId: 'P-4512', material: 'Steel Grade A', quantity: 500, deliveryEta: new Date(Date.now() + 86400000 * 2), status: 'in-transit' },
    { id: 'PO-002', supplier: 'Polymer Industries', partId: 'P-2234', material: 'PVC Resin', quantity: 200, deliveryEta: new Date(Date.now() + 86400000 * 5), status: 'pending' },
    { id: 'PO-003', supplier: 'Metal Works Inc', partId: 'P-8891', material: 'Aluminum Alloy', quantity: 350, deliveryEta: new Date(Date.now() + 86400000), status: 'in-transit' },
  ],
  factoryOrders: [],

  addMachine: (machine) => set((state) => ({ machines: [...state.machines, machine] })),
  updateMachine: (id, updates) => set((state) => ({
    machines: state.machines.map((m) => m.id === id ? { ...m, ...updates } : m)
  })),
  addWorker: (worker) => set((state) => ({ workers: [...state.workers, worker] })),
  updateWorker: (id, updates) => set((state) => ({
    workers: state.workers.map((w) => w.id === id ? { ...w, ...updates } : w)
  })),
  addSafetyAlert: (alert) => set((state) => ({ safetyAlerts: [alert, ...state.safetyAlerts].slice(0, 10) })),
  addSystemEvent: (event) => set((state) => ({ systemEvents: [event, ...state.systemEvents].slice(0, 20) })),
  addProcurementOrder: (order) => set((state) => ({ procurementOrders: [...state.procurementOrders, order] })),
  updateProcurementOrder: (id, updates) => set((state) => ({
    procurementOrders: state.procurementOrders.map((o) => o.id === id ? { ...o, ...updates } : o)
  })),
  addFactoryOrder: (order) => set((state) => ({ factoryOrders: [order, ...state.factoryOrders] })),
}));
