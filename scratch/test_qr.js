const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testQrCheckIn() {
  try {
    const officerLogin = await axios.post('http://localhost:5000/api/auth/official/login', { email: 'officer@agriflow.gov.in', password: 'password123' });
    console.log("WAIT! I can't login with password123. The actual password is 123456.");
  } catch (err) {
    console.error("Login failed:", err.message);
  }

  try {
    const officerLogin2 = await axios.post('http://localhost:5000/api/auth/official/login', { email: 'officer@agriflow.gov.in', password: '123456' });
    const officerToken = officerLogin2.data.token;
    console.log("Logged in! Token:", !!officerToken);
    
    // Now simulate scanning QR
    const qrData = { token: 'A-127', centre: 'PC-PUNE-01', farmer: 'FMR-1002' };
    const res = await axios.post('http://localhost:5000/api/tokens/verify-qr', { qrData }, {
      headers: { Authorization: `Bearer ${officerToken}` }
    });
    console.log("Check-in successful! Response:", res.data);
  } catch(err) {
    console.error("Check-in failed:", err.message);
    if (err.response) console.error(err.response.data);
  }
}

testQrCheckIn();
