import { create } from 'zustand';
import { machineApi, workerApi, orderApi, alertApi, productionApi } from '@/lib/api';

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
  status: 'placed' | 'in-transit' | 'out-for-delivery' | 'in-production' | 'completed' | 'cancelled';
  paymentStatus?: 'paid' | 'pending' | 'not-paid';
}

interface ApiState {
  // Data
  machines: Machine[];
  workers: Worker[];
  safetyAlerts: SafetyAlert[];
  systemEvents: SystemEvent[];
  procurementOrders: ProcurementOrder[];
  factoryOrders: FactoryOrder[];
  productionData: any[];
  
  // Loading states
  loading: {
    machines: boolean;
    workers: boolean;
    alerts: boolean;
    events: boolean;
    procurement: boolean;
    factory: boolean;
    production: boolean;
  };
  
  // Error states
  errors: {
    machines: string | null;
    workers: string | null;
    alerts: string | null;
    events: string | null;
    procurement: string | null;
    factory: string | null;
    production: string | null;
  };
  
  // Actions
  fetchMachines: () => Promise<void>;
  fetchWorkers: () => Promise<void>;
  fetchSafetyAlerts: () => Promise<void>;
  fetchSystemEvents: () => Promise<void>;
  fetchProcurementOrders: () => Promise<void>;
  fetchFactoryOrders: () => Promise<void>;
  fetchProductionData: () => Promise<void>;
  fetchAll: () => Promise<void>;
  
  // Update actions
  updateMachine: (id: string, updates: Partial<Machine>) => Promise<void>;
  updateWorker: (id: string, updates: Partial<Worker>) => Promise<void>;
  updateProcurementOrder: (id: string, updates: Partial<ProcurementOrder>) => Promise<void>;
  updateFactoryOrder: (id: string, updates: Partial<FactoryOrder>) => Promise<void>;
}

export const useApiStore = create<ApiState>((set, get) => ({
  // Initial data
  machines: [],
  workers: [],
  safetyAlerts: [],
  systemEvents: [],
  procurementOrders: [],
  factoryOrders: [],
  productionData: [],
  
  // Initial loading states
  loading: {
    machines: false,
    workers: false,
    alerts: false,
    events: false,
    procurement: false,
    factory: false,
    production: false,
  },
  
  // Initial error states
  errors: {
    machines: null,
    workers: null,
    alerts: null,
    events: null,
    procurement: null,
    factory: null,
    production: null,
  },
  
  // Fetch functions
  fetchMachines: async () => {
    set(state => ({ loading: { ...state.loading, machines: true } }));
    try {
      const machines = await machineApi.getAll();
      set({ machines, loading: { ...get().loading, machines: false }, errors: { ...get().errors, machines: null } });
    } catch (error) {
      set({ 
        loading: { ...get().loading, machines: false }, 
        errors: { ...get().errors, machines: error instanceof Error ? error.message : 'Failed to fetch machines' }
      });
    }
  },
  
  fetchWorkers: async () => {
    set(state => ({ loading: { ...state.loading, workers: true } }));
    try {
      const workers = await workerApi.getAll();
      set({ workers, loading: { ...get().loading, workers: false }, errors: { ...get().errors, workers: null } });
    } catch (error) {
      set({ 
        loading: { ...get().loading, workers: false }, 
        errors: { ...get().errors, workers: error instanceof Error ? error.message : 'Failed to fetch workers' }
      });
    }
  },
  
  fetchSafetyAlerts: async () => {
    set(state => ({ loading: { ...state.loading, alerts: true } }));
    try {
      const safetyAlerts = await alertApi.getSafetyAlerts();
      set({ safetyAlerts, loading: { ...get().loading, alerts: false }, errors: { ...get().errors, alerts: null } });
    } catch (error) {
      set({ 
        loading: { ...get().loading, alerts: false }, 
        errors: { ...get().errors, alerts: error instanceof Error ? error.message : 'Failed to fetch safety alerts' }
      });
    }
  },
  
  fetchSystemEvents: async () => {
    set(state => ({ loading: { ...state.loading, events: true } }));
    try {
      const systemEvents = await alertApi.getSystemEvents();
      set({ systemEvents, loading: { ...get().loading, events: false }, errors: { ...get().errors, events: null } });
    } catch (error) {
      set({ 
        loading: { ...get().loading, events: false }, 
        errors: { ...get().errors, events: error instanceof Error ? error.message : 'Failed to fetch system events' }
      });
    }
  },
  
  fetchProcurementOrders: async () => {
    set(state => ({ loading: { ...state.loading, procurement: true } }));
    try {
      const procurementOrders = await orderApi.getProcurementOrders();
      set({ procurementOrders, loading: { ...get().loading, procurement: false }, errors: { ...get().errors, procurement: null } });
    } catch (error) {
      set({ 
        loading: { ...get().loading, procurement: false }, 
        errors: { ...get().errors, procurement: error instanceof Error ? error.message : 'Failed to fetch procurement orders' }
      });
    }
  },
  
  fetchFactoryOrders: async () => {
    set(state => ({ loading: { ...state.loading, factory: true } }));
    try {
      const factoryOrders = await orderApi.getFactoryOrders();
      set({ factoryOrders, loading: { ...get().loading, factory: false }, errors: { ...get().errors, factory: null } });
    } catch (error) {
      set({ 
        loading: { ...get().loading, factory: false }, 
        errors: { ...get().errors, factory: error instanceof Error ? error.message : 'Failed to fetch factory orders' }
      });
    }
  },
  
  fetchProductionData: async () => {
    set(state => ({ loading: { ...state.loading, production: true } }));
    try {
      const productionData = await productionApi.getChartData();
      set({ productionData, loading: { ...get().loading, production: false }, errors: { ...get().errors, production: null } });
    } catch (error) {
      set({ 
        loading: { ...get().loading, production: false }, 
        errors: { ...get().errors, production: error instanceof Error ? error.message : 'Failed to fetch production data' }
      });
    }
  },
  
  fetchAll: async () => {
    const { fetchMachines, fetchWorkers, fetchSafetyAlerts, fetchSystemEvents, fetchProcurementOrders, fetchFactoryOrders, fetchProductionData } = get();
    await Promise.all([
      fetchMachines(),
      fetchWorkers(),
      fetchSafetyAlerts(),
      fetchSystemEvents(),
      fetchProcurementOrders(),
      fetchFactoryOrders(),
      fetchProductionData(),
    ]);
  },
  
  // Update functions
  updateMachine: async (id: string, updates: Partial<Machine>) => {
    try {
      await machineApi.update(id, updates);
      set(state => ({
        machines: state.machines.map(m => m.id === id ? { ...m, ...updates } : m)
      }));
    } catch (error) {
      console.error('Failed to update machine:', error);
    }
  },
  
  updateWorker: async (id: string, updates: Partial<Worker>) => {
    try {
      await workerApi.update(id, updates);
      set(state => ({
        workers: state.workers.map(w => w.id === id ? { ...w, ...updates } : w)
      }));
    } catch (error) {
      console.error('Failed to update worker:', error);
    }
  },
  
  updateProcurementOrder: async (id: string, updates: Partial<ProcurementOrder>) => {
    try {
      await orderApi.updateProcurementOrder(id, updates);
      set(state => ({
        procurementOrders: state.procurementOrders.map(o => o.id === id ? { ...o, ...updates } : o)
      }));
    } catch (error) {
      console.error('Failed to update procurement order:', error);
    }
  },
  
  updateFactoryOrder: async (id: string, updates: Partial<FactoryOrder>) => {
    try {
      await orderApi.updateFactoryOrder(id, updates);
      set(state => ({
        factoryOrders: state.factoryOrders.map(o => o.id === id ? { ...o, ...updates } : o)
      }));
    } catch (error) {
      console.error('Failed to update factory order:', error);
    }
  },
}));
