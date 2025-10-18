// Simple test script to verify API endpoints
// Run with: node test-endpoints.js

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3001';

const endpoints = [
  '/api/health',
  '/api/machines',
  '/api/workers',
  '/api/orders/procurement',
  '/api/orders/factory',
  '/api/alerts/safety',
  '/api/alerts/events',
  '/api/production'
];

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const status = response.status;
    const isOk = status >= 200 && status < 400;
    
    console.log(`${endpoint}: ${status} ${isOk ? '✅' : '❌'}`);
    
    if (!isOk) {
      const text = await response.text();
      console.log(`  Error: ${text}`);
    }
  } catch (error) {
    console.log(`${endpoint}: ERROR - ${error.message}`);
  }
}

async function runTests() {
  console.log(`Testing endpoints against: ${BASE_URL}`);
  console.log('='.repeat(50));
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('='.repeat(50));
  console.log('Test completed!');
}

runTests();
