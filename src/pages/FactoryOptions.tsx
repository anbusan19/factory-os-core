import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useFactoryStore } from '@/store/useFactoryStore';
import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

type FactoryOption = {
  id: string;
  name: string;
  pricePerUnit: number;
  qualityScore: number; // 0-100
  area: string; // location/region
  leadTimeDays: number;
};

const factoryOptions: FactoryOption[] = [
  { id: 'F-001', name: 'Alpha Manufacturing', pricePerUnit: 12.4, qualityScore: 92, area: 'Chennai, IN', leadTimeDays: 6 },
  { id: 'F-002', name: 'Beta Fabricators', pricePerUnit: 10.9, qualityScore: 85, area: 'Coimbatore, IN', leadTimeDays: 4 },
  { id: 'F-003', name: 'Gamma Industrial Works', pricePerUnit: 14.2, qualityScore: 97, area: 'Hyderabad, IN', leadTimeDays: 5 },
  { id: 'F-004', name: 'Delta Precision', pricePerUnit: 11.5, qualityScore: 89, area: 'Bengaluru, IN', leadTimeDays: 7 },
];

const QualityBadge = ({ score }: { score: number }) => {
  const tone = score >= 95 ? 'success' : score >= 85 ? 'primary' : 'secondary';
  return <Badge className={`capitalize ${tone === 'success' ? 'bg-success text-success-foreground' : tone === 'primary' ? 'bg-primary text-primary-foreground' : ''}`}>Quality {score}</Badge>;
};

const FactoryOptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FactoryOption | null>(null);
  const [quantity, setQuantity] = useState<number>(100);
  const addFactoryOrder = useFactoryStore((s) => s.addFactoryOrder);

  const salesData = useMemo(() => (
    Array.from({ length: 12 }).map((_, i) => ({
      month: new Date(2024, i, 1).toLocaleString('en-US', { month: 'short' }),
      sales: Math.round(120 + Math.random() * 80),
      returns: Math.round(5 + Math.random() * 10)
    }))
  ), []);

  const qualityData = useMemo(() => (
    Array.from({ length: 10 }).map((_, i) => ({
      batch: `B-${4500 + i}`,
      score: Math.round(80 + Math.random() * 20)
    }))
  ), []);

  const onSelectFactory = (f: FactoryOption) => {
    setSelected(f);
    setOpen(true);
  };

  const placeOrder = async () => {
    if (!selected) return;
    toast({ title: 'Starting checks', description: 'Validating capacity and quality assurances...' });
    await new Promise((r) => setTimeout(r, 1200));
    toast({ title: 'Capacity confirmed', description: `${selected.name} can fulfill the order.` });
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: 'Quality checks', description: 'Reviewing historical scores and defect rates...' });
    await new Promise((r) => setTimeout(r, 1200));
    toast({ title: 'Pricing locked', description: `₹${selected.pricePerUnit.toFixed(2)} per unit.` });
    await new Promise((r) => setTimeout(r, 800));
    const id = `FO-${Date.now()}`;
    addFactoryOrder({
      id,
      factoryId: selected.id,
      factoryName: selected.name,
      area: selected.area,
      unitPrice: selected.pricePerUnit,
      quantity,
      totalPrice: quantity * selected.pricePerUnit,
      leadTimeDays: selected.leadTimeDays,
      createdAt: new Date(),
      status: 'placed'
    });
    toast({ title: 'Order placed', description: `Order ${id} placed with ${selected.name}` });
    setOpen(false);
    navigate('/orders');
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Factory Options</h1>
            <p className="text-muted-foreground">Select a manufacturing partner for your received materials</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {factoryOptions.map((f) => (
            <Card key={f.id} className="glass p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{f.name}</h3>
                  <p className="text-sm text-muted-foreground">{f.area}</p>
                </div>
                <QualityBadge score={f.qualityScore} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Price / unit</p>
                  <p className="text-lg font-semibold">₹{f.pricePerUnit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality Score</p>
                  <p className="text-lg font-semibold">{f.qualityScore}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lead time</p>
                  <p className="text-lg font-semibold">{f.leadTimeDays} days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Total</p>
                  <p className="text-lg font-semibold">Varies by quantity</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onSelectFactory(f)}>Select</Button>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selected?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-2">Monthly Sales</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ReTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="returns" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-2">Batch Quality Scores</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qualityData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="batch" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ReTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Bar dataKey="score" fill="hsl(var(--success))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                <span>Lead time: </span>
                <span className="font-medium">{selected?.leadTimeDays} days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Qty</span>
                  <Input type="number" className="w-28" value={quantity} min={1} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={placeOrder}>Place Order</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default FactoryOptions;


