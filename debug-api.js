#!/usr/bin/env node

const https = require('https');

async function debugAPI() {
  console.log('🔍 Debugging Production API...\n');
  
  const testData = {
    emailType: 'cancellation_confirmation',
    data: {
      userEmail: 'test@example.com',
      userName: 'Test User',
      cancellationReasons: ['Poor experience'],
      specificIssues: 'Test issues',
      additionalFeedback: 'Test feedback'
    },
    submissionId: 'debug-test-123'
  };

  try {
    const response = await makeRequest('https://feedback.ravecaptureapp.com/api/send-email', testData);
    
    console.log('📊 Response Details:');
    console.log(`Status Code: ${response.statusCode}`);
    console.log(`Content Type: ${response.headers['content-type']}`);
    console.log(`Response Length: ${response.body.length} characters`);
    
    console.log('\n📝 Full Response Body:');
    console.log('─'.repeat(50));
    console.log(response.body);
    console.log('─'.repeat(50));
    
    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(response.body);
      console.log('\n📋 Parsed JSON Response:');
      console.log(JSON.stringify(jsonResponse, null, 2));
    } catch (e) {
      console.log('\n⚠️  Response is not valid JSON');
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

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
        'User-Agent': 'Debug-Script/1.0'
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

debugAPI();
