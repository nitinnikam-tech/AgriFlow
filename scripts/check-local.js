const http = require('http');

const checkEndpoint = (name, url) => {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`[PASS] ${name} is reachable (${url})`);
        resolve(true);
      } else {
        console.log(`[FAIL] ${name} returned status ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`[FAIL] ${name} is NOT reachable (${url}). Error: ${err.message}`);
      resolve(false);
    });
  });
};

const checkSocket = (name, url) => {
  return new Promise((resolve) => {
    const req = http.request(url, {
      method: 'GET',
      headers: { 'Upgrade': 'websocket', 'Connection': 'Upgrade' }
    });
    req.on('response', (res) => {
      console.log(`[PASS] ${name} is reachable (${url})`);
      resolve(true);
    });
    req.on('error', (err) => {
      console.log(`[FAIL] ${name} is NOT reachable (${url}). Error: ${err.message}`);
      resolve(false);
    });
    req.end();
  });
};

async function runChecks() {
  console.log('====================================');
  console.log(' AGRIFLOW LOCAL ENVIRONMENT CHECK   ');
  console.log('====================================\n');
  
  await checkEndpoint('Frontend', 'http://localhost:5173/');
  await checkEndpoint('Backend API Health', 'http://localhost:5000/health');
  await checkEndpoint('ML Service Health', 'http://localhost:8000/docs');
  await checkEndpoint('Authentication API', 'http://localhost:5000/api/auth/login');
  await checkEndpoint('Queue API', 'http://localhost:5000/api/queue/live/PC-PUNE-01');
  
  // Socket.IO simple ping check on polling endpoint
  await checkEndpoint('Socket.IO', 'http://localhost:5000/socket.io/?EIO=4&transport=polling');

  console.log('\n====================================');
  console.log(' Check complete.');
}

runChecks();
