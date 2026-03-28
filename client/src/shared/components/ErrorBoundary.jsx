import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in their child component tree, 
 * logs those errors, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service here (e.g. Sentry)
        console.error("Uncaught rendering error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Render any custom fallback UI
            return this.props.fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-6">We're sorry, an unexpected error occurred. Please try again.</p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="text-left bg-gray-100 p-4 rounded text-xs overflow-auto mb-6 text-red-600 max-h-40">
                                {this.state.error.toString()}
                            </div>
                        )}
                        
                        <button 
                            onClick={this.handleRetry}
                            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            style={{ backgroundColor: '#c8a882' }} // Fallback bakery primary color
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node
};

export default ErrorBoundary;
