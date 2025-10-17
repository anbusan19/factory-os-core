// Test script to verify frontend-backend integration

const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Factory OS Backend API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test machines endpoint
    console.log('\n2. Testing machines endpoint...');
    const machinesResponse = await fetch(`${API_BASE_URL}/machines`);
    const machines = await machinesResponse.json();
    console.log(`✅ Found ${machines.length} machines`);
    console.log('Sample machine:', machines[0]);
    
    // Test workers endpoint
    console.log('\n3. Testing workers endpoint...');
    const workersResponse = await fetch(`${API_BASE_URL}/workers`);
    const workers = await workersResponse.json();
    console.log(`✅ Found ${workers.length} workers`);
    console.log('Sample worker:', workers[0]);
    
    // Test orders endpoint
    console.log('\n4. Testing orders endpoint...');
    const factoryOrdersResponse = await fetch(`${API_BASE_URL}/orders/factory`);
    const factoryOrders = await factoryOrdersResponse.json();
    console.log(`✅ Found ${factoryOrders.length} factory orders`);
    
    const procurementOrdersResponse = await fetch(`${API_BASE_URL}/orders/procurement`);
    const procurementOrders = await procurementOrdersResponse.json();
    console.log(`✅ Found ${procurementOrders.length} procurement orders`);
    
    // Test alerts endpoint
    console.log('\n5. Testing alerts endpoint...');
    const alertsResponse = await fetch(`${API_BASE_URL}/alerts/events`);
    const alerts = await alertsResponse.json();
    console.log(`✅ Found ${alerts.length} system events`);
    
    // Test production endpoint
    console.log('\n6. Testing production endpoint...');
    const productionResponse = await fetch(`${API_BASE_URL}/production/chart`);
    const productionData = await productionResponse.json();
    console.log(`✅ Found ${productionData.length} production data points`);
    
    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('✅ Frontend can now use real data from the backend database.');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   cd backend && npm start');
  }
}

testAPI();
