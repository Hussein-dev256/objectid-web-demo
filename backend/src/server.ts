import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recognizeRouter from './routes/recognize';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api', recognizeRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'ObjectID Backend API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ObjectID Backend API running on http://localhost:${PORT}`);
    console.log(`✓ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);

    // Check if Imagga credentials are configured
    if (process.env.IMAGGA_API_KEY && process.env.IMAGGA_API_SECRET) {
        console.log('✓ Imagga API credentials configured');
    } else {
        console.warn('⚠️  Warning: Imagga API credentials not found in environment variables');
    }
});
