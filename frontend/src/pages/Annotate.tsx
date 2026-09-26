import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Scan, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

import AnnotationCanvas from '../components/AnnotationCanvas';
import StepTracker from '../components/StepTracker';
import { cropImageToROI } from '../utils/cropImage';
import { recognizeImage } from '../services/api';
import { MIN_ROI_SIZE_PX } from '../utils/constants';
import type { ROI } from '../types/api';

export default function Annotate() {
    const location = useLocation();
    const navigate = useNavigate();

    const { file, previewUrl } = (location.state as {
        file?: File;
        previewUrl?: string;
    }) || {};

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [roi, setROI] = useState<ROI | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!file || !previewUrl) {
            navigate('/demo/input');
            return;
        }

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

        return () => {
            if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file, previewUrl, navigate]);

    const handleRecognize = async () => {
        if (!image || !roi) return;

        if (roi.width < MIN_ROI_SIZE_PX || roi.height < MIN_ROI_SIZE_PX) {
            navigate('/demo/error', {
                state: {
                    error: `Selected region is too small. Minimum size is ${MIN_ROI_SIZE_PX}×${MIN_ROI_SIZE_PX} pixels.`,
                },
            });
            return;
        }

        setIsProcessing(true);
        navigate('/demo/processing', { replace: true });

        try {
            const croppedBlob = await cropImageToROI(image, roi);
            const response = await recognizeImage(croppedBlob);

            if (response.success && response.results) {
                navigate('/demo/results', {
                    state: {
                        results: response.results,
                        previewUrl,
                    },
                    replace: true,
                });
            } else {
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
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-2">
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-xs text-zinc-400">Loading canvas...</p>
                </div>
            </div>
        );
    }

    const isROIValid = roi && roi.width >= MIN_ROI_SIZE_PX && roi.height >= MIN_ROI_SIZE_PX;

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-4xl w-full mx-auto">
            <StepTracker currentStep={2} />

            <div className="w-full space-y-4">
                <div className="text-center space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Define Region of Interest</h1>
                    <p className="text-xs sm:text-sm text-zinc-400">
                        Drag to position and resize the bounding box around target object
                    </p>
                </div>

                {/* Canvas */}
                <div className="flex justify-center">
                    <AnnotationCanvas image={image} onROIChange={setROI} />
                </div>

                {/* Controls Bar */}
                <div className="ui-card p-3 sm:p-4 space-y-3 max-w-xl mx-auto w-full">
                    <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Crop:</span>
                            <span className="font-mono text-zinc-200 font-medium">
                                {roi ? `${Math.round(roi.width)} × ${Math.round(roi.height)} px` : '—'}
                            </span>
                        </div>

                        <div className="text-zinc-500 text-[11px]">
                            Source: {image.naturalWidth} × {image.naturalHeight} px
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                        <button
                            onClick={() => navigate('/demo/input')}
                            disabled={isProcessing}
                            className="btn-secondary text-xs h-8 px-3"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Change Image</span>
                        </button>

                        <button
                            onClick={handleRecognize}
                            disabled={!isROIValid || isProcessing}
                            className={`btn-primary text-xs h-8 px-4 ${
                                !isROIValid || isProcessing ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                        >
                            <Scan className="w-3.5 h-3.5" />
                            <span>{isProcessing ? 'Processing...' : 'Recognize Object'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}