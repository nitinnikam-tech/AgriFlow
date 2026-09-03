import { TOKEN_STATUS, USER_ROLES, CONGESTION_LEVELS, CROPS_CONFIG } from '../config/constants.js';

class DualModeStore {
  constructor() {
    this.farmers = new Map();
    this.centres = new Map();
    this.counters = new Map();
    this.slots = new Map();
    this.tokens = new Map();
    this.qualityInspections = new Map();
    this.payments = new Map();
    this.auditLogs = [];
    this.notifications = new Map();
    this.users = new Map();
    this.recommendations = new Map();
    this.demoScenarioStep = 0;
    this.isSimulatingCongestion = false;

    this.initSeedData();
  }

  initSeedData() {
    // 1. Seed Procurement Centres
    const puneCentre = {
      id: 'PC-PUNE-01',
      name: 'Pune District APMC Procurement Centre',
      shortName: 'Pune Centre',
      code: 'MH-PUN-01',
      district: 'Pune',
      state: 'Maharashtra',
      location: { lat: 18.5204, lng: 73.8567, address: 'Market Yard, Gultekdi, Pune - 411037' },
      geofenceRadiusMeters: 500,
      totalCounters: 6,
      activeCounters: 4,
      dailyCapacity: 300,
      operatingHours: { open: '08:00', close: '18:00' },
      status: 'ACTIVE',
      supportedCrops: ['WHEAT', 'SOYBEAN', 'CHANA', 'MAIZE'],
      totalProcessedToday: 198,
      totalWaitingToday: 43,
      totalBookedToday: 247,
      avgProcessingTimeMin: 5.8
    };

    const nashikCentre = {
      id: 'PC-NASHIK-02',
      name: 'Nashik Grain & Pulse Procurement Mandi',
      shortName: 'Nashik Mandi',
      code: 'MH-NSK-02',
      district: 'Nashik',
      state: 'Maharashtra',
      location: { lat: 19.9975, lng: 73.7898, address: 'Panchavati APMC, Nashik - 422003' },
      geofenceRadiusMeters: 500,
      totalCounters: 5,
      activeCounters: 3,
      dailyCapacity: 250,
      operatingHours: { open: '08:30', close: '17:30' },
      status: 'ACTIVE',
      supportedCrops: ['WHEAT', 'PADDY', 'COTTON', 'SOYBEAN'],
      totalProcessedToday: 142,
      totalWaitingToday: 28,
      totalBookedToday: 180,
      avgProcessingTimeMin: 6.1
    };

    const laturCentre = {
      id: 'PC-LATUR-03',
      name: 'Latur Agri Procurement Depot',
      shortName: 'Latur Depot',
      code: 'MH-LTR-03',
      district: 'Latur',
      state: 'Maharashtra',
      location: { lat: 18.4088, lng: 76.5604, address: 'MIDC Phase 2, Latur - 413512' },
      geofenceRadiusMeters: 600,
      totalCounters: 4,
      activeCounters: 3,
      dailyCapacity: 200,
      operatingHours: { open: '09:00', close: '18:00' },
      status: 'ACTIVE',
      supportedCrops: ['SOYBEAN', 'CHANA', 'COTTON'],
      totalProcessedToday: 110,
      totalWaitingToday: 19,
      totalBookedToday: 135,
      avgProcessingTimeMin: 5.4
    };

    this.centres.set(puneCentre.id, puneCentre);
    this.centres.set(nashikCentre.id, nashikCentre);
    this.centres.set(laturCentre.id, laturCentre);

    // 2. Seed Counters for Pune Centre (Counters 1-4 active, 5 standby, 6 inactive)
    const puneCounters = [
      { id: 'CNT-PUN-01', centreId: 'PC-PUNE-01', counterNumber: 1, officerName: 'Sanjay Deshmukh', officerRole: 'Procurement Officer', status: 'PROCESSING', currentToken: 'A-109', currentCrop: 'WHEAT', tokensProcessedToday: 54, avgProcessingTimeMin: 5.4, utilizationPercent: 92 },
      { id: 'CNT-PUN-02', centreId: 'PC-PUNE-01', counterNumber: 2, officerName: 'Vandana Kulkarni', officerRole: 'Quality Inspector', status: 'PROCESSING', currentToken: 'A-110', currentCrop: 'SOYBEAN', tokensProcessedToday: 48, avgProcessingTimeMin: 6.1, utilizationPercent: 84 },
      { id: 'CNT-PUN-03', centreId: 'PC-PUNE-01', counterNumber: 3, officerName: 'Rajesh Shinde', officerRole: 'Procurement Officer', status: 'PROCESSING', currentToken: 'A-111', currentCrop: 'WHEAT', tokensProcessedToday: 51, avgProcessingTimeMin: 5.2, utilizationPercent: 78 },
      { id: 'CNT-PUN-04', centreId: 'PC-PUNE-01', counterNumber: 4, officerName: 'Pooja Gaikwad', officerRole: 'Weighing In-charge', status: 'PROCESSING', currentToken: 'A-112', currentCrop: 'CHANA', tokensProcessedToday: 45, avgProcessingTimeMin: 5.9, utilizationPercent: 81 },
      { id: 'CNT-PUN-05', centreId: 'PC-PUNE-01', counterNumber: 5, officerName: 'Anil Jadhav', officerRole: 'Reserve Officer', status: 'STANDBY', currentToken: null, currentCrop: null, tokensProcessedToday: 0, avgProcessingTimeMin: 5.5, utilizationPercent: 0 },
      { id: 'CNT-PUN-06', centreId: 'PC-PUNE-01', counterNumber: 6, officerName: 'Deepak More', officerRole: 'Reserve Officer', status: 'INACTIVE', currentToken: null, currentCrop: null, tokensProcessedToday: 0, avgProcessingTimeMin: 5.5, utilizationPercent: 0 }
    ];
    puneCounters.forEach(c => this.counters.set(c.id, c));

    // 3. Seed Farmers
    const heroFarmer = {
      id: 'FMR-1002',
      name: 'Ramesh Patil (रमेश पाटील)',
      phone: '9876543210',
      aadhaarLast4: '4829',
      village: 'Khed Shivapur',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      bankDetails: { bankName: 'State Bank of India', ifsc: 'SBIN0001234', accountLast4: '7712' },
      landAreaAcres: 4.5,
      preferredLanguage: 'en',
      createdAt: new Date('2026-01-15T09:00:00Z')
    };
    this.farmers.set(heroFarmer.id, heroFarmer);

    const mockFarmerNames = [
      'Suresh Chavan', 'Tukaram Pawar', 'Dnyaneshwar Shinde', 'Ganesh Kadam',
      'Sunil Ghorpade', 'Santosh Mane', 'Balu Thorat', 'Kailas Jagtap',
      'Pravin Bhosale', 'Pandurang More', 'Vikas Salunkhe', 'Nitin Waghmare',
      'Mahadev Raut', 'Sachin Darekar', 'Ashok Gaikwad', 'Dattatray Shirole',
      'Popat Bandal', 'Bhagwan Mohite', 'Vijay Nikam', 'Hanumant Sonawane'
    ];

    mockFarmerNames.forEach((name, index) => {
      const fId = `FMR-${1003 + index}`;
      this.farmers.set(fId, {
        id: fId,
        name,
        phone: `98765${String(43211 + index).padStart(5, '0')}`,
        aadhaarLast4: String(1000 + index * 37).slice(-4),
        village: `Village ${index + 1}`,
        district: 'Pune',
        state: 'Maharashtra',
        bankDetails: { bankName: 'Bank of Maharashtra', ifsc: 'MAHB0000456', accountLast4: String(3000 + index) },
        landAreaAcres: 3.0 + (index % 5),
        preferredLanguage: index % 2 === 0 ? 'mr' : 'hi'
      });
    });

    // 4. Seed Slots for Pune Centre
    const timeSlots = [
      { id: 'SLOT-0830', timeWindow: '08:30 AM - 09:00 AM', startTime: '08:30', endTime: '09:00', maxCapacity: 25, bookedCount: 25, congestion: CONGESTION_LEVELS.HIGH },
      { id: 'SLOT-0900', timeWindow: '09:00 AM - 09:30 AM', startTime: '09:00', endTime: '09:30', maxCapacity: 30, bookedCount: 30, congestion: CONGESTION_LEVELS.HIGH },
      { id: 'SLOT-0930', timeWindow: '09:30 AM - 10:00 AM', startTime: '09:30', endTime: '10:00', maxCapacity: 30, bookedCount: 29, congestion: CONGESTION_LEVELS.HIGH },
      { id: 'SLOT-1000', timeWindow: '10:00 AM - 10:30 AM', startTime: '10:00', endTime: '10:30', maxCapacity: 30, bookedCount: 27, congestion: CONGESTION_LEVELS.MEDIUM },
      { id: 'SLOT-1030', timeWindow: '10:30 AM - 11:00 AM', startTime: '10:30', endTime: '11:00', maxCapacity: 30, bookedCount: 16, congestion: CONGESTION_LEVELS.LOW, isRecommended: true, reason: 'Low predicted congestion & 4 active counters with short wait times' },
      { id: 'SLOT-1100', timeWindow: '11:00 AM - 11:30 AM', startTime: '11:00', endTime: '11:30', maxCapacity: 30, bookedCount: 12, congestion: CONGESTION_LEVELS.LOW, isRecommended: true, reason: 'Optimal counter workload and rapid processing speed' },
      { id: 'SLOT-1130', timeWindow: '11:30 AM - 12:00 PM', startTime: '11:30', endTime: '12:00', maxCapacity: 30, bookedCount: 10, congestion: CONGESTION_LEVELS.LOW },
      { id: 'SLOT-1200', timeWindow: '12:00 PM - 12:30 PM', startTime: '12:00', endTime: '12:30', maxCapacity: 25, bookedCount: 18, congestion: CONGESTION_LEVELS.MEDIUM },
      { id: 'SLOT-1230', timeWindow: '12:30 PM - 01:00 PM', startTime: '12:30', endTime: '01:00', maxCapacity: 20, bookedCount: 19, congestion: CONGESTION_LEVELS.HIGH }
    ];
    timeSlots.forEach(s => {
      this.slots.set(s.id, { ...s, centreId: 'PC-PUNE-01', date: '2026-09-02' });
    });

    // 5. Seed Queue and Tokens (Hero baseline)
    for (let i = 1; i <= 108; i++) {
      const tokId = `TOK-PUN-${String(i).padStart(3, '0')}`;
      const tokNum = `A-${String(i).padStart(3, '0')}`;
      this.tokens.set(tokNum, {
        id: tokId,
        tokenNumber: tokNum,
        centreId: 'PC-PUNE-01',
        farmerId: `FMR-${1003 + (i % 20)}`,
        farmerName: mockFarmerNames[i % mockFarmerNames.length],
        farmerPhone: '9876500000',
        cropType: 'WHEAT',
        quantityKg: 500 + (i % 10) * 50,
        slotId: 'SLOT-0830',
        status: TOKEN_STATUS.COMPLETED,
        counterId: 'CNT-PUN-01',
        queuePosition: 0,
        createdAt: new Date('2026-09-02T08:00:00Z'),
        completedAt: new Date('2026-09-02T09:30:00Z')
      });
    }

    const inProcessing = [
      { num: 'A-109', cnt: 'CNT-PUN-01', crop: 'WHEAT', qty: 620, fmr: 'Suresh Chavan', fmrId: 'FMR-1003' },
      { num: 'A-110', cnt: 'CNT-PUN-02', crop: 'SOYBEAN', qty: 450, fmr: 'Tukaram Pawar', fmrId: 'FMR-1004' },
      { num: 'A-111', cnt: 'CNT-PUN-03', crop: 'WHEAT', qty: 580, fmr: 'Dnyaneshwar Shinde', fmrId: 'FMR-1005' },
      { num: 'A-112', cnt: 'CNT-PUN-04', crop: 'CHANA', qty: 400, fmr: 'Ganesh Kadam', fmrId: 'FMR-1006' }
    ];

    inProcessing.forEach((p, idx) => {
      this.tokens.set(p.num, {
        id: `TOK-PUN-${p.num}`,
        tokenNumber: p.num,
        centreId: 'PC-PUNE-01',
        farmerId: p.fmrId,
        farmerName: p.fmr,
        farmerPhone: '9876543210',
        cropType: p.crop,
        quantityKg: p.qty,
        slotId: 'SLOT-1000',
        status: TOKEN_STATUS.PROCESSING,
        counterId: p.cnt,
        queuePosition: 0,
        estimatedWaitMin: 0,
        startedAt: new Date(Date.now() - (idx + 1) * 90000)
      });
    });

    for (let i = 113; i <= 126; i++) {
      const tokNum = `A-${i}`;
      this.tokens.set(tokNum, {
        id: `TOK-PUN-${tokNum}`,
        tokenNumber: tokNum,
        centreId: 'PC-PUNE-01',
        farmerId: `FMR-${1000 + (i % 20)}`,
        farmerName: mockFarmerNames[i % mockFarmerNames.length],
        farmerPhone: '9876543210',
        cropType: (i % 3 === 0) ? 'SOYBEAN' : (i % 2 === 0) ? 'CHANA' : 'WHEAT',
        quantityKg: 450 + (i % 6) * 70,
        slotId: 'SLOT-1030',
        status: TOKEN_STATUS.WAITING,
        counterId: null,
        queuePosition: i - 112,
        estimatedWaitMin: Math.round(((i - 112) * 5.8) / 4) + 4,
        createdAt: new Date('2026-09-02T09:15:00Z')
      });
    }

    const heroToken = {
      id: 'TOK-PUN-A127',
      tokenNumber: 'A-127',
      centreId: 'PC-PUNE-01',
      centreName: 'Pune District APMC Procurement Centre',
      farmerId: 'FMR-1002',
      farmerName: 'Ramesh Patil (रमेश पाटील)',
      farmerPhone: '9876543210',
      cropType: 'WHEAT',
      quantityKg: 520,
      expectedBags: 11,
      slotId: 'SLOT-1030',
      slotTimeWindow: '10:30 AM - 11:00 AM',
      date: new Date().toISOString().split('T')[0],
      status: TOKEN_STATUS.BOOKED,
      queuePosition: 15,
      peopleAhead: 18,
      activeCounters: 4,
      avgProcessingTimeMin: 5.8,
      estimatedWaitMin: 32,
      recommendedArrivalTime: '10:42 AM',
      predictedCongestion: CONGESTION_LEVELS.LOW,
      confidenceScore: 89,
      qrCodeData: JSON.stringify({ token: 'A-127', centre: 'PC-PUNE-01', farmer: 'FMR-1002', date: '2026-09-02', securityHash: 'AGF-SEC-99214' }),
      geofenceStatus: { distanceMeters: 420, radiusMeters: 500, isInside: true, statusText: 'Within Mandi Geofence Zone' },
      procurementTimeline: [
        { stage: 'SLOT_BOOKED', label: 'Slot Booked', timestamp: '2026-09-02T08:30:00Z', isCompleted: true },
        { stage: 'CHECKED_IN', label: 'Mandi Check-In', timestamp: '2026-09-02T10:15:00Z', isCompleted: true },
        { stage: 'QUEUE_WAITING', label: 'In Smart Queue', timestamp: '2026-09-02T10:15:00Z', isCompleted: true },
        { stage: 'COUNTER_CALL', label: 'Counter Assignment', timestamp: null, isCompleted: false },
        { stage: 'QUALITY_WEIGHING', label: 'Quality & Weighing', timestamp: null, isCompleted: false },
        { stage: 'PROCURED', label: 'Procurement Approved', timestamp: null, isCompleted: false },
        { stage: 'PAYMENT_CREDITED', label: 'Payment Credited', timestamp: null, isCompleted: false }
      ],
      qualityDetails: null,
      paymentDetails: {
        estimatedAmountInr: 12480,
        status: 'PENDING',
        transactionRef: null
      },
      createdAt: new Date('2026-09-02T08:30:00Z')
    };
    this.tokens.set(heroToken.tokenNumber, heroToken);

    for (let i = 128; i <= 155; i++) {
      const tokNum = `A-${i}`;
      this.tokens.set(tokNum, {
        id: `TOK-PUN-${tokNum}`,
        tokenNumber: tokNum,
        centreId: 'PC-PUNE-01',
        farmerId: `FMR-${1000 + (i % 20)}`,
        farmerName: mockFarmerNames[i % mockFarmerNames.length],
        farmerPhone: '9876543210',
        cropType: 'WHEAT',
        quantityKg: 500,
        slotId: 'SLOT-1100',
        status: TOKEN_STATUS.WAITING,
        queuePosition: i - 112,
        estimatedWaitMin: Math.round(((i - 112) * 5.8) / 4) + 4,
        createdAt: new Date('2026-09-02T09:30:00Z')
      });
    }

    this.users.set('officer@agriflow.gov.in', {
      id: 'USR-OFF-01',
      name: 'Sanjay Deshmukh',
      email: 'officer@agriflow.gov.in',
      role: USER_ROLES.OFFICER,
      centreId: 'PC-PUNE-01',
      counterId: 'CNT-PUN-01',
      passwordHash: '$2b$10$mJEwDN5PRXXZ2HUVRvv12.eEXvXrQnFsAuFnOR6MXa6jRAPifhZUK'
    });

    this.users.set('admin@agriflow.gov.in', {
      id: 'USR-ADM-01',
      name: 'Dr. Vivek Sharma (Director DoCA)',
      email: 'admin@agriflow.gov.in',
      role: USER_ROLES.CENTRE_ADMIN,
      centreId: 'PC-PUNE-01',
      passwordHash: '$2b$10$mJEwDN5PRXXZ2HUVRvv12.eEXvXrQnFsAuFnOR6MXa6jRAPifhZUK'
    });

    this.users.set('district@agriflow.gov.in', {
      id: 'USR-DST-01',
      name: 'Priyanka Patil (District Collector Officer)',
      email: 'district@agriflow.gov.in',
      role: USER_ROLES.DISTRICT_ADMIN,
      district: 'Pune',
      passwordHash: '$2b$10$mJEwDN5PRXXZ2HUVRvv12.eEXvXrQnFsAuFnOR6MXa6jRAPifhZUK'
    });

    this.notifications.set('FMR-1002', [
      {
        id: 'NOTIF-01',
        title: 'Smart Slot Confirmed',
        body: 'Slot booked for Wheat at Pune APMC Mandi. Recommended arrival: 10:42 AM.',
        type: 'CONFIRMATION',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true
      },
      {
        id: 'NOTIF-02',
        title: 'Queue Live Radar Active',
        body: 'Your token A-127 is in queue. 18 farmers ahead across 4 active counters. ETA: 32 mins.',
        type: 'QUEUE_UPDATE',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        read: false
      }
    ]);
  }

  getCentre(id) { return this.centres.get(id) || this.centres.get('PC-PUNE-01'); }
  getAllCentres() { return Array.from(this.centres.values()); }
  saveCentre(centreData) { this.centres.set(centreData.id, centreData); return centreData; }

  getCountersByCentre(centreId) { return Array.from(this.counters.values()).filter(c => c.centreId === centreId); }
  getCounter(counterId) { return this.counters.get(counterId); }
  saveCounter(counterId, counterData) { this.counters.set(counterId, counterData); return counterData; }

  getSlotsByCentre(centreId) { return Array.from(this.slots.values()).filter(s => s.centreId === centreId); }
  getSlot(slotId) { return this.slots.get(slotId); }
  saveSlot(slotId, slotData) { this.slots.set(slotId, slotData); return slotData; }

  getToken(tokenNumber) { return this.tokens.get(tokenNumber); }
  getTokensByCentre(centreId) { return Array.from(this.tokens.values()).filter(t => t.centreId === centreId); }
  saveToken(tokenNumber, tokenData) { this.tokens.set(tokenNumber, tokenData); return tokenData; }
  getTokensCount() { return this.tokens.size; }
  getAllTokens() { return Array.from(this.tokens.values()); }

  getFarmer(id) { return this.farmers.get(id); }
  saveFarmer(farmerData) { this.farmers.set(farmerData.id, farmerData); return farmerData; }

  getUserByEmail(email) { return this.users.get(email); }
  saveUser(userData) { this.users.set(userData.email, userData); return userData; }
  getAllUsers() { return Array.from(this.users.values()); }

  saveQualityInspection(tokenNumber, record) { this.qualityInspections.set(tokenNumber, record); return record; }

  getDemoScenarioStep() { return this.demoScenarioStep; }
  setDemoScenarioStep(step) { this.demoScenarioStep = step; }
  
  getIsSimulatingCongestion() { return this.isSimulatingCongestion; }
  setIsSimulatingCongestion(value) { this.isSimulatingCongestion = value; }

  getFarmerNotifications(farmerId) { return this.notifications.get(farmerId) || []; }

  addNotification(farmerId, notification) {
    if (!this.notifications.has(farmerId)) {
      this.notifications.set(farmerId, []);
    }
    const notifs = this.notifications.get(farmerId);
    notifs.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    });
    return notifs;
  }

  getRecommendationsByCentre(centreId) {
    return Array.from(this.recommendations.values())
      .filter(r => r.centreId === centreId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getRecommendation(id) {
    return this.recommendations.get(id);
  }

  saveRecommendation(rec) {
    this.recommendations.set(rec.id, rec);
    return rec;
  }
}

export const dualModeStore = new DualModeStore();
