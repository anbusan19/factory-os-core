import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApiStore } from '@/store/useApiStore';
import { useEffect } from 'react';

export const ProductionChart = () => {
  const { productionData, fetchProductionData, loading } = useApiStore();
  
  useEffect(() => {
    fetchProductionData();
  }, [fetchProductionData]);
  if (loading.production) {
    return (
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold mb-6">Production vs. Defects Trend</h3>
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-muted-foreground">Loading production data...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass p-6">
      <h3 className="text-lg font-semibold mb-6">Production vs. Defects Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={productionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="production"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="defects"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--destructive))', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
