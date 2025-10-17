const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ API is running successfully!');
    } else {
      console.log('❌ API is not responding correctly');
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Error connecting to API:', error.message);
  console.log('Make sure the server is running with: npm run dev');
});

req.end();