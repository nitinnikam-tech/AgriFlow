import { repository as dualModeStore } from '../repositories/index.js';
import { USER_ROLES } from '../config/constants.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  return jwt.sign(
    { 
      sub: user.id, 
      role: user.role, 
      centreId: user.centreId,
      district: user.district
    }, 
    secret, 
    { expiresIn }
  );
};

export const authController = {
  // Farmer OTP Login Simulation
  sendOtp: async (req, res) => {
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

  verifyOtp: async (req, res) => {
    const { phone, otp } = req.body;
    if (otp !== '123456' && otp !== '2026') {
      return res.status(401).json({ error: 'Invalid OTP. For demo mode, please use 123456.' });
    }

    // Return hero farmer profile (Ramesh Patil)
    const farmer = await dualModeStore.getFarmer('FMR-1002') || {
      id: 'FMR-1002',
      name: 'Ramesh Patil',
      phone: phone || '9876543210',
      village: 'Khed Shivapur',
      district: 'Pune',
      state: 'Maharashtra'
    };
    
    const user = { ...farmer, role: USER_ROLES.FARMER };
    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user
    });
  },

  // Official / Admin Login
  officialLogin: async (req, res) => {
    const { email, password, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dualModeStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ error: 'Account does not have the requested role' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash || '');
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);

    return res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  },

  getProfile: async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (req.user.role === USER_ROLES.FARMER) {
      const farmer = await dualModeStore.getFarmer(req.user.sub);
      if (!farmer) return res.status(404).json({ error: 'User not found' });
      return res.json({ success: true, user: { ...farmer, role: USER_ROLES.FARMER } });
    } else {
      let foundUser = null;
      for (const user of (await dualModeStore.getAllUsers())) {
        if (user.id === req.user.sub) {
          foundUser = user;
          break;
        }
      }
      
      if (!foundUser) return res.status(404).json({ error: 'User not found' });
      const { passwordHash, ...userWithoutPassword } = foundUser;
      return res.json({ success: true, user: userWithoutPassword });
    }
  }
};
