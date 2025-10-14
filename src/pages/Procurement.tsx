import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFactoryStore } from '@/store/useFactoryStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Procurement = () => {
  const procurementOrders = useFactoryStore((state) => state.procurementOrders);

  const qualityData = [
    { name: 'Passed', value: 847 },
    { name: 'Failed', value: 23 },
  ];

  const COLORS = ['hsl(var(--success))', 'hsl(var(--destructive))'];

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

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Procurement & Quality</h1>
          <p className="text-muted-foreground">Material automation and inspection analytics</p>
        </div>

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
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
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
