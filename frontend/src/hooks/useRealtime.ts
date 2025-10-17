import { useEffect } from 'react';
import { useFactoryStore } from '@/store/useFactoryStore';
import { toast } from 'sonner';

// Simulated real-time updates using intervals
// In production, replace with actual Socket.IO connection
export const useRealtime = () => {
  useEffect(() => {
    const addSystemEvent = useFactoryStore.getState().addSystemEvent;
    const addSafetyAlert = useFactoryStore.getState().addSafetyAlert;
    const updateMachine = useFactoryStore.getState().updateMachine;

    // Simulate random system events
    const eventInterval = setInterval(() => {
      const eventTypes = ['machine', 'worker', 'procurement', 'quality', 'system'] as const;
      const severities = ['info', 'warning', 'critical'] as const;
      const messages = [
        'Production cycle completed successfully',
        'Quality inspection in progress',
        'Worker shift change initiated',
        'New procurement order received',
        'Machine maintenance scheduled',
      ];

      const randomEvent = {
        id: `E-${Date.now()}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date(),
        severity: severities[Math.floor(Math.random() * severities.length)],
      };

      addSystemEvent(randomEvent);

      // Show toast for critical events
      if (randomEvent.severity === 'critical') {
        toast.error('Critical Event', {
          description: randomEvent.message,
        });
      }
    }, 15000); // Every 15 seconds

    // Simulate occasional safety alerts
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alert = {
          id: `SA-${Date.now()}`,
          type: Math.random() > 0.5 ? 'warning' : 'critical',
          message: 'Temperature threshold exceeded - immediate attention required',
          timestamp: new Date(),
        } as const;

        addSafetyAlert(alert);

        toast.error('Safety Alert', {
          description: alert.message,
        });
      }
    }, 30000); // Every 30 seconds

    // Simulate machine status changes
    const machineInterval = setInterval(() => {
      const machines = useFactoryStore.getState().machines;
      if (machines.length > 0 && Math.random() > 0.6) {
        const randomMachine = machines[Math.floor(Math.random() * machines.length)];
        const statuses = ['active', 'idle', 'fault', 'maintenance'] as const;
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        updateMachine(randomMachine.id, {
          status: newStatus,
          efficiency: Math.floor(Math.random() * 30) + 70,
        });
      }
    }, 20000); // Every 20 seconds

    return () => {
      clearInterval(eventInterval);
      clearInterval(alertInterval);
      clearInterval(machineInterval);
    };
  }, []);
};
