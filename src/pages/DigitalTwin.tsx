import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { useFactoryStore } from '@/store/useFactoryStore';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { 
  Machine, 
  ConveyorBelt, 
  RobotArm, 
  FactoryWall, 
  StorageRack,
  ControlPanel 
} from '@/components/digitaltwin/FactoryFloor';
import { PanControls, usePanControls } from '@/components/digitaltwin/PanControls';
import { PanControlUI } from '@/components/digitaltwin/PanControlUI';
import { Badge } from '@/components/ui/badge';

const DigitalTwin = () => {
  const machines = useFactoryStore((state) => state.machines);
  const {
    panMode,
    panSpeed,
    showBoundaries,
    keyboardEnabled,
    setPanSpeed,
    setShowBoundaries,
    setKeyboardEnabled,
    togglePanMode,
    resetView
  } = usePanControls();

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Digital Twin - Factory Floor</h1>
          <p className="text-muted-foreground">Real-time 3D visualization of manufacturing operations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main 3D View */}
          <div className="lg:col-span-3">
            <Card className="glass p-6 h-[700px] border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Factory Floor Simulation</h3>
                  <p className="text-sm text-muted-foreground">
                    {panMode === 'orbit' && 'Click and drag to rotate • Scroll to zoom • Right-click to pan'}
                    {panMode === 'pan' && 'WASD to pan • Q/E for up/down • Space to reset'}
                    {panMode === 'fly' && 'WASD to fly • Mouse to look • Space to reset'}
                  </p>
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

              <div className="h-[600px] rounded-lg overflow-hidden bg-black border border-white/10">
                <Canvas>
                  <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={60} />
                  
                  {/* Advanced Pan Controls */}
                  <PanControls
                    enabled={true}
                    panSpeed={panSpeed}
                    boundary={{
                      minX: -20,
                      maxX: 20,
                      minZ: -20,
                      maxZ: 20
                    }}
                    showBoundaries={showBoundaries}
                    keyboardShortcuts={keyboardEnabled}
                  />
                  
                  {/* Lighting */}
                  <ambientLight intensity={0.3} />
                  <pointLight position={[10, 15, 10]} intensity={1} color="#ffffff" />
                  <pointLight position={[-10, 15, -10]} intensity={0.8} color="#06b6d4" />
                  <pointLight position={[0, 10, 0]} intensity={0.5} color="#10b981" />
                  <spotLight 
                    position={[0, 20, 0]} 
                    angle={0.6} 
                    penumbra={1} 
                    intensity={1}
                    castShadow
                  />

                  {/* Stars background */}
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                  {/* Factory Floor Grid */}
                  <gridHelper 
                    args={[40, 40]} 
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                  />

                  {/* Factory Walls */}
                  <FactoryWall position={[0, 2, -15]} size={[40, 4, 0.2]} />
                  <FactoryWall position={[-15, 2, 0]} size={[0.2, 4, 30]} />
                  <FactoryWall position={[15, 2, 0]} size={[0.2, 4, 30]} />

                  {/* Assembly Line 1 - Left Side */}
                  <ConveyorBelt position={[-8, 0.1, -5]} length={15} />
                  <Machine 
                    position={[-8, 0.75, -12]} 
                    color="#ffffff" 
                    status="active" 
                    machineData={machines.find(m => m.id === 'M-001')}
                  />
                  <Machine 
                    position={[-8, 0.75, 2]} 
                    color="#ffffff" 
                    status="active" 
                    machineData={machines.find(m => m.id === 'M-002')}
                  />
                  <RobotArm position={[-6, 0, -5]} />

                  {/* Assembly Line 2 - Center */}
                  <ConveyorBelt position={[0, 0.1, -3]} length={20} />
                  <Machine 
                    position={[0, 0.75, -12]} 
                    color="#ffffff" 
                    status="active" 
                    machineData={machines.find(m => m.id === 'M-003')}
                  />
                  <Machine 
                    position={[0, 0.75, 7]} 
                    color="#ffffff" 
                    status="idle" 
                    machineData={machines.find(m => m.id === 'M-004')}
                  />
                  <RobotArm position={[2, 0, -3]} />
                  <RobotArm position={[2, 0, 3]} />

                  {/* Assembly Line 3 - Right Side */}
                  <ConveyorBelt position={[8, 0.1, -5]} length={15} />
                  <Machine 
                    position={[8, 0.75, -12]} 
                    color="#ffffff" 
                    status="fault" 
                    machineData={machines.find(m => m.id === 'M-005')}
                  />
                  <Machine 
                    position={[8, 0.75, 2]} 
                    color="#ffffff" 
                    status="active" 
                    machineData={machines.find(m => m.id === 'M-001')}
                  />
                  <RobotArm position={[10, 0, -5]} />

                  {/* Quality Control Station */}
                  <Machine 
                    position={[-10, 0.75, 8]} 
                    color="#ffffff" 
                    status="active" 
                    machineData={machines.find(m => m.id === 'M-002')}
                  />
                  <ControlPanel position={[-12, 1.5, 8]} />

                  {/* Storage Area */}
                  <StorageRack position={[12, 1.5, -8]} />
                  <StorageRack position={[12, 1.5, -4]} />
                  <StorageRack position={[12, 1.5, 0]} />

                  {/* Packaging Station */}
                  <Machine 
                    position={[-5, 0.75, 10]} 
                    color="#ffffff" 
                    status="active" 
                    machineData={machines.find(m => m.id === 'M-003')}
                  />
                  <Machine 
                    position={[5, 0.75, 10]} 
                    color="#ffffff" 
                    status="active" 
                    machineData={machines.find(m => m.id === 'M-004')}
                  />

                  {/* Central Control Room */}
                  <ControlPanel position={[0, 1.5, 12]} />
                </Canvas>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="glass-strong p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Machines</p>
                  <p className="text-2xl font-bold">{machines.length}</p>
                </div>
                <div className="glass-strong p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Active</p>
                  <p className="text-2xl font-bold text-success">
                    {machines.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <div className="glass-strong p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Idle</p>
                  <p className="text-2xl font-bold text-warning">
                    {machines.filter(m => m.status === 'idle').length}
                  </p>
                </div>
                <div className="glass-strong p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Faults</p>
                  <p className="text-2xl font-bold text-destructive">
                    {machines.filter(m => m.status === 'fault').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pan Control Panel */}
          <div className="lg:col-span-1">
            <PanControlUI
              panMode={panMode}
              panSpeed={panSpeed}
              showBoundaries={showBoundaries}
              keyboardEnabled={keyboardEnabled}
              onTogglePanMode={togglePanMode}
              onResetView={resetView}
              onPanSpeedChange={setPanSpeed}
              onToggleBoundaries={setShowBoundaries}
              onToggleKeyboard={setKeyboardEnabled}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DigitalTwin;
