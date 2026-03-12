const https = require('https');
const http = require('http');

function testAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const protocol = endpoint.startsWith('https') ? https : http;
    
    protocol.get(endpoint, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    console.log('Testing API endpoints...\n');

    // Test water level API
    console.log('Testing /api/data/water-level...');
    const waterLevelData = await testAPI('http://localhost:3000/api/data/water-level');
    console.log('Water level data:', waterLevelData);
    console.log('Number of records:', waterLevelData.length);

    console.log('\nTesting /api/data/rainfall...');
    const rainfallData = await testAPI('http://localhost:3000/api/data/rainfall');
    console.log('Rainfall data:', rainfallData);
    console.log('Number of records:', rainfallData.length);

    console.log('\nTesting /api/data/farmers...');
    const farmersData = await testAPI('http://localhost:3000/api/data/farmers');
    console.log('Farmers data:', farmersData);
    console.log('Number of records:', farmersData.length);

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

// Check if the server is likely running on localhost:3000
main();