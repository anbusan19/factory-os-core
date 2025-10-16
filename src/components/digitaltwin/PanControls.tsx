import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface PanControlsProps {
  enabled?: boolean;
  panSpeed?: number;
  boundary?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  showBoundaries?: boolean;
  keyboardShortcuts?: boolean;
}

export const PanControls = ({
  enabled = true,
  panSpeed = 2,
  boundary = {
    minX: -20,
    maxX: 20,
    minZ: -20,
    maxZ: 20
  },
  showBoundaries = true,
  keyboardShortcuts = true
}: PanControlsProps) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panDirection, setPanDirection] = useState<THREE.Vector3>(new THREE.Vector3());
  const [showPanIndicator, setShowPanIndicator] = useState(false);
  const [panBoundary, setPanBoundary] = useState<THREE.Box3 | null>(null);

  // Initialize boundary box
  useEffect(() => {
    const box = new THREE.Box3(
      new THREE.Vector3(boundary.minX, -5, boundary.minZ),
      new THREE.Vector3(boundary.maxX, 20, boundary.maxZ)
    );
    setPanBoundary(box);
  }, [boundary]);

  // Keyboard controls
  useEffect(() => {
    if (!keyboardShortcuts || !enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return;

      const speed = panSpeed * 0.1;
      const direction = new THREE.Vector3();

      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          direction.z = -speed;
          break;
        case 's':
        case 'arrowdown':
          direction.z = speed;
          break;
        case 'a':
        case 'arrowleft':
          direction.x = -speed;
          break;
        case 'd':
        case 'arrowright':
          direction.x = speed;
          break;
        case 'q':
          direction.y = speed;
          break;
        case 'e':
          direction.y = -speed;
          break;
        case ' ':
          event.preventDefault();
          // Reset to default view
          camera.position.set(20, 15, 20);
          camera.lookAt(0, 0, 0);
          return;
      }

      if (direction.length() > 0) {
        setPanDirection(direction);
        setIsPanning(true);
        setShowPanIndicator(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!enabled) return;

      const keys = ['w', 's', 'a', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
      if (keys.includes(event.key.toLowerCase())) {
        setPanDirection(new THREE.Vector3());
        setIsPanning(false);
        setShowPanIndicator(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, keyboardShortcuts, panSpeed, camera]);

  // Mouse wheel pan
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (event: WheelEvent) => {
      if (!enabled) return;

      // Check if Shift key is held for pan mode
      if (event.shiftKey) {
        event.preventDefault();
        
        const deltaX = event.deltaX * 0.01;
        const deltaY = event.deltaY * 0.01;
        
        const direction = new THREE.Vector3(-deltaX, deltaY, 0);
        setPanDirection(direction);
        setIsPanning(true);
        setShowPanIndicator(true);
        
        // Reset after short delay
        setTimeout(() => {
          setPanDirection(new THREE.Vector3());
          setIsPanning(false);
          setShowPanIndicator(false);
        }, 100);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [enabled, gl.domElement]);

  // Apply pan movement
  useFrame((state, delta) => {
    if (!enabled || !isPanning || panDirection.length() === 0) return;

    const moveVector = panDirection.clone().multiplyScalar(delta * panSpeed);
    
    // Apply movement to camera
    camera.position.add(moveVector);
    
    // Check boundaries
    if (panBoundary) {
      const clampedPosition = camera.position.clone();
      clampedPosition.clamp(panBoundary.min, panBoundary.max);
      camera.position.copy(clampedPosition);
    }
  });

  // Boundary visualization
  const BoundaryVisualization = () => {
    if (!showBoundaries || !panBoundary) return null;

    return (
      <group>
        {/* Boundary box wireframe */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(
            boundary.maxX - boundary.minX,
            25,
            boundary.maxZ - boundary.minZ
          )]} />
          <lineBasicMaterial color="#00ff00" transparent opacity={0.3} />
        </lineSegments>
        
        {/* Corner markers */}
        {[
          [boundary.minX, 0, boundary.minZ],
          [boundary.maxX, 0, boundary.minZ],
          [boundary.minX, 0, boundary.maxZ],
          [boundary.maxX, 0, boundary.maxZ]
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    );
  };

  // Pan indicator
  const PanIndicator = () => {
    if (!showPanIndicator || !isPanning) return null;

    return (
      <group position={[0, 2, 0]}>
        {/* Pan direction arrow */}
        <mesh position={[panDirection.x * 2, 0, panDirection.z * 2]}>
          <coneGeometry args={[0.3, 1, 8]} />
          <meshBasicMaterial color="#ff6600" />
        </mesh>
        
        {/* Pan speed indicator */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      </group>
    );
  };

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={enabled}
        enableZoom={enabled}
        enableRotate={enabled}
        panSpeed={panSpeed}
        minDistance={5}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        // Custom pan behavior
        onStart={() => setIsPanning(true)}
        onEnd={() => setIsPanning(false)}
        // Boundary constraints
        target={[0, 0, 0]}
        onChange={() => {
          if (panBoundary) {
            const clampedPosition = camera.position.clone();
            clampedPosition.clamp(panBoundary.min, panBoundary.max);
            camera.position.copy(clampedPosition);
          }
        }}
      />
      
      {/* Visual feedback components */}
      <BoundaryVisualization />
      <PanIndicator />
    </>
  );
};

// Enhanced pan control hook
export const usePanControls = () => {
  const [panMode, setPanMode] = useState<'orbit' | 'pan' | 'fly'>('orbit');
  const [panSpeed, setPanSpeed] = useState(2);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);

  const togglePanMode = () => {
    setPanMode(prev => {
      switch (prev) {
        case 'orbit': return 'pan';
        case 'pan': return 'fly';
        case 'fly': return 'orbit';
        default: return 'orbit';
      }
    });
  };

  const resetView = () => {
    // This will be handled by the camera reset in the component
  };

  return {
    panMode,
    panSpeed,
    showBoundaries,
    keyboardEnabled,
    setPanSpeed,
    setShowBoundaries,
    setKeyboardEnabled,
    togglePanMode,
    resetView
  };
};
