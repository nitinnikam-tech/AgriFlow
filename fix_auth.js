const fs = require('fs');
let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

const replacement = `  verifyOtp: async (req, res) => {
    const { phone, otp, name, village, district, state } = req.body;
    if (otp !== '123456' && otp !== '2026') {
      return res.status(401).json({ error: 'Invalid OTP. For demo mode, please use 123456.' });
    }

    // Return hero farmer profile (Ramesh Patil)
    let farmer = await dualModeStore.getFarmer('FMR-1002');
    if (!farmer) {
      farmer = {
        id: 'FMR-1002',
        name: name || 'Ramesh Patil',
        phone: phone || '9876543210',
        village: village || 'Khed Shivapur',
        district: district || 'Pune',
        state: state || 'Maharashtra'
      };
    } else {
      if (name) farmer.name = name;
      if (phone) farmer.phone = phone;
      if (village) farmer.village = village;
      if (district) farmer.district = district;
      if (state) farmer.state = state;
    }`;

content = content.replace(/  verifyOtp: async \(req, res\) => {[\s\S]*?state: 'Maharashtra'\n    };/, replacement);
fs.writeFileSync('server/controllers/authController.js', content);
console.log('Fixed authController.js');
