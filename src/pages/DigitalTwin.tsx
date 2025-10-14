import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { useFactoryStore } from '@/store/useFactoryStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Html } from '@react-three/drei';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, Pause } from 'lucide-react';

const MachineMarker = ({ machine }: { machine: any }) => {
  const getStatusColor = () => {
    switch (machine.status) {
      case 'active':
        return '#10b981'; // emerald
      case 'idle':
        return '#f59e0b'; // amber
      case 'fault':
        return '#ef4444'; // red
      default:
        return '#06b6d4'; // cyan
    }
  };

  const getStatusIcon = () => {
    switch (machine.status) {
      case 'active':
        return <Activity className="w-3 h-3" />;
      case 'idle':
        return <Pause className="w-3 h-3" />;
      case 'fault':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <group position={[machine.position.x, machine.position.y, machine.position.z]}>
      <Box args={[2, 1.5, 2]}>
        <meshStandardMaterial color={getStatusColor()} />
      </Box>
      <Html distanceFactor={10}>
        <div className="glass-strong px-3 py-2 rounded-lg min-w-[200px] -translate-x-1/2 -translate-y-full mb-4">
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon()}
            <p className="font-semibold text-sm">{machine.name}</p>
          </div>
          <p className="text-xs text-muted-foreground mb-2">ID: {machine.id}</p>
          <div className="flex gap-2">
            <Badge variant={machine.status === 'active' ? 'default' : machine.status === 'fault' ? 'destructive' : 'secondary'}>
              {machine.status}
            </Badge>
            {machine.efficiency && (
              <span className="text-xs text-muted-foreground">
                {machine.efficiency}% eff.
              </span>
            )}
          </div>
          {machine.workerId && (
            <p className="text-xs text-muted-foreground mt-1">
              Worker: {machine.workerId}
            </p>
          )}
        </div>
      </Html>
    </group>
  );
};

const DigitalTwin = () => {
  const machines = useFactoryStore((state) => state.machines);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Digital Twin - Factory Floor</h1>
          <p className="text-muted-foreground">Real-time 3D visualization of machines and operations</p>
        </div>

        <Card className="glass p-6 h-[700px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Factory Floor Simulation</h3>
              <p className="text-sm text-muted-foreground">Hover over machines for details • Click and drag to rotate</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>Idle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>Fault</span>
              </div>
            </div>
          </div>

          <div className="h-[600px] rounded-lg overflow-hidden bg-background/50">
            <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              {machines.map((machine) => (
                <MachineMarker key={machine.id} machine={machine} />
              ))}

              {/* Floor grid */}
              <gridHelper args={[30, 30, 'hsl(var(--primary))', 'hsl(var(--border))']} />
              
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
              />
            </Canvas>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DigitalTwin;
