import * as THREE from 'three';

export interface DefectAnalysis {
  score: number;
  issues: DefectIssue[];
  recommendations: string[];
}

export interface DefectIssue {
  type: 'geometry' | 'topology' | 'manufacturing';
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
}

export const analyzeModel = (object: THREE.Object3D): DefectAnalysis => {
  const issues: DefectIssue[] = [];
  let score = 100;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;
      
      // Check triangle count
      const triangleCount = geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
      if (triangleCount > 50000) {
        issues.push({
          type: 'geometry',
          severity: 'medium',
          description: `High polygon count: ${Math.round(triangleCount)} triangles`,
          impact: 'May cause processing delays and increased manufacturing complexity'
        });
        score -= 15;
      }

      // Check for non-manifold geometry
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const size = geometry.boundingBox!.getSize(new THREE.Vector3());
      
      if (size.x < 0.1 || size.y < 0.1 || size.z < 0.1) {
        issues.push({
          type: 'manufacturing',
          severity: 'high',
          description: 'Very small features detected',
          impact: 'May not be manufacturable with standard tooling'
        });
        score -= 25;
      }

      // Check aspect ratio
      const maxDim = Math.max(size.x, size.y, size.z);
      const minDim = Math.min(size.x, size.y, size.z);
      if (maxDim / minDim > 20) {
        issues.push({
          type: 'geometry',
          severity: 'medium',
          description: 'High aspect ratio detected',
          impact: 'May cause warping or support structure issues'
        });
        score -= 10;
      }

      // Check for sharp angles (simplified)
      if (!geometry.attributes.normal) {
        issues.push({
          type: 'topology',
          severity: 'low',
          description: 'Missing surface normals',
          impact: 'May affect surface finish quality'
        });
        score -= 5;
      }
    }
  });

  // Generate recommendations
  const recommendations = generateRecommendations(issues);

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    recommendations
  };
};

const generateRecommendations = (issues: DefectIssue[]): string[] => {
  const recommendations: string[] = [];
  
  if (issues.some(i => i.type === 'geometry' && i.description.includes('polygon'))) {
    recommendations.push('Consider mesh decimation to reduce polygon count');
  }
  
  if (issues.some(i => i.type === 'manufacturing' && i.description.includes('small'))) {
    recommendations.push('Scale up model or use high-precision manufacturing');
  }
  
  if (issues.some(i => i.type === 'geometry' && i.description.includes('aspect'))) {
    recommendations.push('Add support structures or redesign for better proportions');
  }
  
  if (issues.some(i => i.type === 'topology')) {
    recommendations.push('Regenerate surface normals for better quality');
  }

  if (recommendations.length === 0) {
    recommendations.push('Model appears ready for manufacturing');
  }

  return recommendations;
};