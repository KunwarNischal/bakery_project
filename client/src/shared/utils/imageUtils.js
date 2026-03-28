import { environment } from '@/config/environment';

/**
 * Image Handling Utilities
 */

// A generic SVG placeholder converted to base64 for reliable rendering when images fail
export const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e953181ec%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e953181ec%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22115.5%22%20y%3D%22208.5%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

/**
 * Normalizes an image URL, handling relative, absolute, and missing images
 * @param {string} imagePath - The path or URL from the database/API
 * @returns {string} Fully qualified URL or placeholder
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;

    // If it's already a full HTTP/HTTPS URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it's a data URL
    if (imagePath.startsWith('data:image/')) {
        return imagePath;
    }

    // If it's an uploaded file from our backend
    // Remove leading slash to prevent double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // We assume the backend serves static files from the root URL.
    // E.g., if api is http://localhost:5000/api, images might be at http://localhost:5000/
    const baseUrl = environment.apiUrl.replace(/\/api\/?$/, '');
    
    return `${baseUrl}/${cleanPath}`;
};

/**
 * Preloads an image to ensure smooth rendering
 * @param {string} src - The image URL to preload
 * @returns {Promise<string>} Resolves with the src when loaded
 */
export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
};

/**
 * Validates if an image file is of acceptable type and size
 * @param {File} file - The file object from an input
 * @param {number} maxSizeMB - Maximum size in Megabytes
 * @param {Array<string>} acceptedTypes - Array of valid mime types
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const isImageValid = (
    file, 
    maxSizeMB = 5, 
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
) => {
    if (!file) return { isValid: false, error: 'No file provided' };
    
    if (!acceptedTypes.includes(file.type)) {
        return { isValid: false, error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' };
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return { isValid: false, error: `Image is too large. Maximum size is ${maxSizeMB}MB.` };
    }
    
    return { isValid: true, error: null };
};
