// API Response Types
export interface RecognitionResult {
    rank: number;
    label: string;
    confidence: number;
}

export interface ApiResponse {
    success: boolean;
    results?: RecognitionResult[];
    error?: string;
}

// ROI (Region of Interest) Types
export interface ROI {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Image Validation Types
export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export interface ImageDimensions {
    width: number;
    height: number;
}
