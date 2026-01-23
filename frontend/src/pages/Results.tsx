import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { RecognitionResult } from '../types/api';

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, previewUrl } = location.state as {
        results: RecognitionResult[];
        previewUrl: string;
    };

    if (!results || !previewUrl) {
        navigate('/demo/input');
        return null;
    }

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.75) return 'from-emerald-500 to-emerald-600';
        if (confidence >= 0.5) return 'from-yellow-500 to-yellow-600';
        return 'from-crimson-500 to-crimson-600';
    };

    return (
        <div className="min-h-screen px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <h1 className="text-4xl font-bold text-center">Recognition Results</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image Preview */}
                    <div className="glass p-6">
                        <img
                            src={previewUrl}
                            alt="Analyzed"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Top Predictions</h2>

                        {results.map((result) => (
                            <motion.div
                                key={result.rank}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: result.rank * 0.1 }}
                                className="glass p-6 glass-hover"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl font-bold text-emerald-500">
                                                #{result.rank}
                                            </span>
                                            <h3 className="text-xl font-semibold capitalize">
                                                {result.label}
                                            </h3>
                                        </div>

                                        {/* Confidence Bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Confidence</span>
                                                <span className="font-medium">
                                                    {(result.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>

                                            <div className="h-3 bg-charcoal-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.confidence * 100}%` }}
                                                    transition={{ delay: result.rank * 0.1 + 0.2, duration: 0.8 }}
                                                    className={`h-full bg-gradient-to-r ${getConfidenceColor(result.confidence)}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/demo/input')}
                        className="btn-primary"
                    >
                        Try Another Image
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary"
                    >
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
