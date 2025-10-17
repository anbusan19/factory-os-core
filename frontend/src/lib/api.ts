const API_BASE_URL = 'http://localhost:3001/api';

// Generic API call function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Machine API
export const machineApi = {
  getAll: () => apiCall<any[]>('/machines'),
  getById: (id: string) => apiCall<any>(`/machines/${id}`),
  create: (data: any) => apiCall<any>('/machines', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<any>(`/machines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<any>(`/machines/${id}`, {
    method: 'DELETE',
  }),
};

// Worker API
export const workerApi = {
  getAll: () => apiCall<any[]>('/workers'),
  getById: (id: string) => apiCall<any>(`/workers/${id}`),
  create: (data: any) => apiCall<any>('/workers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<any>(`/workers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<any>(`/workers/${id}`, {
    method: 'DELETE',
  }),
};

// Order API
export const orderApi = {
  getProcurementOrders: () => apiCall<any[]>('/orders/procurement'),
  getFactoryOrders: () => apiCall<any[]>('/orders/factory'),
  getProcurementOrderById: (id: string) => apiCall<any>(`/orders/procurement/${id}`),
  getFactoryOrderById: (id: string) => apiCall<any>(`/orders/factory/${id}`),
  createProcurementOrder: (data: any) => apiCall<any>('/orders/procurement', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createFactoryOrder: (data: any) => apiCall<any>('/orders/factory', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProcurementOrder: (id: string, data: any) => apiCall<any>(`/orders/procurement/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateFactoryOrder: (id: string, data: any) => apiCall<any>(`/orders/factory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Alert API
export const alertApi = {
  getSafetyAlerts: () => apiCall<any[]>('/alerts/safety'),
  getSystemEvents: () => apiCall<any[]>('/alerts/events'),
  createSafetyAlert: (data: any) => apiCall<any>('/alerts/safety', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createSystemEvent: (data: any) => apiCall<any>('/alerts/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSafetyAlert: (id: string, data: any) => apiCall<any>(`/alerts/safety/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Production API
export const productionApi = {
  getProductionData: (params?: { startDate?: string; endDate?: string; machineId?: string; shift?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.machineId) searchParams.append('machineId', params.machineId);
    if (params?.shift) searchParams.append('shift', params.shift);
    
    const queryString = searchParams.toString();
    return apiCall<any[]>(`/production${queryString ? `?${queryString}` : ''}`);
  },
  getChartData: () => apiCall<any[]>('/production/chart'),
  createProductionData: (data: any) => apiCall<any>('/production', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Quality Control API
export const qualityControlApi = {
  detectDefects: (formData: FormData) => {
    return fetch(`${API_BASE_URL}/quality-control/detect`, {
      method: 'POST',
      body: formData,
    });
  },
  checkHealth: () => apiCall<{ status: string; checks: any; timestamp: string }>('/quality-control/health'),
};

// Health check
export const healthApi = {
  check: () => apiCall<{ status: string; timestamp: string }>('/health'),
};
