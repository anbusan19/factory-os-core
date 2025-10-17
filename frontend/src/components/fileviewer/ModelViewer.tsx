import { useEffect, useRef, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { STLLoader } from 'three-stdlib';
import * as THREE from 'three';

interface ModelViewerProps {
  url: string;
  type: 'gltf' | 'stl';
  onModelLoad?: (object: THREE.Object3D) => void;
}

export const ModelViewer = ({ url, type, onModelLoad }: ModelViewerProps) => {
  const meshRef = useRef<THREE.Group>(null);

  if (type === 'gltf') {
    const gltf = useLoader(GLTFLoader, url);
    
    const processedScene = useMemo(() => {
      const scene = gltf.scene.clone();
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;
      scene.scale.setScalar(scale);
      
      return scene;
    }, [gltf]);

    useEffect(() => {
      if (processedScene) {
        onModelLoad?.(processedScene);
      }
    }, [processedScene, onModelLoad]);

    return (
      <group ref={meshRef}>
        <primitive object={processedScene} />
      </group>
    );
  }

  if (type === 'stl') {
    const geometry = useLoader(STLLoader, url);
    
    const processedGeometry = useMemo(() => {
      const geo = geometry.clone();
      geo.computeBoundingBox();
      geo.computeVertexNormals();
      
      if (geo.boundingBox) {
        const center = geo.boundingBox.getCenter(new THREE.Vector3());
        geo.translate(-center.x, -center.y, -center.z);
        
        const size = geo.boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        geo.scale(scale, scale, scale);
      }
      
      return geo;
    }, [geometry]);

    useEffect(() => {
      if (meshRef.current) {
        onModelLoad?.(meshRef.current);
      }
    }, [processedGeometry, onModelLoad]);

    return (
      <group ref={meshRef}>
        <mesh geometry={processedGeometry}>
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
      </group>
    );
  }

  return null;
};