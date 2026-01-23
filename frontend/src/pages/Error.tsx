import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ErrorPageProps {
    error?: string;
}

export default function Error() {
    const navigate = useNavigate();
    const location = useLocation();
    const error = (location.state as ErrorPageProps)?.error || 'An unexpected error occurred';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center space-y-6"
            >
                {/* Error Icon */}
                <div className="text-7xl">⚠️</div>

                <h1 className="text-3xl font-bold">Something Went Wrong</h1>

                {/* Error Message */}
                <div className="glass p-6 border border-crimson-500/30">
                    <p className="text-gray-300">{error}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-primary w-full"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/demo/input')}
                        className="btn-secondary w-full"
                    >
                        Start Over
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary w-full"
                    >
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
