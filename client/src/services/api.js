const rawUrl = import.meta.env.VITE_API_URL || '';
const API_BASE = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

const apiFetch = async (url, options = {}) => {
  const token = sessionStorage.getItem('agriflow_jwt');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    sessionStorage.removeItem('agriflow_jwt');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please login again.');
  }

  if (response.status === 403) { const errData = await response.json().catch(()=>({})); throw new Error(errData.error || 'Insufficient permissions to perform this action.'); }

  return response.json();
};

export const api = {
  // Auth
  sendOtp: (phone) => apiFetch(`${API_BASE}/auth/otp/send`, { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp) => apiFetch(`${API_BASE}/auth/otp/verify`, { method: 'POST', body: JSON.stringify({ phone, otp }) }),
  getProfile: () => apiFetch(API_BASE + '/auth/profile', { cache: 'no-store' }),
  officialLogin: (email, password, role) => apiFetch(`${API_BASE}/auth/official/login`, { method: 'POST', body: JSON.stringify({ email, password, role }) }),

  // Centres
  getCentres: () => apiFetch(`${API_BASE}/centres`),
  getCentre: (id) => apiFetch(`${API_BASE}/centres/${id}`),
  getDigitalTwin: (id) => apiFetch(`${API_BASE}/centres/${id}/digital-twin`),
  getCrowdForecast: (id) => apiFetch(`${API_BASE}/centres/${id}/crowd-forecast`),

  // Slots
  getSlots: (centreId) => apiFetch(`${API_BASE}/slots?centreId=${centreId}`),
  getOptimizationProposal: (centreId) => apiFetch(`${API_BASE}/slots/optimization-proposal?centreId=${centreId}`),
  applyOptimization: (centreId) => apiFetch(`${API_BASE}/slots/apply-optimization`, { method: 'POST', body: JSON.stringify({ centreId }) }),

  // Tokens
  getToken: (tokenNumber) => apiFetch(`${API_BASE}/tokens/${tokenNumber}`),
  bookToken: (tokenData) => apiFetch(`${API_BASE}/tokens/book`, { method: 'POST', body: JSON.stringify(tokenData) }),
  verifyQrCheckIn: (qrData) => apiFetch(`${API_BASE}/tokens/verify-qr`, { method: 'POST', body: JSON.stringify({ qrData }) }),

  // Queue
  getLiveQueue: (centreId) => apiFetch(`${API_BASE}/queue/live?centreId=${centreId || 'PC-PUNE-01'}`),
  getFarmerETA: (tokenNumber, centreId) => apiFetch(`${API_BASE}/queue/eta/${tokenNumber}?centreId=${centreId || 'PC-PUNE-01'}`),

  // Official
  getCounters: (centreId) => apiFetch(`${API_BASE}/official/counters?centreId=${centreId || 'PC-PUNE-01'}`),
  getWorkloadBalancing: (centreId) => apiFetch(`${API_BASE}/official/workload-balancing?centreId=${centreId || 'PC-PUNE-01'}`),

  // Quality & Payment
  submitQualityInspection: (data) => apiFetch(`${API_BASE}/quality/inspect`, { method: 'POST', body: JSON.stringify(data) }),
  getPaymentStatus: (tokenNumber) => apiFetch(`${API_BASE}/payments/${tokenNumber}`),
  simulatePaymentCredit: (tokenNumber) => apiFetch(`${API_BASE}/payments/simulate-credit`, { method: 'POST', body: JSON.stringify({ tokenNumber }) }),

  // Analytics
  getAnalytics: (centreId) => apiFetch(`${API_BASE}/analytics/dashboard?centreId=${centreId || 'PC-PUNE-01'}`),

  // Notifications
  getFarmerNotifications: (farmerId) => apiFetch(`${API_BASE}/notifications/farmer/${farmerId || 'FMR-1002'}`),

  // Demo
  getDemoState: () => apiFetch(`${API_BASE}/demo/state`),
  advanceDemoStep: (step) => apiFetch(`${API_BASE}/demo/advance`, { method: 'POST', body: JSON.stringify({ step }) }),
  resetDemo: () => apiFetch(`${API_BASE}/demo/reset`, { method: 'POST' }),

  // AI Command Panel
  getAIRecommendations: () => apiFetch(`${API_BASE}/ai/recommendations`),
  approveAIRecommendation: (id) => apiFetch(`${API_BASE}/ai/recommendations/${id}/approve`, { method: 'POST' }),
  dismissAIRecommendation: (id) => apiFetch(`${API_BASE}/ai/recommendations/${id}/dismiss`, { method: 'POST' }),
  getModelHealth: () => apiFetch(`${API_BASE}/ai/health`)
};





