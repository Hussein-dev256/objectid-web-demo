import { COMPRESSION_QUALITY } from './constants';
import type { ROI } from '../types/api';

/**
 * Crops an image to the specified ROI and returns a Blob
 */
export async function cropImageToROI(
    image: HTMLImageElement,
    roi: ROI
): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = roi.width;
    canvas.height = roi.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    // Draw the cropped portion
    ctx.drawImage(
        image,
        roi.x, roi.y, roi.width, roi.height,  // Source rectangle
        0, 0, roi.width, roi.height           // Destination rectangle
    );

    // Convert to blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create image blob'));
                }
            },
            'image/jpeg',
            COMPRESSION_QUALITY
        );
    });
}

/**
 * Resizes an image if it exceeds max dimensions while maintaining aspect ratio
 */
export function resizeImageIfNeeded(
    image: HTMLImageElement,
    maxDimension: number
): HTMLCanvasElement {
    const canvas = document.createElement('canvas');

    let width = image.width;
    let height = image.height;

    // Calculate new dimensions if needed
    if (width > maxDimension || height > maxDimension) {
        if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
        } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
        }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(image, 0, 0, width, height);
    }

    return canvas;
}
