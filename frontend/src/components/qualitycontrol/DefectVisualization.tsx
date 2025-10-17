import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface DefectResult {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

interface DetectionResponse {
  defects: DefectResult[];
  bolt_detected: boolean;
  processing_time: number;
  annotated_image?: string;
  original_image?: string;
  inference_log?: any;
}

interface DefectVisualizationProps {
  imageUrl: string;
  results: DetectionResponse;
  className?: string;
}

export const DefectVisualization = ({ imageUrl, results, className }: DefectVisualizationProps) => {
  const getDefectSeverity = (confidence: number) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Defect Analysis Results
          </CardTitle>
          <CardDescription>
            AI-powered visual inspection results with defect locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Alert */}
          <Alert className={results.defects.length > 0 ? 'border-destructive' : 'border-green-500'}>
            <div className="flex items-center gap-2">
              {results.defects.length > 0 ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <AlertDescription>
                {results.defects.length > 0
                  ? `${results.defects.length} defect(s) detected`
                  : 'No defects detected - Quality passed'}
              </AlertDescription>
            </div>
          </Alert>

          {/* Image with Defect Overlays */}
          <div className="relative">
            <img
              src={results.original_image ? `http://localhost:3001${results.original_image}` : imageUrl}
              alt="Analysis result"
              className="w-full h-auto max-h-96 object-contain rounded-lg border"
            />
            
            {/* Defect Overlays */}
            {results.defects.map((defect, index) => {
              const severity = getDefectSeverity(defect.confidence);
              const [x, y, width, height] = defect.bbox;
              
              return (
                <div
                  key={index}
                  className={`absolute border-2 ${
                    severity === 'high' ? 'border-red-500' : 
                    severity === 'medium' ? 'border-yellow-500' : 'border-orange-500'
                  } rounded-lg`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className={`absolute -top-6 left-0 px-1 py-0.5 rounded text-xs font-medium ${
                    severity === 'high' ? 'bg-red-500 text-white' : 
                    severity === 'medium' ? 'bg-yellow-500 text-black' : 'bg-orange-500 text-white'
                  }`}>
                    Defect {index + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Processing Info */}
          <div className="text-sm text-muted-foreground">
            Processing time: {results.processing_time.toFixed(2)}s
            {results.bolt_detected && ' • Bolt detected'}
          </div>

          {/* Defects List */}
          {results.defects.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Detected Defects:</h4>
              <div className="grid gap-2">
                {results.defects.map((defect, index) => {
                  const severity = getDefectSeverity(defect.confidence);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(severity)}
                        <div>
                          <div className="font-medium capitalize">{defect.class}</div>
                          <div className="text-sm text-muted-foreground">
                            Confidence: {(defect.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(severity) as any}>
                          {severity} severity
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Position: ({defect.bbox[0].toFixed(0)}, {defect.bbox[1].toFixed(0)})
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quality Assessment */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Quality Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.bolt_detected ? '✓' : '✗'}
                </div>
                <div className="text-muted-foreground">Bolt Detected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.defects.length}
                </div>
                <div className="text-muted-foreground">Defects Found</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  results.defects.length === 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.defects.length === 0 ? 'PASS' : 'FAIL'}
                </div>
                <div className="text-muted-foreground">Quality Status</div>
              </div>
            </div>
          </div>

          {/* Inference Log Details */}
          {results.inference_log && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3">AI Model Analysis Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span>{new Date(results.inference_log.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Detections:</span>
                  <span>{results.inference_log.num_detections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Has Defects:</span>
                  <span className={results.inference_log.has_defect ? 'text-red-600' : 'text-green-600'}>
                    {results.inference_log.has_defect ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              
              {/* Raw Detection Data */}
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  View Raw Detection Data
                </summary>
                <pre className="mt-2 p-3 bg-background border rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.inference_log, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
