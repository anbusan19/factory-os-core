import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Conveyor Belt Component
export const ConveyorBelt = ({ position, length }: { position: [number, number, number]; length: number }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      // Animate conveyor movement
      const time = state.clock.getElapsedTime();
      ref.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && i > 0) {
          const offset = (time * 0.5 + i * 0.5) % length;
          child.position.z = position[2] - length / 2 + offset;
        }
      });
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Belt base */}
      <Box args={[1, 0.2, length]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      {/* Moving boxes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Box key={i} args={[0.6, 0.4, 0.6]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </Box>
      ))}
    </group>
  );
};

// Robot Arm Component
export const RobotArm = ({ position }: { position: [number, number, number] }) => {
  const armRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (armRef.current) {
      const time = state.clock.getElapsedTime();
      armRef.current.rotation.y = Math.sin(time * 0.5) * 0.5;
      armRef.current.children[1].rotation.z = Math.sin(time * 0.8) * 0.3;
    }
  });

  return (
    <group ref={armRef} position={position}>
      {/* Base */}
      <Cylinder args={[0.5, 0.6, 0.3, 8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
      {/* Arm */}
      <group position={[0, 1, 0]}>
        <Box args={[0.3, 2, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        {/* Gripper */}
        <Box args={[0.5, 0.2, 0.2]} position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
        </Box>
      </group>
    </group>
  );
};

// Manufacturing Machine Component
export const Machine = ({ 
  position, 
  color, 
  status 
}: { 
  position: [number, number, number]; 
  color: string;
  status: 'active' | 'idle' | 'fault';
}) => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current && status === 'active') {
      const time = state.clock.getElapsedTime();
      lightRef.current.intensity = 1 + Math.sin(time * 3) * 0.3;
    }
  });

  const getStatusColor = () => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#f59e0b';
      case 'fault': return '#ef4444';
      default: return color;
    }
  };

  return (
    <group position={position}>
      {/* Machine body */}
      <Box args={[2, 1.5, 2]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Status indicator */}
      <Sphere args={[0.2, 16, 16]} position={[0, 1, 0]}>
        <meshStandardMaterial 
          color={getStatusColor()} 
          emissive={getStatusColor()} 
          emissiveIntensity={0.8}
        />
      </Sphere>
      <pointLight 
        ref={lightRef}
        position={[0, 1, 0]} 
        color={getStatusColor()} 
        intensity={status === 'active' ? 1.5 : 0.5}
        distance={5}
      />
      {/* Machine details */}
      <Box args={[1.8, 0.3, 1.8]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#0a0a0a" />
      </Box>
    </group>
  );
};

// Factory Wall Component
export const FactoryWall = ({ 
  position, 
  size 
}: { 
  position: [number, number, number]; 
  size: [number, number, number];
}) => {
  return (
    <Box args={size} position={position}>
      <meshStandardMaterial 
        color="#0a0a0a" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </Box>
  );
};

// Storage Rack Component
export const StorageRack = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {[0, 1, 2].map((level) => (
        <group key={level} position={[0, level * 1, 0]}>
          <Box args={[3, 0.1, 1]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          {[0, 1, 2].map((item) => (
            <Box 
              key={item} 
              args={[0.8, 0.8, 0.8]} 
              position={[-1 + item, 0.5, 0]}
            >
              <meshStandardMaterial color="#ffffff" />
            </Box>
          ))}
        </group>
      ))}
      {/* Posts */}
      {[-1.5, 1.5].map((x, i) => (
        <Box key={i} args={[0.1, 3, 0.1]} position={[x, 1.5, 0.5]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
      ))}
    </group>
  );
};

// Control Panel
export const ControlPanel = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <Box args={[2, 3, 0.2]}>
        <meshStandardMaterial color="#0a0a0a" />
      </Box>
      {/* Screens */}
      <Box args={[1.6, 1, 0.15]} position={[0, 0.8, 0.18]}>
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={0.5}
        />
      </Box>
      <Box args={[1.6, 0.8, 0.15]} position={[0, -0.5, 0.18]}>
        <meshStandardMaterial 
          color="#06b6d4" 
          emissive="#06b6d4" 
          emissiveIntensity={0.5}
        />
      </Box>
    </group>
  );
};
