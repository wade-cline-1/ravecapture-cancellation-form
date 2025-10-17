#!/usr/bin/env node

/**
 * Comprehensive Application Test Suite
 * Tests all user flows, logic paths, and API endpoints
 */

const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Test statistics
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failedTestDetails = [];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '='.repeat(70), 'cyan');
  log(` ${title}`, 'bright');
  log('='.repeat(70), 'cyan');
}

function logTest(name) {
  totalTests++;
  log(`\n[${totalTests}] Testing: ${name}`, 'blue');
}

function logSuccess(message) {
  passedTests++;
  log(`  ✅ ${message}`, 'green');
}

function logFailure(message, details = null) {
  failedTests++;
  log(`  ❌ ${message}`, 'red');
  if (details) {
    failedTestDetails.push({ test: message, details });
    log(`     Details: ${JSON.stringify(details, null, 2)}`, 'yellow');
  }
}

function logInfo(message) {
  log(`  ℹ️  ${message}`, 'cyan');
}

// Helper to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();
  
  return {
    ok: response.ok,
    status: response.status,
    data,
    response
  };
}

// Generate test email
function generateTestEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@ravecapture-test.com`;
}

// Wait helper
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// TEST SUITES
// ============================================================================

/**
 * Test 1: Basic API Endpoint Health Checks
 */
async function testAPIHealthChecks() {
  logSection('TEST SUITE 1: API Health Checks');

  // Test submissions endpoint
  logTest('POST /api/submissions - Create new submission');
  try {
    const email = generateTestEmail();
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Too Expensive']
    });

    if (result.ok && result.data.submissionId) {
      logSuccess(`Submission created: ${result.data.submissionId}`);
      return result.data.submissionId; // Return for later tests
    } else {
      logFailure('Failed to create submission', result.data);
      return null;
    }
  } catch (error) {
    logFailure('API call failed', error.message);
    return null;
  }
}

/**
 * Test 2: Complete User Flow - "Too Expensive" Path
 */
async function testTooExpensiveFlow() {
  logSection('TEST SUITE 2: Complete Flow - "Too Expensive" → Retention → Accept');

  const email = generateTestEmail();
  let submissionId = null;

  // Step 1: Create submission with feedback
  logTest('Step 1: Submit feedback (Too Expensive)');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Too Expensive'],
      specificIssues: 'Pricing is too high for my budget',
      additionalFeedback: 'Love the service but cannot afford it'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Feedback submitted, ID: ${submissionId}`);
    } else {
      logFailure('Failed to submit feedback', result.data);
      return;
    }
  } catch (error) {
    logFailure('Feedback submission failed', error.message);
    return;
  }

  // Step 2: Update to future_plans step
  logTest('Step 2: Submit future plans');
  try {
    const result = await apiCall('/submissions', 'POST', {
      submissionId,
      email,
      currentStep: 'future_plans',
      futurePlans: 'switching_to_competitor',
      competitorInfo: 'Yotpo'
    });

    if (result.ok) {
      logSuccess('Future plans submitted');
    } else {
      logFailure('Failed to submit future plans', result.data);
    }
  } catch (error) {
    logFailure('Future plans submission failed', error.message);
  }

  // Step 3: Show retention offer and accept
  logTest('Step 3: Accept retention offer');
  try {
    const result = await apiCall('/submissions', 'POST', {
      submissionId,
      email,
      currentStep: 'retention',
      retentionAccepted: true
    });

    if (result.ok) {
      logSuccess('Retention offer accepted');
    } else {
      logFailure('Failed to accept retention offer', result.data);
    }
  } catch (error) {
    logFailure('Retention acceptance failed', error.message);
  }

  // Step 4: Verify data retrieval
  logTest('Step 4: Retrieve complete submission data');
  try {
    const result = await apiCall(`/submissions?id=${submissionId}`, 'GET');

    if (result.ok && result.data) {
      logSuccess('Submission retrieved successfully');
      logInfo(`Email: ${result.data.email}`);
      logInfo(`Status: ${result.data.status}`);
      logInfo(`Current Step: ${result.data.currentStep}`);
      
      // Verify retention data
      if (result.data.cancellation_retention?.[0]?.offerAccepted) {
        logSuccess('Retention acceptance verified in database');
      } else {
        logFailure('Retention acceptance not found in database');
      }
    } else {
      logFailure('Failed to retrieve submission', result.data);
    }
  } catch (error) {
    logFailure('Retrieval failed', error.message);
  }

  return submissionId;
}

/**
 * Test 3: Review Optimization Flow
 */
async function testReviewOptimizationFlow() {
  logSection('TEST SUITE 3: Review Optimization Education Flow');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Submit "Not Getting Enough Reviews" reason');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Not Getting Enough Reviews'],
      specificIssues: 'Need help getting more reviews',
      additionalFeedback: 'Would like guidance on review generation'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created for review optimization flow: ${submissionId}`);
      logInfo('Expected next step: review_optimization_education');
    } else {
      logFailure('Failed to create submission', result.data);
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
  }

  // Track education event
  if (submissionId) {
    logTest('Track education event');
    try {
      const result = await apiCall('/education-events', 'POST', {
        submissionId,
        stepName: 'review_optimization_education',
        stepType: 'education',
        timeSpent: 45
      });

      if (result.ok) {
        logSuccess('Education event tracked');
      } else {
        logFailure('Failed to track education event', result.data);
      }
    } catch (error) {
      logFailure('Education tracking failed', error.message);
    }
  }

  return submissionId;
}

/**
 * Test 4: Poor Experience Flow
 */
async function testPoorExperienceFlow() {
  logSection('TEST SUITE 4: Poor Experience Flow');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Submit "Poor Experience" reason');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Poor Experience'],
      specificIssues: 'Customer support was slow',
      additionalFeedback: 'Not satisfied with response times'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created for poor experience flow: ${submissionId}`);
      logInfo('Expected next step: poor_experience_education');
    } else {
      logFailure('Failed to create submission', result.data);
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
  }

  return submissionId;
}

/**
 * Test 5: Technical Issues Flow
 */
async function testTechnicalIssuesFlow() {
  logSection('TEST SUITE 5: Technical Issues Flow');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Submit "Technical Issues" reason');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Technical Issues'],
      specificIssues: 'Widget not displaying correctly on mobile',
      additionalFeedback: 'Tried multiple browsers but issue persists'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created for technical issues flow: ${submissionId}`);
      logInfo('Expected next step: technical_issues_education');
    } else {
      logFailure('Failed to create submission', result.data);
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
  }

  return submissionId;
}

/**
 * Test 6: Missing Features - API Integration Flow
 */
async function testMissingFeaturesAPIFlow() {
  logSection('TEST SUITE 6: Missing Features - API Integration');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Submit "Missing Features" with API integration');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Missing Features'],
      selectedFeatures: ['Lacks integration requirements with my store platform'],
      specificIssues: 'Need API for custom integration',
      additionalFeedback: 'Looking for REST API access'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created for API flow: ${submissionId}`);
      logInfo('Expected next step: custom_api_education');
    } else {
      logFailure('Failed to create submission', result.data);
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
  }

  return submissionId;
}

/**
 * Test 7: Missing Features - Google Business Flow
 */
async function testMissingFeaturesGoogleFlow() {
  logSection('TEST SUITE 7: Missing Features - Google Business Integration');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Submit "Missing Features" with Google Shopping Ads');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Missing Features'],
      selectedFeatures: ['Unable to integrate my reviews into Google Shopping Ads'],
      specificIssues: 'Need Google Shopping integration',
      additionalFeedback: 'Want reviews in shopping ads'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created for Google Business flow: ${submissionId}`);
      logInfo('Expected next step: google_business_education');
    } else {
      logFailure('Failed to create submission', result.data);
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
  }

  return submissionId;
}

/**
 * Test 8: Missing Features - Retail Syndication Flow
 */
async function testMissingFeaturesRetailSyndicationFlow() {
  logSection('TEST SUITE 8: Missing Features - Retail Syndication');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Submit "Missing Features" with Retail Syndication');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Missing Features'],
      selectedFeatures: ["Doesn't offer Retail Syndication"],
      specificIssues: 'Need retail syndication feature',
      additionalFeedback: 'Want to syndicate reviews to retailers'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created for retail syndication flow: ${submissionId}`);
      logInfo('Expected next step: retail_syndication_education');
    } else {
      logFailure('Failed to create submission', result.data);
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
  }

  return submissionId;
}

/**
 * Test 9: Missing Features - Combined Features Flow
 */
async function testMissingFeaturesCombinedFlow() {
  logSection('TEST SUITE 9: Missing Features - Combined Features');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Submit "Missing Features" with multiple features');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Missing Features'],
      selectedFeatures: [
        'Unable to integrate my reviews into Google Shopping Ads',
        "Can't customize my display widgets"
      ],
      specificIssues: 'Need multiple features',
      additionalFeedback: 'Multiple missing features'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created for combined features flow: ${submissionId}`);
      logInfo('Expected next step: combined_education');
    } else {
      logFailure('Failed to create submission', result.data);
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
  }

  return submissionId;
}

/**
 * Test 10: Retention Flow - Decline Offer
 */
async function testRetentionDeclineFlow() {
  logSection('TEST SUITE 10: Retention Flow - Decline Offer');

  const email = generateTestEmail();
  let submissionId = null;

  logTest('Create submission for retention');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Not Seeing Enough Value'],
      specificIssues: 'Not seeing ROI',
      additionalFeedback: 'Expected better results'
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created: ${submissionId}`);
    } else {
      logFailure('Failed to create submission', result.data);
      return;
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
    return;
  }

  // Decline retention offer
  logTest('Decline retention offer');
  try {
    const result = await apiCall('/submissions', 'POST', {
      submissionId,
      email,
      currentStep: 'retention',
      retentionAccepted: false
    });

    if (result.ok) {
      logSuccess('Retention offer declined');
    } else {
      logFailure('Failed to decline retention offer', result.data);
    }
  } catch (error) {
    logFailure('Retention decline failed', error.message);
  }

  // Verify in database
  logTest('Verify retention decline in database');
  try {
    const result = await apiCall(`/submissions?id=${submissionId}`, 'GET');

    if (result.ok && result.data.cancellation_retention?.[0]) {
      const retention = result.data.cancellation_retention[0];
      if (retention.offerPresented && !retention.offerAccepted) {
        logSuccess('Retention decline verified in database');
      } else {
        logFailure('Retention data incorrect', retention);
      }
    } else {
      logFailure('Failed to retrieve retention data');
    }
  } catch (error) {
    logFailure('Retrieval failed', error.message);
  }

  return submissionId;
}

/**
 * Test 11: Data Validation and Edge Cases
 */
async function testDataValidationAndEdgeCases() {
  logSection('TEST SUITE 11: Data Validation & Edge Cases');

  // Test missing required fields
  logTest('Test missing email field');
  try {
    const result = await apiCall('/submissions', 'POST', {
      currentStep: 'feedback',
      cancellationReasons: ['Too Expensive']
      // Missing email
    });

    if (!result.ok) {
      logSuccess('Correctly rejected submission without email');
    } else {
      logFailure('Should have rejected submission without email');
    }
  } catch (error) {
    logSuccess('Correctly rejected invalid submission');
  }

  // Test empty cancellation reasons
  logTest('Test empty cancellation reasons');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email: generateTestEmail(),
      currentStep: 'feedback',
      cancellationReasons: []
    });

    if (!result.ok) {
      logSuccess('Correctly rejected empty cancellation reasons');
    } else {
      logFailure('Should have rejected empty reasons');
    }
  } catch (error) {
    logSuccess('Correctly rejected invalid submission');
  }

  // Test invalid submission ID on update
  logTest('Test update with invalid submission ID');
  try {
    const result = await apiCall('/submissions', 'POST', {
      submissionId: 'invalid-id-12345',
      email: generateTestEmail(),
      currentStep: 'retention',
      retentionAccepted: true
    });

    if (!result.ok) {
      logSuccess('Correctly handled invalid submission ID');
    } else {
      logFailure('Should have rejected invalid submission ID');
    }
  } catch (error) {
    logSuccess('Correctly handled invalid submission');
  }

  // Test retrieving non-existent submission
  logTest('Test GET with non-existent submission ID');
  try {
    const result = await apiCall('/submissions?id=nonexistent-12345', 'GET');

    if (!result.ok || result.status === 404) {
      logSuccess('Correctly handled non-existent submission');
    } else {
      logFailure('Should have returned 404 for non-existent submission');
    }
  } catch (error) {
    logSuccess('Correctly handled non-existent submission');
  }
}

/**
 * Test 12: Education Events Tracking
 */
async function testEducationEventsTracking() {
  logSection('TEST SUITE 12: Education Events Tracking');

  const email = generateTestEmail();
  let submissionId = null;

  // Create a submission first
  logTest('Create submission for education tracking');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Not Getting Enough Reviews']
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess(`Submission created: ${submissionId}`);
    } else {
      logFailure('Failed to create submission', result.data);
      return;
    }
  } catch (error) {
    logFailure('Submission failed', error.message);
    return;
  }

  // Track multiple education events
  const educationSteps = [
    { stepName: 'review_optimization_education', stepType: 'education', timeSpent: 30 },
    { stepName: 'review_optimization_calendly', stepType: 'calendly', timeSpent: 60 },
    { stepName: 'review_optimization_email_confirmation', stepType: 'confirmation', timeSpent: 10 }
  ];

  for (const step of educationSteps) {
    logTest(`Track event: ${step.stepName}`);
    try {
      const result = await apiCall('/education-events', 'POST', {
        submissionId,
        ...step
      });

      if (result.ok) {
        logSuccess(`Event tracked: ${step.stepName}`);
      } else {
        logFailure(`Failed to track: ${step.stepName}`, result.data);
      }
    } catch (error) {
      logFailure('Event tracking failed', error.message);
    }
  }

  // Retrieve and verify education events
  logTest('Retrieve education events');
  try {
    const result = await apiCall(`/education-events?submissionId=${submissionId}`, 'GET');

    if (result.ok && Array.isArray(result.data)) {
      logSuccess(`Retrieved ${result.data.length} education events`);
      if (result.data.length === educationSteps.length) {
        logSuccess('All events tracked correctly');
      } else {
        logFailure(`Expected ${educationSteps.length} events, got ${result.data.length}`);
      }
    } else {
      logFailure('Failed to retrieve education events', result.data);
    }
  } catch (error) {
    logFailure('Retrieval failed', error.message);
  }
}

/**
 * Test 13: Concurrent Submissions
 */
async function testConcurrentSubmissions() {
  logSection('TEST SUITE 13: Concurrent Submissions Test');

  logTest('Create multiple submissions concurrently');
  
  const promises = [];
  const numSubmissions = 5;

  for (let i = 0; i < numSubmissions; i++) {
    promises.push(
      apiCall('/submissions', 'POST', {
        email: generateTestEmail(),
        currentStep: 'feedback',
        cancellationReasons: ['Too Expensive'],
        specificIssues: `Concurrent test ${i + 1}`
      })
    );
  }

  try {
    const results = await Promise.all(promises);
    const successful = results.filter(r => r.ok).length;

    if (successful === numSubmissions) {
      logSuccess(`All ${numSubmissions} concurrent submissions successful`);
    } else {
      logFailure(`Only ${successful}/${numSubmissions} submissions successful`);
    }
  } catch (error) {
    logFailure('Concurrent submission test failed', error.message);
  }
}

/**
 * Test 14: Update Flow - Progressive Form Updates
 */
async function testProgressiveUpdates() {
  logSection('TEST SUITE 14: Progressive Form Updates');

  const email = generateTestEmail();
  let submissionId = null;

  // Step 1: Initial creation
  logTest('Step 1: Create initial submission');
  try {
    const result = await apiCall('/submissions', 'POST', {
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Too Expensive']
    });

    if (result.ok && result.data.submissionId) {
      submissionId = result.data.submissionId;
      logSuccess('Initial submission created');
    } else {
      logFailure('Failed to create initial submission');
      return;
    }
  } catch (error) {
    logFailure('Initial submission failed', error.message);
    return;
  }

  // Step 2: Add specific issues
  logTest('Step 2: Update with specific issues');
  try {
    const result = await apiCall('/submissions', 'POST', {
      submissionId,
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Too Expensive'],
      specificIssues: 'Added specific issues in update'
    });

    if (result.ok) {
      logSuccess('Specific issues added');
    } else {
      logFailure('Failed to update with specific issues');
    }
  } catch (error) {
    logFailure('Update failed', error.message);
  }

  // Step 3: Add additional feedback
  logTest('Step 3: Update with additional feedback');
  try {
    const result = await apiCall('/submissions', 'POST', {
      submissionId,
      email,
      currentStep: 'feedback',
      cancellationReasons: ['Too Expensive'],
      specificIssues: 'Added specific issues in update',
      additionalFeedback: 'Added more context in second update'
    });

    if (result.ok) {
      logSuccess('Additional feedback added');
    } else {
      logFailure('Failed to add additional feedback');
    }
  } catch (error) {
    logFailure('Update failed', error.message);
  }

  // Step 4: Verify all data persisted
  logTest('Step 4: Verify all progressive updates persisted');
  try {
    const result = await apiCall(`/submissions?id=${submissionId}`, 'GET');

    if (result.ok && result.data) {
      const feedback = result.data.cancellation_feedback?.[0];
      if (feedback?.specificIssues && feedback?.additionalFeedback) {
        logSuccess('All progressive updates persisted correctly');
        logInfo(`Specific Issues: ${feedback.specificIssues}`);
        logInfo(`Additional Feedback: ${feedback.additionalFeedback}`);
      } else {
        logFailure('Progressive updates not fully persisted', feedback);
      }
    } else {
      logFailure('Failed to retrieve submission');
    }
  } catch (error) {
    logFailure('Retrieval failed', error.message);
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  log('\n' + '█'.repeat(70), 'magenta');
  log('  🧪 RAVECAPTURE CANCELLATION FORM - COMPREHENSIVE TEST SUITE', 'bright');
  log('█'.repeat(70) + '\n', 'magenta');

  log(`Testing against: ${BASE_URL}`, 'cyan');
  log(`Started at: ${new Date().toISOString()}\n`, 'cyan');

  // Check if server is running
  logTest('Checking if server is accessible');
  try {
    const response = await fetch(BASE_URL);
    if (response.ok || response.status === 404) {
      logSuccess('Server is accessible');
    } else {
      logFailure(`Server returned status: ${response.status}`);
      log('\n❌ Cannot continue tests - server not accessible', 'red');
      process.exit(1);
    }
  } catch (error) {
    logFailure('Server is not accessible', error.message);
    log('\n⚠️  Make sure your dev server is running: npm run dev', 'yellow');
    process.exit(1);
  }

  // Run all test suites
  try {
    await testAPIHealthChecks();
    await wait(500);
    
    await testTooExpensiveFlow();
    await wait(500);
    
    await testReviewOptimizationFlow();
    await wait(500);
    
    await testPoorExperienceFlow();
    await wait(500);
    
    await testTechnicalIssuesFlow();
    await wait(500);
    
    await testMissingFeaturesAPIFlow();
    await wait(500);
    
    await testMissingFeaturesGoogleFlow();
    await wait(500);
    
    await testMissingFeaturesRetailSyndicationFlow();
    await wait(500);
    
    await testMissingFeaturesCombinedFlow();
    await wait(500);
    
    await testRetentionDeclineFlow();
    await wait(500);
    
    await testDataValidationAndEdgeCases();
    await wait(500);
    
    await testEducationEventsTracking();
    await wait(500);
    
    await testConcurrentSubmissions();
    await wait(500);
    
    await testProgressiveUpdates();
    
  } catch (error) {
    log(`\n❌ Test suite crashed: ${error.message}`, 'red');
    console.error(error);
  }

  // Print final results
  logSection('TEST RESULTS SUMMARY');
  
  log(`\nTotal Tests: ${totalTests}`, 'bright');
  log(`✅ Passed: ${passedTests}`, 'green');
  log(`❌ Failed: ${failedTests}`, 'red');
  
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
  log(`Pass Rate: ${passRate}%\n`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');

  if (failedTests > 0) {
    log('\n⚠️  FAILED TEST DETAILS:', 'yellow');
    failedTestDetails.forEach((fail, index) => {
      log(`\n${index + 1}. ${fail.test}`, 'red');
      if (fail.details) {
        log(`   ${JSON.stringify(fail.details, null, 2)}`, 'yellow');
      }
    });
  }

  log('\n' + '█'.repeat(70), 'magenta');
  if (failedTests === 0) {
    log('  🎉 ALL TESTS PASSED! Your application is working correctly!', 'green');
  } else {
    log(`  ⚠️  ${failedTests} test(s) failed. Please review the failures above.`, 'yellow');
  }
  log('█'.repeat(70) + '\n', 'magenta');

  log(`Completed at: ${new Date().toISOString()}`, 'cyan');

  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

