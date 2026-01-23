import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from './constants';
import type { ValidationResult } from '../types/api';

/**
 * Validates image file for upload
 */
export function validateImageFile(file: File): ValidationResult {
    // Check file size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File too large. Maximum size is ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`,
        };
    }

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image',
        };
    }

    return { valid: true };
}

/**
 * Loads an image and returns its dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({
                width: img.width,
                height: img.height,
            });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/**
 * Creates an image element from a File
 */
export function createImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}
