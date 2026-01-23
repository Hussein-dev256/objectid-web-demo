import axios from 'axios';
import FormData from 'form-data';

const IMAGGA_API_KEY = process.env.IMAGGA_API_KEY || '';
const IMAGGA_API_SECRET = process.env.IMAGGA_API_SECRET || '';
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
    // Check if credentials are configured
    if (!IMAGGA_API_KEY || !IMAGGA_API_SECRET) {
        throw new Error('Imagga API credentials not configured');
    }

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
                    username: IMAGGA_API_KEY,
                    password: IMAGGA_API_SECRET,
                },
                headers: {
                    ...formData.getHeaders(),
                    'Accept': 'application/json',
                },
                timeout: 30000, // 30 second timeout
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error
                throw new Error(
                    `Imagga API error (${error.response.status}): ${error.response.data?.status?.text || error.message}`
                );
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request to Imagga API timed out');
            } else if (error.request) {
                throw new Error('No response from Imagga API');
            }
        }
        throw error;
    }
}
