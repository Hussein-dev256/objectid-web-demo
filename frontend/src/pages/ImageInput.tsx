import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { validateImageFile, createImageElement } from '../utils/imageValidation';

export default function ImageInput() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileSelect = async (file: File) => {
        setError(null);

        // Validate the file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        try {
            // Try to load the image to ensure it's valid
            await createImageElement(file);

            // Set the file and create preview
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } catch (err) {
            setError('Failed to load image. The file may be corrupted.');
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
            // Store the file and preview for the next page
            navigate('/demo/annotate', {
                state: { file: selectedFile, previewUrl },
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full space-y-6"
            >
                <h1 className="text-4xl font-bold text-center">Select an Image</h1>
                <p className="text-center text-gray-300">
                    Upload an image or capture one using your camera
                </p>

                {/* Upload Area */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`glass p-8 border-2 border-dashed transition-all ${isDragging
                            ? 'border-emerald-500 bg-glass-hover'
                            : 'border-glass'
                        }`}
                >
                    {!previewUrl ? (
                        <div className="text-center space-y-4">
                            <div className="text-6xl">📷</div>
                            <p className="text-gray-300">
                                Drag and drop an image here, or click to browse
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-secondary"
                            >
                                Choose File
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-auto rounded-lg max-h-96 object-contain"
                            />
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                    setError(null);
                                }}
                                className="btn-secondary w-full"
                            >
                                Choose Different Image
                            </button>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-4 border border-crimson-500"
                    >
                        <p className="text-crimson-500">{error}</p>
                    </motion.div>
                )}

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!selectedFile}
                    className={`btn-primary w-full ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    Continue to Annotation
                </button>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="btn-secondary w-full"
                >
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
}
