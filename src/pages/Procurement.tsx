import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFactoryStore } from '@/store/useFactoryStore';
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Procurement = () => {
  const procurementOrders = useFactoryStore((state) => state.procurementOrders);
  const updateProcurementOrder = useFactoryStore((state) => state.updateProcurementOrder);
  const navigate = useNavigate();

  const allDelivered = procurementOrders.length > 0 && procurementOrders.every((o) => o.status === 'delivered');

  // Auto-progress orders from pending -> in-transit -> delivered over time
  useEffect(() => {
    const timeouts: number[] = [];
    procurementOrders.forEach((order, index) => {
      if (order.status === 'pending') {
        // move pending -> in-transit after 2s + stagger
        const t1 = window.setTimeout(() => {
          updateProcurementOrder(order.id, { status: 'in-transit' });
        }, 2000 + index * 800);
        timeouts.push(t1);

        // then in-transit -> delivered after additional 4s
        const t2 = window.setTimeout(() => {
          updateProcurementOrder(order.id, { status: 'delivered' });
        }, 2000 + index * 800 + 4000);
        timeouts.push(t2);
      } else if (order.status === 'in-transit') {
        // in-transit -> delivered after 3s + stagger
        const t = window.setTimeout(() => {
          updateProcurementOrder(order.id, { status: 'delivered' });
        }, 3000 + index * 800);
        timeouts.push(t);
      }
    });

    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const qualityData = [
    { name: 'Passed', value: 847 },
    { name: 'Failed', value: 23 },
  ];

  const COLORS = ['hsl(var(--success))', 'hsl(var(--destructive))'];

  const getQualityDescription = (name: string) => {
    switch (name) {
      case 'Passed':
        return 'Items that cleared inspection and meet quality criteria.';
      case 'Failed':
        return 'Items that did not meet required standards and need review.';
      default:
        return '';
    }
  };

  const QualityTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const entry = payload[0];
    const name = entry?.name ?? label;
    const value = entry?.value ?? 0;
    const percent = entry?.percent != null ? (entry.percent * 100).toFixed(1) : undefined;
    const desc = getQualityDescription(name);
    return (
      <div className="rounded-md border bg-popover p-3 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium">{name}</div>
          {percent && <div className="text-xs text-muted-foreground">{percent}%</div>}
        </div>
        <div className="text-sm">Count: <span className="font-medium">{value}</span></div>
        {desc && <div className="mt-2 text-xs text-muted-foreground">{desc}</div>}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="default">Delivered</Badge>;
      case 'in-transit':
        return <Badge variant="secondary">In Transit</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    // Simple derivation: delivered => paid, pending/in-transit => pending
    switch (status) {
      case 'delivered':
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Procurement & Quality</h1>
          <p className="text-muted-foreground">Material automation and inspection analytics</p>
        </div>

        {allDelivered && (
          <Card className="glass p-4 mb-8 border-success/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-success-foreground hover:bg-success">Received</Badge>
                  <span className="text-sm text-muted-foreground">All procurement orders have been delivered.</span>
                </div>
              </div>
              <Button onClick={() => navigate('/factory-options')} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Choose Factory
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold">{procurementOrders.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {procurementOrders.filter((o) => o.status === 'in-transit').length} in transit
            </p>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pass Rate</p>
                <h3 className="text-3xl font-bold">97.4%</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 text-success flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">+2.3% from last week</p>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Defects</p>
                <h3 className="text-3xl font-bold">23</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">-12 from last week</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-6">Quality Inspection Summary</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<QualityTooltip />} wrapperStyle={{ outline: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border-l-4 border-success">
                <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Batch #B-4521 passed inspection</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">New order from Steel Corp received</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border-l-4 border-warning">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Minor defect detected in batch #B-4519</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="glass p-6">
          <h3 className="text-lg font-semibold mb-6">Procurement Orders</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Part ID</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Delivery ETA</TableHead>
              <TableHead>Payments</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procurementOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{order.partId}</TableCell>
                  <TableCell>{order.material}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{format(order.deliveryEta, 'MMM dd, yyyy')}</TableCell>
                <TableCell>{getPaymentBadge(order.status)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Procurement;
