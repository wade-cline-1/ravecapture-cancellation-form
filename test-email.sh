#!/bin/bash

echo "🚀 Testing Postmark email functionality with edge function..."
echo ""

# Test 1: Cancellation Confirmation
echo "🧪 Test 1: Cancellation Confirmation"
echo "=================================="
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "cancellation_confirmation",
    "data": {
      "userEmail": "test@example.com",
      "userName": "Test User",
      "cancellationReasons": ["Poor experience", "Technical issues"],
      "specificIssues": "Test specific issues",
      "additionalFeedback": "Test additional feedback"
    },
    "submissionId": "test-123"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""

# Test 2: Retention Confirmation
echo "🧪 Test 2: Retention Confirmation"
echo "================================"
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "retention_confirmation",
    "data": {
      "userEmail": "test@example.com",
      "userName": "Test User",
      "discountAmount": 25,
      "discountDuration": 3
    },
    "submissionId": "test-456"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""

# Test 3: Review Optimization Follow-up
echo "🧪 Test 3: Review Optimization Follow-up"
echo "======================================="
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "review_optimization_followup",
    "data": {
      "userEmail": "test@example.com",
      "userName": "Test User",
      "educationType": "review_optimization",
      "calendlyUrl": "https://calendly.com/test"
    },
    "submissionId": "test-789"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""

# Test 4: Poor Experience Follow-up
echo "🧪 Test 4: Poor Experience Follow-up"
echo "=================================="
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "poor_experience_followup",
    "data": {
      "userEmail": "test@example.com",
      "userName": "Test User",
      "educationType": "poor_experience",
      "calendlyUrl": "https://calendly.com/test"
    },
    "submissionId": "test-101"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "🏁 All email tests completed!"
