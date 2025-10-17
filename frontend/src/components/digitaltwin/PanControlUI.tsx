import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Move, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Eye, 
  EyeOff,
  Keyboard,
  MousePointer,
  Settings
} from 'lucide-react';

interface PanControlUIProps {
  panMode: 'orbit' | 'pan' | 'fly';
  panSpeed: number;
  showBoundaries: boolean;
  keyboardEnabled: boolean;
  onTogglePanMode: () => void;
  onResetView: () => void;
  onPanSpeedChange: (speed: number) => void;
  onToggleBoundaries: (show: boolean) => void;
  onToggleKeyboard: (enabled: boolean) => void;
}

export const PanControlUI = ({
  panMode,
  panSpeed,
  showBoundaries,
  keyboardEnabled,
  onTogglePanMode,
  onResetView,
  onPanSpeedChange,
  onToggleBoundaries,
  onToggleKeyboard
}: PanControlUIProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPanModeIcon = () => {
    switch (panMode) {
      case 'orbit': return <RotateCcw className="w-4 h-4" />;
      case 'pan': return <Move className="w-4 h-4" />;
      case 'fly': return <Navigation className="w-4 h-4" />;
      default: return <RotateCcw className="w-4 h-4" />;
    }
  };

  const getPanModeLabel = () => {
    switch (panMode) {
      case 'orbit': return 'Orbit';
      case 'pan': return 'Pan';
      case 'fly': return 'Fly';
      default: return 'Orbit';
    }
  };

  return (
    <Card className="glass-strong p-4 border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <h3 className="font-semibold">Pan Controls</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Quick Controls */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={panMode === 'orbit' ? 'default' : 'outline'}
          size="sm"
          onClick={onTogglePanMode}
          className="flex items-center gap-2"
        >
          {getPanModeIcon()}
          {getPanModeLabel()}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetView}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mb-4 p-3 bg-black/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Keyboard className="w-4 h-4" />
          <span className="text-sm font-medium">Keyboard Shortcuts</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>WASD / Arrows: Pan</div>
          <div>Q/E: Up/Down</div>
          <div>Space: Reset View</div>
          <div>Shift+Wheel: Pan</div>
        </div>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Pan Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pan Speed</span>
              <Badge variant="outline">{panSpeed.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[panSpeed]}
              onValueChange={([value]) => onPanSpeedChange(value)}
              min={0.5}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Toggle Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                <span className="text-sm">Show Boundaries</span>
              </div>
              <Switch
                checked={showBoundaries}
                onCheckedChange={onToggleBoundaries}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <span className="text-sm">Keyboard Controls</span>
              </div>
              <Switch
                checked={keyboardEnabled}
                onCheckedChange={onToggleKeyboard}
              />
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Zoom in logic */}}
              className="flex items-center gap-2"
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Zoom out logic */}}
              className="flex items-center gap-2"
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </Button>
          </div>

          {/* Pan Mode Info */}
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <div className="text-sm font-medium mb-1">Current Mode: {getPanModeLabel()}</div>
            <div className="text-xs text-muted-foreground">
              {panMode === 'orbit' && 'Rotate around the factory floor'}
              {panMode === 'pan' && 'Move the camera in 3D space'}
              {panMode === 'fly' && 'Free-fly camera movement'}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
