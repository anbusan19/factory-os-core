import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFactoryStore } from '@/store/useFactoryStore';
import { format } from 'date-fns';

const Orders = () => {
  const factoryOrders = useFactoryStore((s) => s.factoryOrders);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'placed':
        return <Badge variant="secondary">Placed</Badge>;
      case 'in-production':
        return <Badge variant="default">In Production</Badge>;
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">Review manufacturing orders placed with factories</p>
        </div>

        <Card className="glass p-6">
          <h3 className="text-lg font-semibold mb-6">Placed Orders</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factoryOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.id}</TableCell>
                  <TableCell>{o.factoryName}</TableCell>
                  <TableCell>{o.area}</TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell>₹{o.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>₹{o.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{o.leadTimeDays} days</TableCell>
                  <TableCell>{format(o.createdAt, 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell>{getStatusBadge(o.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Orders;


