import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApiStore } from '@/store/useApiStore';
import { format } from 'date-fns';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

const Warehouse = () => {
  const { procurementOrders, factoryOrders, fetchProcurementOrders, fetchFactoryOrders, loading } = useApiStore();
  
  useEffect(() => {
    fetchProcurementOrders();
    fetchFactoryOrders();
  }, [fetchProcurementOrders, fetchFactoryOrders]);

  // Derive simple inventory views from existing data
  const rawMaterialInventory = procurementOrders.map((p) => ({
    id: p.id,
    location: `Dock ${p.id.slice(-1)}`,
    item: `${p.material} (${p.partId})`,
    quantity: p.quantity,
    eta: new Date(p.deliveryEta),
    status: p.status,
  }));

  const ordersInventory = factoryOrders.map((o) => ({
    id: o.id,
    location: o.area,
    item: `${o.factoryName} Order`,
    quantity: o.quantity,
    eta: new Date(new Date(o.createdAt).getTime() + o.leadTimeDays * 86400000),
    status: o.status,
  }));

  const [rawTab, setRawTab] = useState<string>('all');
  const [ordersTab, setOrdersTab] = useState<string>('all');
  const [selectedDock, setSelectedDock] = useState<string | null>(null);

  const selectedDockItems = useMemo(() => {
    if (!selectedDock) return [] as { id: string; label: string; type: 'raw' | 'order' }[];
    const raw = rawMaterialInventory.filter((r) => r.location === selectedDock).map((r) => ({ id: r.id, label: r.item, type: 'raw' as const }));
    const ord = ordersInventory.filter((r) => r.location === selectedDock).map((r) => ({ id: r.id, label: r.item, type: 'order' as const }));
    return [...raw, ...ord];
  }, [selectedDock, rawMaterialInventory, ordersInventory]);

  const openDockDialogFromTab = (val: string) => {
    if (val !== 'all') setSelectedDock(val);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Warehouse</h1>
          <p className="text-muted-foreground">Inventory overview for raw materials and orders</p>
        </div>

        <div className="space-y-8">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-6">Raw Material Inventory</h3>
            <Tabs value={rawTab} onValueChange={(v) => { setRawTab(v); openDockDialogFromTab(v); }}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {Array.from(new Set(rawMaterialInventory.map((r) => r.location))).map((loc) => (
                  <TabsTrigger key={loc} value={loc}>{loc}</TabsTrigger>
                ))}
              </TabsList>
              {['all', ...Array.from(new Set(rawMaterialInventory.map((r) => r.location)))].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(tab === 'all' ? rawMaterialInventory : rawMaterialInventory.filter((r) => r.location === tab)).map((r) => (
                      <div key={r.id} className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground">{r.location}</div>
                          <Badge variant={r.status === 'delivered' ? 'default' : r.status === 'in-transit' ? 'secondary' : 'outline'}>
                            {r.status}
                          </Badge>
                        </div>
                        <div className="font-medium mb-1">{r.item}</div>
                        <div className="text-sm">Qty: <span className="font-medium">{r.quantity}</span></div>
                        <div className="text-xs text-muted-foreground mt-2">ETA: {format(r.eta, 'MMM dd, yyyy')}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-6">Orders Inventory</h3>
            <Tabs value={ordersTab} onValueChange={(v) => { setOrdersTab(v); openDockDialogFromTab(v); }}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {Array.from(new Set(ordersInventory.map((r) => r.location))).map((loc) => (
                  <TabsTrigger key={loc} value={loc}>{loc}</TabsTrigger>
                ))}
              </TabsList>
              {['all', ...Array.from(new Set(ordersInventory.map((r) => r.location)))].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(tab === 'all' ? ordersInventory : ordersInventory.filter((r) => r.location === tab)).map((r) => (
                      <div key={r.id} className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-muted-foreground">{r.location}</div>
                          <Badge variant={r.status === 'completed' ? 'default' : r.status === 'in-transit' ? 'secondary' : 'outline'}>
                            {r.status}
                          </Badge>
                        </div>
                        <div className="font-medium mb-1">{r.item}</div>
                        <div className="text-sm">Qty: <span className="font-medium">{r.quantity}</span></div>
                        <div className="text-xs text-muted-foreground mt-2">ETA: {format(r.eta, 'MMM dd, yyyy')}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>
      <Infra3DDialog dock={selectedDock} items={selectedDockItems} onOpenChange={(open) => !open && setSelectedDock(null)} occupancy={
        (() => {
          const all = [...rawMaterialInventory.map(r => ({ location: r.location, label: r.item, type: 'raw' as const })), ...ordersInventory.map(r => ({ location: r.location, label: r.item, type: 'order' as const }))];
          const map: Record<string, { label: string; type: 'raw' | 'order' }[]> = {};
          all.forEach((x) => { map[x.location] = map[x.location] ? [...map[x.location], { label: x.label, type: x.type }] : [{ label: x.label, type: x.type }]; });
          return map;
        })()
      } />
    </Layout>
  );
};

export default Warehouse;

// 3D infrastructure dialog – larger grid of dock platforms with three labeled docks
const Infra3DDialog = ({ dock, occupancy, onOpenChange }: { dock: string | null; occupancy: Record<string, { label: string; type: 'raw' | 'order' }[]>; onOpenChange: (o: boolean) => void; }) => {
  const docks = useMemo(() => Array.from(new Set(Object.keys(occupancy).sort())), [occupancy]);
  const chosen = useMemo(() => {
    const pool = docks.slice();
    const result: string[] = [];
    if (dock && pool.includes(dock)) result.push(dock);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    for (const d of pool) { if (result.length >= 3) break; if (!result.includes(d)) result.push(d); }
    return result.slice(0, 3);
  }, [dock, docks]);

  const gridCols = 6; const gridRows = 4; const total = gridCols * gridRows;
  const indices = useMemo(() => Array.from({ length: total }, (_, i) => i), [total]);
  const layout = useMemo(() => {
    const arr = indices.slice();
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    const placements: Record<number, string> = {};
    chosen.forEach((name, idx) => { if (arr[idx] !== undefined) placements[arr[idx]] = name; });
    return placements;
  }, [indices, chosen]);

  return (
    <Dialog open={!!dock} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Warehouse Infrastructure (3D)</DialogTitle>
          <DialogDescription>Hover platforms to view dock names and storage. Drag to orbit.</DialogDescription>
        </DialogHeader>
        <div className="mb-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-primary" /> Raw material</div>
          <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-warning" /> Order</div>
          <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-muted" /> Empty</div>
        </div>
        <div className="h-[460px] rounded-lg border overflow-hidden">
          <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} />
            <OrbitControls enablePan={false} />
            <InfraFloor />
            <DockGrid gridCols={gridCols} gridRows={gridRows} layout={layout} occupancy={occupancy} />
          </Canvas>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function InfraFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[20, 14]} />
      <meshStandardMaterial color={'#1f2937'} />
    </mesh>
  );
}

function DockGrid({ gridCols, gridRows, layout, occupancy }: { gridCols: number; gridRows: number; layout: Record<number, string>; occupancy: Record<string, { label: string; type: 'raw' | 'order' }[]>; }) {
  const spacing = 2.4;
  const platforms = [] as JSX.Element[];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const idx = r * gridCols + c;
      const name = layout[idx];
      const x = -((gridCols - 1) * spacing) / 2 + c * spacing;
      const z = -((gridRows - 1) * spacing) / 2 + r * spacing;
      platforms.push(<DockPlatform key={idx} x={x} z={z} name={name} content={name ? (occupancy[name] || []) : []} />);
    }
  }
  return <group>{platforms}</group>;
}

function DockPlatform({ x, z, name, content }: { x: number; z: number; name?: string; content: { label: string; type: 'raw' | 'order' }[]; }) {
  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const hasRaw = content.some((c) => c.type === 'raw');
  const hasOrder = content.some((c) => c.type === 'order');
  const color = !name ? '#9ca3af' : hasRaw && hasOrder ? '#f59e0b' : hasRaw ? 'hsl(var(--primary))' : '#f59e0b';
  useFrame((state) => {
    if (!ref.current || !name) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = 0.1 + Math.sin(t + x + z) * 0.05;
  });
  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ref}
        onPointerOver={() => name && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.6, 0.2, 1.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {hovered && name && (
        <Html center distanceFactor={10} position={[0, 0.9, 0]}>
          <div className="rounded-md border bg-popover px-2 py-1 text-xs shadow">
            <div className="font-semibold mb-1">{name}</div>
            {content.length === 0 ? (
              <div className="text-muted-foreground">Empty</div>
            ) : (
              <ul className="list-disc pl-4 space-y-0.5 text-left">
                {content.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded ${c.type === 'raw' ? 'bg-primary' : 'bg-warning'}`} />
                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// 2D infrastructure dialog
const Infra2DDialog = ({ dock, items, occupancy, onOpenChange }: { dock: string | null; items: { id: string; label: string; type: 'raw' | 'order' }[]; occupancy: Record<string, { label: string; type: 'raw' | 'order' }[]>; onOpenChange: (o: boolean) => void; }) => {
  const docks = Array.from(new Set(Object.keys(occupancy).sort()));
  // Choose up to 3 docks at random to label/show (always include the selected dock if present)
  const chosen = useMemo(() => {
    const pool = docks.slice();
    const result: string[] = [];
    if (dock && pool.includes(dock)) {
      result.push(dock);
    }
    // shuffle pool for randomness
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    for (const d of pool) {
      if (result.length >= 3) break;
      if (!result.includes(d)) result.push(d);
    }
    return result.slice(0, 3);
  }, [dock, docks]);

  // Build a larger grid and place only the chosen docks randomly; others are unlabeled empty blocks
  const gridSize = 24; // e.g., 6 columns x 4 rows
  const columns = 6;
  const cellIndices = Array.from({ length: gridSize }, (_, i) => i);
  const layout = useMemo(() => {
    const indices = cellIndices.slice();
    // shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const placements: Record<number, string> = {};
    chosen.forEach((name, idx) => {
      if (indices[idx] !== undefined) placements[indices[idx]] = name;
    });
    return placements;
  }, [cellIndices, chosen]);

  return (
    <Dialog open={!!dock} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Warehouse Infrastructure</DialogTitle>
          <DialogDescription>Hover over blocks to view dock names and storage.</DialogDescription>
        </DialogHeader>
        <div className="mb-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-primary" /> Raw material</div>
          <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-warning" /> Order</div>
          <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-muted" /> Empty</div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {cellIndices.map((idx) => {
            const d = layout[idx];
            const content = d ? (occupancy[d] || []) : [];
            const hasRaw = content.some((c) => c.type === 'raw');
            const hasOrder = content.some((c) => c.type === 'order');
            const color = content.length === 0 ? 'bg-muted' : hasRaw && hasOrder ? 'bg-gradient-to-br from-primary to-warning' : hasRaw ? 'bg-primary' : 'bg-warning';
            return (
              <div key={idx} className={`relative aspect-square rounded-lg border ${color} p-2 group`}> 
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                {d && <div className="text-[10px] font-medium text-background">{d}</div>}
                {/* hover popup only if it is a named dock */}
                {d && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-64 -translate-x-1/2 group-hover:block">
                    <div className="rounded-md border bg-popover p-2 text-xs shadow">
                      <div className="font-semibold mb-1">{d}</div>
                      {content.length === 0 ? (
                        <div className="text-muted-foreground">Empty</div>
                      ) : (
                        <ul className="list-disc pl-4 space-y-0.5">
                          {content.map((c, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className={`inline-block h-2 w-2 rounded ${c.type === 'raw' ? 'bg-primary' : 'bg-warning'}`} />
                              <span>{c.label}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};


