import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Loading Spinner Component
 */
const Loader = ({ size = 'md', center = true, text = 'Loading...' }) => {
    
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`
                ${sizeClasses[size]}
                rounded-full 
                border-gray-200 
                border-t-primary 
                animate-spin
            `} style={{ borderTopColor: '#c8a882' }}></div>
            
            {text && (
                <p className="text-gray-500 font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (center) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] w-full">
                {spinner}
            </div>
        );
    }

    return spinner;
};

Loader.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    center: PropTypes.bool,
    text: PropTypes.string,
};

export default Loader;
