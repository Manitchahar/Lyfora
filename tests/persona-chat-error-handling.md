# PersonaChat Error Handling Test Scenarios

This document outlines manual test scenarios for verifying error handling in the PersonaChat feature.

## Test Scenarios

### 1. Network Error Handling ✓
**Test Steps:**
1. Open PersonaChat with any persona
2. Disconnect from internet
3. Send a message
4. Verify error message: "Network error. Please check your connection and try again."
5. Verify retry button appears
6. Reconnect to internet
7. Click retry button
8. Verify message sends successfully

**Expected Behavior:**
- User-friendly network error message displayed
- Retry button is functional
- Failed message is preserved for retry
- Fallback message appears in chat

### 2. Timeout Handling (30 seconds) ✓
**Test Steps:**
1. Open PersonaChat with any persona
2. Send a message
3. If response takes > 30 seconds, verify timeout error
4. Verify error message: "Request timed out after 30 seconds. Please try again."
5. Verify retry button appears
6. Click retry to resend

**Expected Behavior:**
- Request aborts after 30 seconds
- Timeout-specific error message shown
- Retry functionality works
- No hanging requests

### 3. Empty Message Validation ✓
**Test Steps:**
1. Open PersonaChat with any persona
2. Try to send empty message (just spaces)
3. Verify send button is disabled
4. Type actual message
5. Verify send button becomes enabled

**Expected Behavior:**
- Send button disabled when input is empty or whitespace-only
- No API request made for empty messages
- Button enables when valid text entered

### 4. API Key Missing Scenario ✓
**Test Steps:**
1. Remove GEMINI_API_KEY from Supabase environment
2. Open PersonaChat and send message
3. Verify error message: "Service configuration error. Please contact support."
4. Verify fallback message appears in chat

**Expected Behavior:**
- 500 error returned from edge function
- User-friendly configuration error message
- No exposure of technical details to user
- Fallback message provides context

### 5. Invalid Persona ID ✓
**Test Steps:**
1. Manually modify persona ID in request (developer tools)
2. Send message with invalid persona ID
3. Verify 400 error response
4. Verify error message: "Invalid request. Please try rephrasing your message."

**Expected Behavior:**
- 400 Bad Request returned
- Validation prevents invalid persona access
- User-friendly error message

### 6. Gemini API Failure ✓
**Test Steps:**
1. Use invalid/expired API key
2. Send message through PersonaChat
3. Verify persona-specific fallback response appears
4. Verify retry button works

**Expected Behavior:**
- Graceful fallback to persona-specific message
- No crash or blank screen
- Retry functionality available
- Error logged for debugging

### 7. Rate Limiting (429) ✓
**Test Steps:**
1. Send many rapid requests to trigger rate limit
2. Verify error message: "Too many requests. Please wait a moment and try again."
3. Wait appropriate time
4. Verify retry works

**Expected Behavior:**
- 429 status handled gracefully
- Clear rate limit message
- Retry available after cooldown

### 8. Malformed Response ✓
**Test Steps:**
1. Simulate malformed JSON response from API
2. Verify error handling catches parse error
3. Verify fallback message appears

**Expected Behavior:**
- JSON parse errors caught
- Fallback response provided
- No application crash

### 9. Content Safety Blocks ✓
**Test Steps:**
1. Send message that might trigger safety filters
2. Verify appropriate safety response from persona
3. Verify conversation can continue

**Expected Behavior:**
- Safety blocks handled gracefully
- Persona-appropriate safety message
- User can continue chatting

### 10. Long Message Validation ✓
**Test Steps:**
1. Try to send message > 5000 characters
2. Verify validation error from backend
3. Verify error message displayed

**Expected Behavior:**
- Backend validates message length
- 400 error with clear message
- User informed of character limit

## Error Message Quality Checklist

- [ ] All error messages are user-friendly (no technical jargon)
- [ ] Error messages provide actionable guidance
- [ ] Retry functionality works for recoverable errors
- [ ] Failed messages are preserved for retry
- [ ] Loading states prevent duplicate submissions
- [ ] Errors don't crash the application
- [ ] Fallback messages maintain persona character
- [ ] Console logs provide debugging information
- [ ] Network errors are distinguishable from API errors
- [ ] Timeout errors are clear about duration

## Requirements Coverage

✓ **Requirement 8.1**: Gemini API failures display friendly error messages
✓ **Requirement 8.2**: Failed requests allow user to retry
✓ **Requirement 8.3**: Network connection loss shows connectivity error
✓ **Requirement 8.4**: 30-second timeout implemented
✓ **Requirement 8.5**: Timeout displays appropriate message with retry option

## Implementation Summary

### Frontend (PersonaChat.tsx)
- ✓ AbortController for 30-second timeout
- ✓ Network error detection (Failed to fetch)
- ✓ Timeout error handling (AbortError)
- ✓ HTTP status code handling (400, 429, 500+)
- ✓ Empty message validation
- ✓ Retry functionality with lastFailedMessage state
- ✓ User-friendly error messages
- ✓ Response validation
- ✓ Fallback messages in chat

### Backend (persona-chat/index.ts)
- ✓ API key validation
- ✓ Request body parsing with error handling
- ✓ Message validation (required, non-empty, length limit)
- ✓ Persona ID validation
- ✓ Gemini API timeout (25 seconds)
- ✓ Rate limit handling (429)
- ✓ Authentication error handling (401, 403)
- ✓ Response parsing with error handling
- ✓ Safety block detection (SAFETY, RECITATION)
- ✓ Persona-specific fallback responses
- ✓ Comprehensive error logging

## Notes

All error handling requirements from task 11 have been implemented:
- Network error handling with retry
- 30-second timeout with user-friendly messages
- Empty message validation
- API key missing scenario handled
- Gemini API failure scenarios covered
- Rate limiting handled
- Content safety blocks handled
- Malformed responses handled
- Message length validation
- Comprehensive error categorization
