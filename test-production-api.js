#!/usr/bin/env node

const https = require('https');

// Test data for different email types
const testCases = [
  {
    name: "Cancellation Confirmation",
    emailType: "cancellation_confirmation",
    data: {
      userEmail: "test@example.com",
      userName: "Test User",
      cancellationReasons: ["Poor experience", "Technical issues"],
      specificIssues: "Test specific issues",
      additionalFeedback: "Test additional feedback"
    }
  },
  {
    name: "Retention Confirmation", 
    emailType: "retention_confirmation",
    data: {
      userEmail: "test@example.com",
      userName: "Test User",
      discountAmount: 25,
      discountDuration: 3
    }
  },
  {
    name: "Review Optimization Follow-up",
    emailType: "review_optimization_followup", 
    data: {
      userEmail: "test@example.com",
      userName: "Test User",
      educationType: "review_optimization",
      calendlyUrl: "https://calendly.com/test"
    }
  }
];

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Production-Test-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testProductionAPI() {
  console.log('🚀 Testing Production API Endpoint');
  console.log('=====================================\n');
  
  const baseUrl = 'https://feedback.ravecaptureapp.com';
  const apiEndpoint = `${baseUrl}/api/send-email`;
  
  console.log(`Testing endpoint: ${apiEndpoint}\n`);
  
  // First, test if the main site is accessible
  console.log('1. Testing main site accessibility...');
  try {
    const mainSiteResponse = await makeRequest(baseUrl, {});
    console.log(`✅ Main site status: ${mainSiteResponse.statusCode}`);
    if (mainSiteResponse.statusCode === 200) {
      console.log('✅ Main site is accessible');
    } else {
      console.log('⚠️  Main site returned non-200 status');
    }
  } catch (error) {
    console.log(`❌ Main site error: ${error.message}`);
  }
  
  console.log('\n2. Testing API endpoint...');
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('─'.repeat(50));
    
    const testData = {
      emailType: testCase.emailType,
      data: testCase.data,
      submissionId: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    try {
      const response = await makeRequest(apiEndpoint, testData);
      
      console.log(`Status Code: ${response.statusCode}`);
      console.log(`Content Type: ${response.headers['content-type']}`);
      
      if (response.statusCode === 200) {
        console.log('✅ SUCCESS: Email API is working!');
        try {
          const jsonResponse = JSON.parse(response.body);
          console.log('Response:', JSON.stringify(jsonResponse, null, 2));
        } catch (e) {
          console.log('Response (raw):', response.body.substring(0, 200));
        }
      } else if (response.statusCode === 500) {
        console.log('⚠️  SERVER ERROR: API endpoint exists but has issues');
        console.log('This likely means:');
        console.log('- Postmark token is missing or invalid');
        console.log('- Database connection issues');
        console.log('- Environment variables not set');
        
        // Try to parse error response
        try {
          const errorResponse = JSON.parse(response.body);
          console.log('Error details:', JSON.stringify(errorResponse, null, 2));
        } catch (e) {
          console.log('Error response (HTML):', response.body.substring(0, 300));
        }
      } else if (response.statusCode === 404) {
        console.log('❌ NOT FOUND: API endpoint does not exist');
        console.log('This means:');
        console.log('- Next.js app is not properly deployed');
        console.log('- API routes are not being served');
        console.log('- Build configuration issue');
      } else {
        console.log(`⚠️  UNEXPECTED STATUS: ${response.statusCode}`);
        console.log('Response:', response.body.substring(0, 200));
      }
      
    } catch (error) {
      console.log(`❌ REQUEST FAILED: ${error.message}`);
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 Testing Complete!');
  console.log('\nNext Steps:');
  console.log('1. If you see 404 errors: Check Netlify build settings');
  console.log('2. If you see 500 errors: Check environment variables');
  console.log('3. If you see 200 responses: Email functionality is working!');
}

// Run the test
testProductionAPI().catch(console.error);
