import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 * Prevents the entire app from crashing due to a single component error
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.title] - Error title to display
 * @param {Function} [props.onError] - Callback when error occurs
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Call optional callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-light-brown/10 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-dark-brown text-center mb-4">
              {this.props.title || 'Oops! Something went wrong'}
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 text-center mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <details className="text-xs text-red-700 font-mono">
                  <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                  <pre className="whitespace-pre-wrap break-words overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="whitespace-pre-wrap break-words overflow-auto max-h-40 mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full bg-light-brown text-white font-bold py-3 rounded-xl hover:bg-dark-brown transition-all shadow-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-dark-brown font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  onError: PropTypes.func
};

export default ErrorBoundary;
