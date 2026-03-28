import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Toast constants
const TOAST_DURATION = {
    NORMAL: 3000,
    LONG: 5000,
    SHORT: 1500
};

const ANIMATION_CLASSES = {
    SLIDE_UP: 'animate-slide-up',
    FADE_IN: 'animate-fade-in'
};

/**
 * Custom Toast Notification Component
 * Displays temporary success/error messages
 */
const Toast = ({ message, type = 'success', onClose, duration = TOAST_DURATION.NORMAL }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
                setTimeout(onClose, 300); // Wait for fade out animation
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible && !onClose) return null;

    // Hatemalo Bakery themed colors with gradient and enhanced styling
    const bgColors = {
        success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-lg hover:shadow-xl',
        error: 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 shadow-lg hover:shadow-xl',
        info: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 shadow-lg hover:shadow-xl',
        warning: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 shadow-lg hover:shadow-xl',
    };

    const textColors = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
        warning: 'text-amber-800',
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-blue-500',
        warning: 'text-amber-500',
    };

    const icons = {
        success: (
            <svg className={`w-6 h-6 ${iconColors.success}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        error: (
            <svg className={`w-6 h-6 ${iconColors.error}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
        info: (
            <svg className={`w-6 h-6 ${iconColors.info}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg className={`w-6 h-6 ${iconColors.warning}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        )
    };

    return (
        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`flex items-start p-4 rounded-xl ${bgColors[type] || bgColors.success} transition-all duration-200`}>
                <div className="shrink-0 mr-3 mt-0.5">
                    {icons[type] || icons.info}
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-semibold ${textColors[type] || textColors.success} font-body`}>
                        {message}
                    </p>
                </div>
                <button 
                    onClick={() => setIsVisible(false)}
                    className={`ml-3 text-gray-400 hover:text-gray-600 focus:outline-none shrink-0 transition-colors`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
    onClose: PropTypes.func,
    duration: PropTypes.number
};

export default Toast;
