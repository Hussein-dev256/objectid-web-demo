import axios from 'axios';
import FormData from 'form-data';

const IMAGGA_API_URL = 'https://api.imagga.com/v2/tags';

export interface ImaggaTag {
    confidence: number;
    tag: {
        en: string;
    };
}

export interface ImaggaResponse {
    result: {
        tags: ImaggaTag[];
    };
    status: {
        text: string;
        type: string;
    };
}

/**
 * Calls Imagga API to recognize objects in an image
 */
export async function recognizeImage(imageBuffer: Buffer): Promise<ImaggaResponse> {
    // Get credentials at runtime (not module load time)
    const apiKey = process.env.IMAGGA_API_KEY;
    const apiSecret = process.env.IMAGGA_API_SECRET;

    // Check if credentials are configured
    if (!apiKey || !apiSecret) {
        console.error('Missing Imagga credentials. IMAGGA_API_KEY:', !!apiKey, 'IMAGGA_API_SECRET:', !!apiSecret);
        throw new Error('Imagga API credentials not configured');
    }

    console.log('Calling Imagga API with image buffer size:', imageBuffer.length, 'bytes');

    try {
        // Create form data
        const formData = new FormData();
        formData.append('image', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg',
        });

        // Make request to Imagga
        const response = await axios.post<ImaggaResponse>(
            IMAGGA_API_URL,
            formData,
            {
                auth: {
                    username: apiKey,
                    password: apiSecret,
                },
                headers: {
                    ...formData.getHeaders(),
                    'Accept': 'application/json',
                },
                timeout: 30000, // 30 second timeout
            }
        );

        console.log('Imagga API response status:', response.status);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
            console.error('Response status:', error.response?.status);
            console.error('Response data:', error.response?.data);

            if (error.response) {
                // Server responded with error
                throw new Error(
                    `Imagga API error (${error.response.status}): ${error.response.data?.status?.text || error.message}`
                );
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request to Imagga API timed out');
            } else if (error.request) {
                throw new Error('No response from Imagga API - check your internet connection');
            }
        }
        console.error('Unexpected error:', error);
        throw error;
    }
}
