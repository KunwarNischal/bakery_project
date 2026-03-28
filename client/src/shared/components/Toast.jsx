import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TOAST_DURATION, ANIMATION_CLASSES } from '../../utils/constants';

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

    const bgColors = {
        success: 'bg-green-100 border-green-500 text-green-800',
        error: 'bg-red-100 border-red-500 text-red-800',
        info: 'bg-blue-100 border-blue-500 text-blue-800',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    };

    const icons = {
        success: (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        )
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100 transalte-y-0' : 'opacity-0 translate-y-2'} ${ANIMATION_CLASSES.SLIDE_UP}`}>
            <div className={`flex items-center p-4 border-l-4 rounded shadow-md ${bgColors[type] || bgColors.success}`}>
                <div className="flex-shrink-0 mr-3">
                    {icons[type] || icons.info}
                </div>
                <div className="text-sm font-medium">
                    {message}
                </div>
                {onClose && (
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
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
