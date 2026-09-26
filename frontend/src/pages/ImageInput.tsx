import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { validateImageFile, createImageElement } from '../utils/imageValidation';
import StepTracker from '../components/StepTracker';

const SAMPLE_IMAGES = [
    {
        name: 'Vintage Camera',
        url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
        label: 'Camera',
    },
    {
        name: 'Headphones',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        label: 'Audio',
    },
    {
        name: 'Sneakers',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        label: 'Footwear',
    },
    {
        name: 'Coffee Mug',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        label: 'Coffee',
    },
];

export default function ImageInput() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoadingSample, setIsLoadingSample] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileSelect = async (file: File) => {
        setError(null);

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        try {
            await createImageElement(file);
            setSelectedFile(file);
            setFileInfo({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            });
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } catch (err) {
            setError('Failed to load image. The file may be corrupted.');
        }
    };

    const handleSampleSelect = async (sample: typeof SAMPLE_IMAGES[0]) => {
        setError(null);
        setIsLoadingSample(true);
        try {
            const response = await fetch(sample.url);
            const blob = await response.blob();
            const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, '-')}.jpg`, {
                type: 'image/jpeg',
            });
            await handleFileSelect(file);
        } catch (err) {
            setError('Failed to load sample image. Please try uploading your own photo.');
        } finally {
            setIsLoadingSample(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleContinue = () => {
        if (selectedFile && previewUrl) {
            navigate('/demo/annotate', {
                state: { file: selectedFile, previewUrl },
            });
        }
    };

    const handleReset = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileInfo(null);
        setError(null);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-2xl w-full mx-auto">
            <StepTracker currentStep={1} />

            <div className="w-full space-y-4">
                <div className="text-center space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Select Image</h1>
                    <p className="text-xs sm:text-sm text-zinc-400">
                        Upload a photo or choose a sample to begin object recognition
                    </p>
                </div>

                {/* Upload Area */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`ui-card p-5 sm:p-6 transition-all border ${
                        isDragging
                            ? 'border-emerald-500/60 bg-emerald-500/[0.04]'
                            : 'border-white/[0.08] hover:border-white/[0.14]'
                    }`}
                >
                    {!previewUrl ? (
                        <div className="text-center space-y-3 py-2">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors cursor-pointer"
                            >
                                <UploadCloud className="w-5 h-5" />
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-zinc-200">
                                    Drag and drop your image here, or{' '}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-emerald-400 hover:underline"
                                    >
                                        browse
                                    </button>
                                </p>
                                <p className="text-[11px] text-zinc-500">
                                    Supports JPG, PNG, WebP up to 5 MB
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="relative rounded-lg overflow-hidden bg-black/40 border border-white/[0.08] max-h-[300px] flex items-center justify-center p-2">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-[260px] w-auto object-contain rounded"
                                />

                                {fileInfo && (
                                    <div className="absolute top-2.5 right-2.5 bg-black/75 px-2 py-1 rounded text-[11px] text-zinc-300 border border-white/[0.08] backdrop-blur-sm flex items-center gap-1.5">
                                        <ImageIcon className="w-3 h-3 text-emerald-400" />
                                        <span>{fileInfo.name}</span>
                                        <span className="text-zinc-500">•</span>
                                        <span>{fileInfo.size}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleReset}
                                    className="btn-secondary text-xs h-8 px-3"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Replace Image</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Sample Selector */}
                {!previewUrl && (
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                            <span>Or select a test sample</span>
                            <div className="flex-1 h-[1px] bg-white/[0.06]" />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SAMPLE_IMAGES.map((sample) => (
                                <button
                                    key={sample.name}
                                    disabled={isLoadingSample}
                                    onClick={() => handleSampleSelect(sample)}
                                    className="ui-card-interactive p-2 text-left group hover:border-emerald-500/30"
                                >
                                    <div className="h-16 w-full rounded overflow-hidden relative mb-1.5 bg-black/40">
                                        <img
                                            src={sample.url}
                                            alt={sample.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            loading="lazy"
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-zinc-300 truncate">
                                        {sample.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error Box */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="p-3 rounded-lg border border-red-500/30 bg-red-500/[0.08] text-red-300 flex items-center gap-2 text-xs"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </button>

                    <button
                        onClick={handleContinue}
                        disabled={!selectedFile || isLoadingSample}
                        className={`btn-primary ${
                            !selectedFile || isLoadingSample ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                    >
                        <span>Continue to Annotation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
