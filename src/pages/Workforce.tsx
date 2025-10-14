import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFactoryStore } from '@/store/useFactoryStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, Coffee, AlertTriangle } from 'lucide-react';

const Workforce = () => {
  const workers = useFactoryStore((state) => state.workers);
  const machines = useFactoryStore((state) => state.machines);

  const activeWorkers = workers.filter((w) => w.status === 'active').length;
  const onBreak = workers.filter((w) => w.status === 'on-break').length;
  const avgRisk = Math.round(workers.reduce((acc, w) => acc + w.riskIndex, 0) / workers.length);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'on-break':
        return <Badge variant="secondary">On Break</Badge>;
      case 'reassigned':
        return <Badge variant="outline">Reassigned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'bg-success';
    if (risk < 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 30) return 'Low';
    if (risk < 60) return 'Medium';
    return 'High';
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Workforce Management</h1>
          <p className="text-muted-foreground">Worker assignments, safety profiles, and shift management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Workers</p>
                <h3 className="text-3xl font-bold">{workers.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Morning shift active</p>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Workers</p>
                <h3 className="text-3xl font-bold">{activeWorkers}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 text-success flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{((activeWorkers / workers.length) * 100).toFixed(0)}% utilization</p>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">On Break</p>
                <h3 className="text-3xl font-bold">{onBreak}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Scheduled breaks</p>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Risk Index</p>
                <h3 className="text-3xl font-bold">{avgRisk}</h3>
              </div>
              <div className={`w-12 h-12 rounded-lg ${avgRisk > 50 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'} flex items-center justify-center`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{getRiskLabel(avgRisk)} overall risk</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-6">Worker Safety Profile</h3>
            <div className="space-y-4">
              {workers.slice(0, 5).map((worker) => (
                <div key={worker.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{worker.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{worker.riskIndex}</span>
                      <Badge variant={worker.riskIndex > 50 ? 'destructive' : 'secondary'}>
                        {getRiskLabel(worker.riskIndex)}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full transition-all ${getRiskColor(worker.riskIndex)}`}
                      style={{ width: `${worker.riskIndex}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-6">Machine Allocation</h3>
            <div className="space-y-3">
              {machines.slice(0, 5).map((machine) => {
                const worker = workers.find((w) => w.id === machine.workerId);
                return (
                  <div key={machine.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{machine.name}</p>
                      <p className="text-xs text-muted-foreground">{machine.id}</p>
                    </div>
                    <div className="text-right">
                      {worker ? (
                        <>
                          <p className="text-sm font-medium">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">{worker.id}</p>
                        </>
                      ) : (
                        <Badge variant="outline">Unassigned</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Worker List</h3>
            <Button variant="outline" size="sm">
              Add Worker
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Risk Index</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.id}</TableCell>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{getStatusBadge(worker.status)}</TableCell>
                  <TableCell>{worker.machineId || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getRiskColor(worker.riskIndex)}`} />
                      <span>{worker.riskIndex}</span>
                    </div>
                  </TableCell>
                  <TableCell>{worker.shift}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Reassign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Workforce;
