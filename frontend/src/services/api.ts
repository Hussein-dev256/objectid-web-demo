import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../utils/constants';
import type { ApiResponse } from '../types/api';

/**
 * Sends cropped image to backend for recognition
 */
export async function recognizeImage(imageBlob: Blob): Promise<ApiResponse> {
    try {
        const formData = new FormData();
        formData.append('image', imageBlob, 'image.jpg');

        const response = await axios.post(
            `${API_BASE_URL}/api/recognize`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: API_TIMEOUT_MS,
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Network or timeout error
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    error: 'Request timed out. Please try again.',
                };
            }

            // Server error response
            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data?.error || 'Recognition failed';

                if (status === 429) {
                    return {
                        success: false,
                        error: 'Rate limit exceeded. Please wait a moment and try again.',
                    };
                }

                if (status === 401) {
                    return {
                        success: false,
                        error: 'Authentication failed. Please contact support.',
                    };
                }

                return {
                    success: false,
                    error: errorMessage,
                };
            }

            // Network error (no response)
            return {
                success: false,
                error: 'Network error. Please check your connection and try again.',
            };
        }

        // Other unexpected errors
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}
