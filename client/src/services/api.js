const API_BASE = '/api';

export const api = {
  // Auth
  sendOtp: (phone) => fetch(`${API_BASE}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  }).then(r => r.json()),

  verifyOtp: (phone, otp) => fetch(`${API_BASE}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  }).then(r => r.json()),

  // Centres
  getCentres: () => fetch(`${API_BASE}/centres`).then(r => r.json()),
  getCentre: (id) => fetch(`${API_BASE}/centres/${id}`).then(r => r.json()),
  getDigitalTwin: (id) => fetch(`${API_BASE}/centres/${id}/digital-twin`).then(r => r.json()),
  getCrowdForecast: (id) => fetch(`${API_BASE}/centres/${id}/crowd-forecast`).then(r => r.json()),

  // Slots
  getSlots: (centreId) => fetch(`${API_BASE}/slots?centreId=${centreId}`).then(r => r.json()),
  getOptimizationProposal: (centreId) => fetch(`${API_BASE}/slots/optimization-proposal?centreId=${centreId}`).then(r => r.json()),
  applyOptimization: (centreId) => fetch(`${API_BASE}/slots/apply-optimization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ centreId })
  }).then(r => r.json()),

  // Tokens
  getToken: (tokenNumber) => fetch(`${API_BASE}/tokens/${tokenNumber}`).then(r => r.json()),
  bookToken: (tokenData) => fetch(`${API_BASE}/tokens/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokenData)
  }).then(r => r.json()),
  verifyQrCheckIn: (qrData) => fetch(`${API_BASE}/tokens/verify-qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrData })
  }).then(r => r.json()),

  // Queue
  getLiveQueue: (centreId) => fetch(`${API_BASE}/queue/live?centreId=${centreId || 'PC-PUNE-01'}`).then(r => r.json()),
  getFarmerETA: (tokenNumber, centreId) => fetch(`${API_BASE}/queue/eta/${tokenNumber}?centreId=${centreId || 'PC-PUNE-01'}`).then(r => r.json()),

  // Official
  getCounters: (centreId) => fetch(`${API_BASE}/official/counters?centreId=${centreId || 'PC-PUNE-01'}`).then(r => r.json()),
  getWorkloadBalancing: (centreId) => fetch(`${API_BASE}/official/workload-balancing?centreId=${centreId || 'PC-PUNE-01'}`).then(r => r.json()),

  // Quality & Payment
  submitQualityInspection: (data) => fetch(`${API_BASE}/quality/inspect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getPaymentStatus: (tokenNumber) => fetch(`${API_BASE}/payments/${tokenNumber}`).then(r => r.json()),
  simulatePaymentCredit: (tokenNumber) => fetch(`${API_BASE}/payments/simulate-credit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenNumber })
  }).then(r => r.json()),

  // Analytics
  getAnalytics: (centreId) => fetch(`${API_BASE}/analytics/dashboard?centreId=${centreId || 'PC-PUNE-01'}`).then(r => r.json()),

  // Notifications
  getFarmerNotifications: (farmerId) => fetch(`${API_BASE}/notifications/farmer/${farmerId || 'FMR-1002'}`).then(r => r.json()),

  // Demo
  getDemoState: () => fetch(`${API_BASE}/demo/state`).then(r => r.json()),
  advanceDemoStep: (step) => fetch(`${API_BASE}/demo/advance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step })
  }).then(r => r.json()),
  resetDemo: () => fetch(`${API_BASE}/demo/reset`, { method: 'POST' }).then(r => r.json())
};
