// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Image Validation Constants
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

// ROI Constraints
export const MIN_ROI_SIZE_PX = 20;
export const DEFAULT_ROI_PERCENTAGE = 0.3; // 30% of image dimensions

// Image Processing
export const MAX_IMAGE_DIMENSION = 1024; // Max width/height for upload
export const COMPRESSION_QUALITY = 0.85; // JPEG compression quality

// API Timeouts
export const API_TIMEOUT_MS = 30000; // 30 seconds
