import { Router, Request, Response } from 'express';
import multer from 'multer';
import { recognizeImage } from '../services/imagga';

const router = Router();

// Configure multer for memory storage (we don't save files to disk)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Only accept images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

/**
 * POST /api/recognize
 * Accepts an image and returns top 3 recognition results
 */
router.post('/recognize', upload.single('image'), async (req: Request, res: Response) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided',
            });
        }

        console.log(`Processing image: ${req.file.originalname} (${req.file.size} bytes)`);

        // Call Imagga API
        const imaggaResponse = await recognizeImage(req.file.buffer);

        // Extract top 3 results
        const results = imaggaResponse.result.tags.slice(0, 3).map((tag, index) => ({
            rank: index + 1,
            label: tag.tag.en,
            confidence: tag.confidence / 100, // Convert to 0-1 range
        }));

        console.log(`Recognition successful: ${results.length} results`);

        return res.json({
            success: true,
            results,
        });
    } catch (error) {
        console.error('Recognition error:', error);

        // Handle different error types
        if (error instanceof Error) {
            if (error.message.includes('credentials not configured')) {
                return res.status(500).json({
                    success: false,
                    error: 'Server configuration error. Please contact support.',
                });
            }

            if (error.message.includes('timed out')) {
                return res.status(504).json({
                    success: false,
                    error: 'Request timed out. Please try again.',
                });
            }

            // Log full error for debugging
            console.error('Full error details:', error);

            return res.status(500).json({
                success: false,
                error: `Recognition failed: ${error.message}. Please check server logs for details.`,
            });
        }

        return res.status(500).json({
            success: false,
            error: 'An unexpected error occurred',
        });
    }
});

export default router;
