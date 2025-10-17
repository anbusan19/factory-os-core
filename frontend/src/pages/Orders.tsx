import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useApiStore } from '@/store/useApiStore';
import { format, addDays } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const Orders = () => {
  const { factoryOrders, fetchFactoryOrders, updateFactoryOrder, loading } = useApiStore();
  
  useEffect(() => {
    fetchFactoryOrders();
  }, [fetchFactoryOrders]);

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

  const getPaymentBadge = (paymentStatus?: 'paid' | 'pending' | 'not-paid') => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case 'not-paid':
        return <Badge variant="destructive">Not Paid</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };


  // Auto-advance placed -> in-transit (10s) -> out-for-delivery (+20s) -> completed (+45s)
  useEffect(() => {
    const timers: number[] = [];
    factoryOrders.forEach((o, idx) => {
      if (o.status === 'placed') {
        const t = window.setTimeout(() => {
          updateFactoryOrder(o.id, { status: 'in-transit' as any });
          // chain transitions
          const t2 = window.setTimeout(() => {
            updateFactoryOrder(o.id, { status: 'out-for-delivery' as any });
            const t3 = window.setTimeout(() => {
              updateFactoryOrder(o.id, { status: 'completed' as any });
            }, 45000);
            timers.push(t3);
          }, 20000);
          timers.push(t2);
        }, 10000 + idx * 200);
        timers.push(t);
      }
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [factoryOrders, updateFactoryOrder]);

  const [trackingFor, setTrackingFor] = useState<string | null>(null);
  const activeOrder = useMemo(() => factoryOrders.find((o) => o.id === trackingFor) || null, [factoryOrders, trackingFor]);

  const trackingEvents = useMemo(() => {
    if (!activeOrder) return [] as { label: string; date: Date; done: boolean }[];
    const placedDate = activeOrder.createdAt;
    const shippedDate = addDays(placedDate, Math.max(1, Math.floor(Math.random() * 2)));
    const outForDeliveryDate = addDays(placedDate, Math.max(2, Math.floor(Math.random() * 3)));
    const deliveredDate = addDays(placedDate, activeOrder.leadTimeDays);
    return [
      { label: 'Order placed', date: placedDate, done: true },
      { label: 'In transit', date: shippedDate, done: ['in-transit', 'out-for-delivery', 'in-production', 'completed'].includes(activeOrder.status as any) },
      { label: 'Out for delivery', date: outForDeliveryDate, done: ['out-for-delivery', 'in-production', 'completed'].includes(activeOrder.status as any) },
      { label: 'Delivered', date: deliveredDate, done: activeOrder.status === 'completed' },
    ];
  }, [activeOrder]);

  // Dialog progress bar state (0..1 across total timeline of 10s + 20s + 45s)
  const [progressNow, setProgressNow] = useState<number>(0);
  useEffect(() => {
    if (!trackingFor) return;
    let elapsed = 0;
    const totalMs = 10000 + 20000 + 45000;
    const tick = window.setInterval(() => {
      elapsed += 1000;
      setProgressNow(Math.min(1, elapsed / totalMs));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [trackingFor]);

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
              <TableHead>Payments</TableHead>
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
                <TableCell>{getPaymentBadge(o.paymentStatus)}</TableCell>
                  <TableCell>
                    <button className="underline underline-offset-4" onClick={() => setTrackingFor(o.id)}>
                      {getStatusBadge(o.status)}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Dialog open={!!trackingFor} onOpenChange={(open) => !open && setTrackingFor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Tracking</DialogTitle>
              <DialogDescription>Tracking details for order {activeOrder?.id}</DialogDescription>
            </DialogHeader>
            {activeOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {trackingEvents.map((ev, i) => {
                    const segmentCount = trackingEvents.length - 1;
                    const segmentProgress = progressNow * segmentCount; // 0..segmentCount
                    const isLast = i === trackingEvents.length - 1;
                    // First circle (Placed) is green immediately; others turn green after line reaches them
                    const circleFilled = i === 0 || segmentProgress >= i;
                    // Current segment is the connector from i -> i+1
                    const segmentFill = Math.min(1, Math.max(0, segmentProgress - i));

                    return (
                      <div key={i} className="relative">
                        <div className="flex items-start gap-3">
                          <div className="relative flex flex-col items-center">
                            <div className={`h-3 w-3 rounded-full ${circleFilled ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                            {!isLast && (
                              <div className="relative mt-2 w-[2px] h-8 rounded bg-muted overflow-hidden">
                                <div className="absolute left-0 top-0 w-[2px] bg-success transition-all" style={{ height: `${segmentFill * 100}%` }} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{ev.label}</div>
                            <div className="text-xs text-muted-foreground">{format(ev.date, 'MMM dd, yyyy')}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Orders;


