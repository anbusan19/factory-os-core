import { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { ModelViewer } from '@/components/fileviewer/ModelViewer';
import { DefectAnalysisPanel } from '@/components/fileviewer/DefectAnalysisPanel';
import { Layout } from '@/components/layout/Layout';
import { analyzeModel, DefectAnalysis } from '@/lib/defectAnalysis';
import * as THREE from 'three';

const FileViewer = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<'gltf' | 'stl' | null>(null);
  const [analysis, setAnalysis] = useState<DefectAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['gltf', 'glb', 'stl'].includes(fileExtension)) {
      alert('Please upload a GLTF (.gltf, .glb) or STL (.stl) file');
      return;
    }

    const url = URL.createObjectURL(file);
    setModelUrl(url);
    setFileName(file.name);
    setFileType(fileExtension === 'stl' ? 'stl' : 'gltf');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearModel = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelUrl(null);
    setFileName('');
    setFileType(null);
    setAnalysis(null);
  };

  const handleModelLoad = useCallback((object: THREE.Object3D) => {
    const result = analyzeModel(object);
    setAnalysis(result);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">3D Model Viewer</h1>
              <p className="text-slate-400 mt-2">Upload and view GLTF and STL files</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleUploadClick} className="bg-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Model
              </Button>
              {modelUrl && (
                <Button onClick={clearModel} variant="outline">
                  Clear
                </Button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".gltf,.glb,.stl"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="glass border-slate-700 h-[600px] overflow-hidden">
                {modelUrl ? (
                  <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <ModelViewer url={modelUrl} type={fileType!} onModelLoad={handleModelLoad} />
                    <OrbitControls enablePan enableZoom enableRotate />
                    <Environment preset="studio" />
                  </Canvas>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No model loaded</p>
                      <p className="text-slate-500 text-sm mt-2">
                        Upload a GLTF or STL file to view it here
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-4">
              <DefectAnalysisPanel analysis={analysis} />
              
              <Card className="glass border-slate-700 p-4">
                <h3 className="text-white font-semibold mb-3">File Info</h3>
                {fileName ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 text-sm">Name:</span>
                      <p className="text-white text-sm break-all">{fileName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Type:</span>
                      <p className="text-white text-sm uppercase">{fileType}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No file selected</p>
                )}
              </Card>

              <Card className="glass border-slate-700 p-4">
                <h3 className="text-white font-semibold mb-3">Controls</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p><strong>Left Click + Drag:</strong> Rotate</p>
                  <p><strong>Right Click + Drag:</strong> Pan</p>
                  <p><strong>Scroll:</strong> Zoom</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FileViewer;