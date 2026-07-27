# Global Error Handling System

## Overview

The application implements a comprehensive, user-friendly error handling system for all AI requests. Users never see raw API errors, stack traces, or technical details. Instead, they receive clear, actionable messages with appropriate UI components.

## Architecture

### Files

1. **`client/src/utils/errorHandler.ts`** - Core error detection and mapping
   - `getErrorInfo()` - Converts technical errors to user-friendly messages
   - `isRetryableError()` - Determines if error can be retried

2. **`client/src/components/common/ErrorToast.tsx`** - Premium error UI component
   - Animated entrance/exit
   - Icon, title, message display
   - Retry and Close buttons
   - Glassmorphism styling
   - Dark mode support

3. **`client/src/hooks/useGenerateStudyPlan.ts`** - Integrated error handling
   - Calls `getErrorInfo()` on API errors
   - Passes error info to `onError` callback
   - Falls back to react-hot-toast if no callback

4. **`client/src/pages/Home.tsx`** - Error integration in UI
   - Manages error toast state
   - Handles retry logic
   - Displays ErrorToast component

## Error Types & Messages

### 429 Rate Limit / Quota Exceeded

**Trigger:** HTTP 429 response or quota exceeded message

**UI Display:**
- Title: `⚠️ AI Service Temporarily Unavailable`
- Message: `The AI service has reached its current usage limit. Please wait a moment and try again. If the issue continues, the daily API quota may have been exhausted.`
- Icon: Warning (amber)
- Buttons: Retry, Close
- Styling: Amber glass card

**User Experience:** User can immediately retry

### Network Errors

**Trigger:** Network unreachable, ECONNABORTED, ENOTFOUND, offline connection

**UI Display:**
- Title: `No Internet Connection`
- Message: `Please check your internet connection and try again.`
- Icon: Error (red)
- Buttons: Retry, Close
- Styling: Red glass card

**User Experience:** User checks internet and retries

### Timeout Errors

**Trigger:** Request timeout, ECONNRESET, ETIMEDOUT, timeout in message

**UI Display:**
- Title: `Request Timeout`
- Message: `The AI is taking longer than expected. Please try again.`
- Icon: Warning (amber)
- Buttons: Retry, Close
- Styling: Amber glass card

**User Experience:** User retries immediately (may succeed if temporary server slowness)

### Server Errors (5xx)

**Trigger:** HTTP 500, 503, or any 5xx status

**UI Display:**
- Title: `Server Error` or `⚠️ Service Unavailable`
- Message: `Something went wrong on our server. Please try again in a few minutes.` (500) or `The AI service is temporarily unavailable. Please try again in a few moments.` (503)
- Icon: Error/Warning
- Buttons: Retry, Close
- Styling: Red or Amber glass card

**User Experience:** User waits and retries

### Invalid Response (4xx)

**Trigger:** HTTP 400, JSON parsing error, malformed response

**UI Display:**
- Title: `Invalid Response`
- Message: `The AI returned an unexpected response. Please try generating the content again.`
- Icon: Error (red)
- Buttons: Retry, Close
- Styling: Red glass card

**User Experience:** User retries or modifies input

### Unknown/Default Error

**Trigger:** Any unmatched error

**UI Display:**
- Title: `Something Went Wrong`
- Message: `An unexpected error occurred. Please try again.`
- Icon: Error (red)
- Buttons: Retry, Close
- Styling: Red glass card

**User Experience:** User retries or contacts support

## Error Detection Logic

```typescript
// Priority order (first match wins):
1. Network detection: error.message, error.code checks
2. Timeout detection: error.message, error.code checks
3. HTTP status codes: 429, 503, 500+, 400
4. Server error messages: error.response.data.error.message patterns
5. Default unknown error
```

## Logging Strategy

### Console Logging

```typescript
// Full error logged for developers
console.error('[Error Handler] Full error:', error);
// Output includes:
// - Error object
// - Stack trace
// - Response data
// - HTTP status
// - Error codes
```

**Access:** Open browser DevTools → Console tab
**Audience:** Developers debugging issues

### User Display

Users only see:
- Clear title
- Concise explanation
- Action button (Retry or Close)

Users never see:
- Stack traces
- API keys
- Raw Gemini errors
- JSON parse errors
- Internal exceptions
- Backend details
- HTTP response bodies
- Error codes (technical)

## Integration Points

### Home Page

```typescript
// Error state
const [isErrorVisible, setIsErrorVisible] = useState(false);
const [errorInfo, setErrorInfo] = useState(null);

// Error callback
const { mutate: generate } = useGenerateStudyPlan({
  onSuccess: handleSuccess,
  onError: (error) => {
    setErrorInfo(error);
    setIsErrorVisible(true);
  },
});

// Retry handler
const handleRetry = () => {
  setIsErrorVisible(false);
  generate({ topic, difficulty });
};

// UI component
<ErrorToast
  isVisible={isErrorVisible}
  title={errorInfo?.title}
  message={errorInfo?.message}
  icon={errorInfo?.icon}
  onClose={() => setIsErrorVisible(false)}
  onRetry={handleRetry}
  showRetry={true}
/>
```

### Hook Integration

```typescript
// useGenerateStudyPlan accepts onError callback
export const useGenerateStudyPlan = ({ onSuccess, onError }) => {
  return useMutation({
    // ... mutation config ...
    onError: (error) => {
      const errorInfo = getErrorInfo(error);
      if (onError) {
        onError(errorInfo); // Call component callback
      } else {
        toast.error(errorInfo.message); // Fallback
      }
    },
  });
};
```

## Testing Error Scenarios

### 429 Rate Limit

1. Generate multiple study plans in rapid succession
2. Or use curl with intentional quota limit:
   ```bash
   curl -X POST http://localhost:5000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"topic":"test","difficulty":"Medium"}'
   ```
3. Expected: User sees quota warning with Retry button

### Network Error

1. Disconnect internet or use dev tools throttle
2. Try to generate study plan
3. Expected: User sees connection error

### Timeout

1. Use network throttle (6x slower in DevTools)
2. Generate study plan
3. Expected: User sees timeout message after ~30s

### Invalid Response

1. Modify backend to return malformed JSON
2. Generate study plan
3. Expected: User sees invalid response message

### Server Error

1. Stop backend server
2. Try to generate study plan
3. Expected: User sees server unavailable message

## Quality Checklist

- [x] Users only see friendly messages
- [x] Developers can debug via console.error logs
- [x] Retry works correctly for retryable errors
- [x] Error handling is consistent across application
- [x] No raw Gemini errors exposed
- [x] No stack traces shown to users
- [x] No API keys exposed
- [x] No internal implementation details leaked
- [x] Premium UI with glassmorphism styling
- [x] Dark mode support
- [x] Smooth animations
- [x] Accessible button labels

## Future Improvements

1. Add error tracking service (Sentry)
2. Implement error recovery strategies
3. Add error context to logs
4. Create error analytics dashboard
5. Implement exponential backoff for retries
6. Add error code documentation for support team
