import { Layout } from '@/components/layout/Layout';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { EventsFeed } from '@/components/dashboard/EventsFeed';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { useFactoryStore } from '@/store/useFactoryStore';
import { useRealtime } from '@/hooks/useRealtime';
import { Factory, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  useRealtime(); // Enable real-time updates
  
  const machines = useFactoryStore((state) => state.machines);
  const workers = useFactoryStore((state) => state.workers);
  const safetyAlerts = useFactoryStore((state) => state.safetyAlerts);
  const procurementOrders = useFactoryStore((state) => state.procurementOrders);

  const activeMachines = machines.filter((m) => m.status === 'active').length;
  const idleMachines = machines.filter((m) => m.status === 'idle').length;
  const faultyMachines = machines.filter((m) => m.status === 'fault').length;
  const activeWorkers = workers.filter((w) => w.status === 'active').length;
  const activeOrders = procurementOrders.filter((o) => o.status !== 'delivered').length;
  const criticalAlerts = safetyAlerts.filter((a) => a.type === 'critical').length;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manufacturing Command Center</h1>
          <p className="text-muted-foreground">Real-time operational snapshot of your smart factory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Machines Active"
            value={activeMachines}
            subtitle={`${idleMachines} idle, ${faultyMachines} faulty`}
            icon={Factory}
            variant="success"
          />
          <StatusCard
            title="Active Workers"
            value={activeWorkers}
            subtitle={`${workers.length} total workforce`}
            icon={Users}
            variant="default"
          />
          <StatusCard
            title="Active Orders"
            value={activeOrders}
            subtitle={`${procurementOrders.length} total orders`}
            icon={ShoppingCart}
            variant="default"
          />
          <StatusCard
            title="Safety Alerts"
            value={criticalAlerts}
            subtitle={`${safetyAlerts.length} total alerts`}
            icon={AlertTriangle}
            variant={criticalAlerts > 0 ? 'destructive' : 'default'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductionChart />
          </div>
          <div>
            <EventsFeed />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
