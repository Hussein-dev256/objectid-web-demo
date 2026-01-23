import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Readable } from 'stream';

// Use require for CommonJS modules to avoid esModuleInterop issues
const axios = require('axios');
const FormData = require('form-data');
const Busboy = require('busboy');

const IMAGGA_API_URL = 'https://api.imagga.com/v2/tags';

// Parse multipart form data
function parseMultipart(req: VercelRequest): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const busboy = Busboy({ headers: req.headers });
        let fileBuffer: Buffer | null = null;

        busboy.on('file', (fieldname: string, file: Readable, info: { filename: string; encoding: string; mimeType: string }) => {
            const chunks: Buffer[] = [];
            file.on('data', (chunk: Buffer) => chunks.push(chunk));
            file.on('end', () => {
                fileBuffer = Buffer.concat(chunks);
            });
        });

        busboy.on('finish', () => {
            if (fileBuffer) {
                resolve(fileBuffer);
            } else {
                reject(new Error('No file uploaded'));
            }
        });

        busboy.on('error', reject);
        (req as unknown as Readable).pipe(busboy);
    });
}

// CORS headers
function setCorsHeaders(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const apiKey = process.env.IMAGGA_API_KEY;
        const apiSecret = process.env.IMAGGA_API_SECRET;

        if (!apiKey || !apiSecret) {
            console.error('Imagga credentials missing');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error',
            });
        }

        // Parse the uploaded image
        const imageBuffer = await parseMultipart(req);
        console.log('Received image:', imageBuffer.length, 'bytes');

        // Create form data for Imagga
        const formData = new FormData();
        formData.append('image', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg',
        });

        // Call Imagga API
        const imaggaResponse = await axios.post(IMAGGA_API_URL, formData, {
            auth: {
                username: apiKey,
                password: apiSecret,
            },
            headers: {
                ...formData.getHeaders(),
                Accept: 'application/json',
            },
            timeout: 30000,
        });

        // Extract top 3 results
        const results = imaggaResponse.data.result.tags.slice(0, 3).map((tag: { tag: { en: string }; confidence: number }, index: number) => ({
            rank: index + 1,
            label: tag.tag.en,
            confidence: tag.confidence / 100,
        }));

        console.log('Recognition successful:', results.length, 'results');

        return res.status(200).json({
            success: true,
            results,
        });
    } catch (error: unknown) {
        const err = error as { message?: string; response?: { data?: { status?: { text?: string } } }; isAxiosError?: boolean };
        console.error('Recognition error:', err.message);

        if (err.isAxiosError && err.response) {
            return res.status(500).json({
                success: false,
                error: `Imagga API error: ${err.response.data?.status?.text || err.message}`,
            });
        }

        return res.status(500).json({
            success: false,
            error: err.message || 'Recognition failed',
        });
    }
}

export const config = {
    api: {
        bodyParser: false, // We handle body parsing ourselves for multipart
    },
};
