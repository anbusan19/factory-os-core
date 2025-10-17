import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DefectAnalysis } from '@/lib/defectAnalysis';

interface DefectAnalysisPanelProps {
  analysis: DefectAnalysis | null;
}

export const DefectAnalysisPanel = ({ analysis }: DefectAnalysisPanelProps) => {
  if (!analysis) {
    return (
      <Card className="glass border-slate-700 p-4">
        <h3 className="text-white font-semibold mb-3">Manufacturability Analysis</h3>
        <p className="text-slate-500 text-sm">Upload a model to analyze</p>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass border-slate-700 p-4">
        <h3 className="text-white font-semibold mb-3">Manufacturability Score</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Overall Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}/100
            </span>
          </div>
          <Progress value={analysis.score} className="h-2" />
        </div>
      </Card>

      <Card className="glass border-slate-700 p-4">
        <h3 className="text-white font-semibold mb-3">Issues Found ({analysis.issues.length})</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {analysis.issues.length === 0 ? (
            <p className="text-green-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No issues detected
            </p>
          ) : (
            analysis.issues.map((issue, index) => (
              <div key={index} className="border border-slate-600 rounded p-3 space-y-2">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(issue.severity)}
                  <Badge variant="outline" className="text-xs">
                    {issue.type}
                  </Badge>
                  <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                    {issue.severity}
                  </Badge>
                </div>
                <p className="text-white text-sm font-medium">{issue.description}</p>
                <p className="text-slate-400 text-xs">{issue.impact}</p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="glass border-slate-700 p-4">
        <h3 className="text-white font-semibold mb-3">Recommendations</h3>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-slate-300 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};