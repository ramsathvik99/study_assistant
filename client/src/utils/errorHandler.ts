/**
 * Global error handler for AI requests
 * Converts technical errors into user-friendly messages
 */

export interface ErrorInfo {
  title: string;
  message: string;
  icon: 'error' | 'warning' | 'info';
  action?: 'retry' | 'close' | 'both';
  isTimeout?: boolean;
  errorCode?: string;
}

/**
 * Detect error type and return user-friendly message
 * Enhanced with specific timeout detection
 */
export function getErrorInfo(error: any): ErrorInfo {
  // Log full error for debugging
  console.error('[Error Handler] Full error:', error);

  // Handle timeout errors (HTTP 408)
  if (error.response?.status === 408 || error.message?.includes('timeout') || error.message?.includes('timed out')) {
    return {
      title: '⏱️ Request Timeout',
      message: 'The AI is taking longer than expected. This might be due to a complex topic or server load. Try with a shorter topic or try again in a moment.',
      icon: 'warning',
      action: 'retry',
      isTimeout: true,
      errorCode: 'timeout',
    };
  }

  // Handle network errors
  if (error.message === 'Network Error' || error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
    return {
      title: '📡 No Internet Connection',
      message: 'Please check your internet connection and try again.',
      icon: 'error',
      action: 'retry',
      errorCode: 'network',
    };
  }

  // Handle connection reset/timeout codes
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return {
      title: '🔌 Connection Error',
      message: 'The connection was lost. Please check your connection and try again.',
      icon: 'warning',
      action: 'retry',
      errorCode: 'connection',
    };
  }

  // Handle 429 Rate Limit / Quota Exceeded
  if (error.response?.status === 429 || error.message?.includes('429')) {
    return {
      title: '⚠️ Too Many Requests',
      message: 'You\'re generating too quickly. Please wait a moment before trying again. If the issue continues, the daily API quota may have been exhausted.',
      icon: 'warning',
      action: 'retry',
      errorCode: 'rate_limit',
    };
  }

  // Handle 504 Gateway Timeout
  if (error.response?.status === 504) {
    return {
      title: '⏱️ Server Timeout',
      message: 'The server took too long to respond. Please try again with a shorter topic or in a moment.',
      icon: 'warning',
      action: 'retry',
      isTimeout: true,
      errorCode: 'gateway_timeout',
    };
  }

  // Handle 503 Service Unavailable
  if (error.response?.status === 503) {
    return {
      title: '⚠️ Service Unavailable',
      message: 'The AI service is temporarily unavailable. Please try again in a few moments.',
      icon: 'warning',
      action: 'retry',
      errorCode: 'service_unavailable',
    };
  }

  // Handle 502 Bad Gateway
  if (error.response?.status === 502) {
    return {
      title: '⚠️ Service Error',
      message: 'The backend service is experiencing issues. Please try again in a moment.',
      icon: 'warning',
      action: 'retry',
      errorCode: 'bad_gateway',
    };
  }

  // Handle 500 Server Error
  if (error.response?.status >= 500) {
    return {
      title: '❌ Server Error',
      message: 'Something went wrong on our server. Please try again in a few minutes.',
      icon: 'error',
      action: 'retry',
      errorCode: 'server_error',
    };
  }

  // Handle 422 Unprocessable Entity (malformed JSON from AI)
  if (error.response?.status === 422) {
    return {
      title: '🔄 Invalid Response',
      message: 'The AI returned data that couldn\'t be processed. Please try again with a different topic or less complex content.',
      icon: 'error',
      action: 'retry',
      errorCode: 'unprocessable',
    };
  }

  // Handle 400 Bad Request / Invalid Response
  if (error.response?.status === 400 || error.message?.includes('JSON') || error.message?.includes('parse')) {
    return {
      title: '❌ Invalid Response',
      message: 'The AI returned an unexpected response. Please try generating the content again.',
      icon: 'error',
      action: 'retry',
      errorCode: 'bad_request',
    };
  }

  // Handle axios errors with custom error messages
  if (error.response?.data?.error?.message) {
    const errorMsg = error.response.data.error.message;
    
    // Check for specific error patterns
    if (errorMsg.includes('quota') || errorMsg.includes('exceeded') || errorMsg.includes('rate limit')) {
      return {
        title: '⚠️ Rate Limited',
        message: 'The AI service has reached its current usage limit. Please wait a moment and try again.',
        icon: 'warning',
        action: 'retry',
        errorCode: 'quota_exceeded',
      };
    }

    if (errorMsg.includes('timeout')) {
      return {
        title: '⏱️ Request Timeout',
        message: 'The AI is taking longer than expected. Please try again.',
        icon: 'warning',
        action: 'retry',
        isTimeout: true,
        errorCode: 'timeout',
      };
    }

    if (errorMsg.includes('malformed') || errorMsg.includes('unexpected')) {
      return {
        title: '🔄 Invalid Response',
        message: 'The AI returned an unexpected response. Please try generating the content again.',
        icon: 'error',
        action: 'retry',
        errorCode: 'malformed',
      };
    }
  }

  // Handle cancelled requests silently
  if (error.message === '__CANCELLED__') {
    return {
      title: 'Request Cancelled',
      message: 'Your request was cancelled.',
      icon: 'info',
      action: 'close',
      errorCode: 'cancelled',
    };
  }

  // Default unknown error
  return {
    title: '❌ Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    icon: 'error',
    action: 'retry',
    errorCode: 'unknown',
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const info = getErrorInfo(error);
  return info.action === 'retry' || info.action === 'both';
}

/**
 * Check if error is a timeout
 */
export function isTimeoutError(error: any): boolean {
  const info = getErrorInfo(error);
  return info.isTimeout === true || info.errorCode === 'timeout' || info.errorCode === 'gateway_timeout';
}
