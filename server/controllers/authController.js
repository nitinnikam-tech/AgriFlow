import { dualModeStore } from '../utils/dualModeStore.js';
import { USER_ROLES } from '../config/constants.js';

export const authController = {
  // Farmer OTP Login Simulation
  sendOtp: (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });
    
    // For demo/prototype, simulate fixed OTP 123456
    return res.json({
      success: true,
      message: 'OTP sent successfully (Simulated)',
      phone,
      debugOtp: '123456',
      expiresInSeconds: 300
    });
  },

  verifyOtp: (req, res) => {
    const { phone, otp } = req.body;
    if (otp !== '123456' && otp !== '2026') {
      return res.status(400).json({ error: 'Invalid OTP. For demo mode, please use 123456.' });
    }

    // Return hero farmer profile (Ramesh Patil)
    const farmer = dualModeStore.getFarmer('FMR-1002') || {
      id: 'FMR-1002',
      name: 'Ramesh Patil',
      phone: phone || '9876543210',
      village: 'Khed Shivapur',
      district: 'Pune',
      state: 'Maharashtra'
    };

    return res.json({
      success: true,
      token: 'jwt_mock_farmer_session_token',
      user: {
        ...farmer,
        role: USER_ROLES.FARMER
      }
    });
  },

  // Official / Admin Login
  officialLogin: (req, res) => {
    const { email, password, role } = req.body;
    const user = dualModeStore.users.get(email) || {
      id: 'USR-OFF-01',
      name: 'Sanjay Deshmukh',
      email: email || 'officer@agriflow.gov.in',
      role: role || USER_ROLES.OFFICER,
      centreId: 'PC-PUNE-01',
      counterId: 'CNT-PUN-01'
    };

    return res.json({
      success: true,
      token: 'jwt_mock_official_session_token',
      user
    });
  },

  getProfile: (req, res) => {
    const farmer = dualModeStore.getFarmer('FMR-1002');
    return res.json({ success: true, user: farmer });
  }
};
