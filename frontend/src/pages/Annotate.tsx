import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnnotationCanvas from '../components/AnnotationCanvas';
import { cropImageToROI } from '../utils/cropImage';
import { recognizeImage } from '../services/api';
import { MIN_ROI_SIZE_PX } from '../utils/constants';
import type { ROI } from '../types/api';

export default function Annotate() {
    const location = useLocation();
    const navigate = useNavigate();

    const { file, previewUrl } = location.state as {
        file: File;
        previewUrl: string;
    };

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [roi, setROI] = useState<ROI | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!file || !previewUrl) {
            navigate('/demo/input');
            return;
        }

        // Load the image element using the previewUrl directly
        // This is more reliable on mobile browsers
        const img = new Image();
        img.onload = () => {
            setImage(img);
        };
        img.onerror = () => {
            navigate('/demo/error', {
                state: { error: 'Failed to load image for annotation' },
            });
        };
        img.src = previewUrl;

        // Cleanup: revoke object URL when component unmounts
        return () => {
            if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file, previewUrl, navigate]);

    const handleRecognize = async () => {
        if (!image || !roi) return;

        // Validate ROI size
        if (roi.width < MIN_ROI_SIZE_PX || roi.height < MIN_ROI_SIZE_PX) {
            navigate('/demo/error', {
                state: {
                    error: `Selected region is too small. Please select a larger area (minimum ${MIN_ROI_SIZE_PX}x${MIN_ROI_SIZE_PX} pixels).`,
                },
            });
            return;
        }

        setIsProcessing(true);

        // Navigate to processing page immediately for better UX
        navigate('/demo/processing', { replace: true });

        try {
            // Crop the image to ROI
            const croppedBlob = await cropImageToROI(image, roi);

            // Send to backend for recognition
            const response = await recognizeImage(croppedBlob);

            if (response.success && response.results) {
                // Navigate to results page
                navigate('/demo/results', {
                    state: {
                        results: response.results,
                        previewUrl,
                    },
                    replace: true,
                });
            } else {
                // Navigate to error page
                navigate('/demo/error', {
                    state: {
                        error: response.error || 'Recognition failed. Please try again.',
                    },
                    replace: true,
                });
            }
        } catch (error) {
            navigate('/demo/error', {
                state: {
                    error: 'An unexpected error occurred during recognition.',
                },
                replace: true,
            });
        }
    };

    if (!image) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-glass border-t-emerald-500 rounded-full mx-auto mb-4" />
                    <p className="text-gray-400">Loading image...</p>
                </div>
            </div>
        );
    }

    const isROIValid = roi && roi.width >= MIN_ROI_SIZE_PX && roi.height >= MIN_ROI_SIZE_PX;

    return (
        <div className="min-h-screen px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">Annotate Object</h1>
                    <p className="text-gray-300">
                        Draw a box around the object you want to identify
                    </p>
                </div>

                {/* Instructions */}
                <div className="glass p-4">
                    <p className="text-sm text-gray-300">
                        💡 <strong>Tip:</strong> Drag the box to move it, or drag the corners to resize.
                        Make sure the entire object is within the green box for best results.
                    </p>
                </div>

                {/* Annotation Canvas */}
                <div className="flex justify-center">
                    <AnnotationCanvas image={image} onROIChange={setROI} />
                </div>

                {/* ROI Info */}
                {roi && (
                    <div className="glass p-4 text-sm text-gray-300 text-center">
                        Selected area: {Math.round(roi.width)} × {Math.round(roi.height)} pixels
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleRecognize}
                        disabled={!isROIValid || isProcessing}
                        className={`btn-primary flex-1 ${!isROIValid || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isProcessing ? 'Processing...' : 'Recognize Object'}
                    </button>
                    <button
                        onClick={() => navigate('/demo/input')}
                        disabled={isProcessing}
                        className="btn-secondary flex-1"
                    >
                        Choose Different Image
                    </button>
                </div>

                <button
                    onClick={() => navigate('/')}
                    disabled={isProcessing}
                    className="btn-secondary w-full"
                >
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
}