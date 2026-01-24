import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_ROI_PERCENTAGE, MIN_ROI_SIZE_PX } from '../utils/constants';
import type { ROI } from '../types/api';

interface AnnotationCanvasProps {
    image: HTMLImageElement;
    onROIChange: (roi: ROI) => void;
}

export default function AnnotationCanvas({ image, onROIChange }: AnnotationCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [roi, setROI] = useState<ROI>({ x: 0, y: 0, width: 0, height: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Calculate scale to fit image nicely on screen
    const maxWidth = Math.min(window.innerWidth - 100, 700);
    const maxHeight = Math.min(window.innerHeight - 350, 450);
    const scaleToFitWidth = maxWidth / image.width;
    const scaleToFitHeight = maxHeight / image.height;
    const baseScale = Math.min(scaleToFitWidth, scaleToFitHeight, 1);
    const scale = baseScale * zoom;
    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    // Initialize ROI centered on image
    useEffect(() => {
        const initialWidth = image.width * DEFAULT_ROI_PERCENTAGE;
        const initialHeight = image.height * DEFAULT_ROI_PERCENTAGE;
        const initialROI = {
            x: (image.width - initialWidth) / 2,
            y: (image.height - initialHeight) / 2,
            width: initialWidth,
            height: initialHeight,
        };
        setROI(initialROI);
        onROIChange(initialROI);
    }, [image]);

    // Update parent when ROI changes
    useEffect(() => {
        onROIChange(roi);
    }, [roi, onROIChange]);

    // Convert screen coordinates to image coordinates
    const screenToImage = useCallback((screenX: number, screenY: number) => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0 };
        const rect = container.getBoundingClientRect();
        return {
            x: (screenX - rect.left) / scale,
            y: (screenY - rect.top) / scale,
        };
    }, [scale]);

    // Constrain ROI to image bounds
    const constrainROI = useCallback((newROI: ROI): ROI => {
        const minSize = MIN_ROI_SIZE_PX;
        let { x, y, width, height } = newROI;

        // Ensure minimum size
        width = Math.max(minSize, width);
        height = Math.max(minSize, height);

        // Ensure within bounds
        x = Math.max(0, Math.min(x, image.width - width));
        y = Math.max(0, Math.min(y, image.height - height));
        width = Math.min(width, image.width - x);
        height = Math.min(height, image.height - y);

        return { x, y, width, height };
    }, [image.width, image.height]);

    // Unified start handler for both mouse and touch
    const handleInteractionStart = useCallback((clientX: number, clientY: number, isDrag: boolean, corner?: string) => {
        const pos = screenToImage(clientX, clientY);
        if (isDrag) {
            setIsDragging(true);
            setDragStart({ x: pos.x - roi.x, y: pos.y - roi.y });
        } else if (corner) {
            setIsResizing(corner);
        }
    }, [screenToImage, roi]);

    // Handle mouse down on box (for dragging)
    const handleBoxMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleInteractionStart(e.clientX, e.clientY, true);
    };

    // Handle touch start on box (for dragging)
    const handleBoxTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        handleInteractionStart(touch.clientX, touch.clientY, true);
    };

    // Handle mouse down on corner handle (for resizing)
    const handleHandleMouseDown = (corner: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleInteractionStart(e.clientX, e.clientY, false, corner);
    };

    // Handle touch start on corner handle (for resizing)
    const handleHandleTouchStart = (corner: string) => (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        handleInteractionStart(touch.clientX, touch.clientY, false, corner);
    };

    // Unified move handler for both mouse and touch
    const handleInteractionMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging && !isResizing) return;

        const pos = screenToImage(clientX, clientY);

        if (isDragging) {
            // Move the entire box
            const newROI = constrainROI({
                x: pos.x - dragStart.x,
                y: pos.y - dragStart.y,
                width: roi.width,
                height: roi.height,
            });
            setROI(newROI);
        } else if (isResizing) {
            // Resize from the corner being dragged
            let newROI = { ...roi };

            switch (isResizing) {
                case 'top-left':
                    newROI = {
                        x: pos.x,
                        y: pos.y,
                        width: roi.x + roi.width - pos.x,
                        height: roi.y + roi.height - pos.y,
                    };
                    break;
                case 'top-right':
                    newROI = {
                        x: roi.x,
                        y: pos.y,
                        width: pos.x - roi.x,
                        height: roi.y + roi.height - pos.y,
                    };
                    break;
                case 'bottom-left':
                    newROI = {
                        x: pos.x,
                        y: roi.y,
                        width: roi.x + roi.width - pos.x,
                        height: pos.y - roi.y,
                    };
                    break;
                case 'bottom-right':
                    newROI = {
                        x: roi.x,
                        y: roi.y,
                        width: pos.x - roi.x,
                        height: pos.y - roi.y,
                    };
                    break;
            }

            setROI(constrainROI(newROI));
        }
    }, [isDragging, isResizing, dragStart, roi, screenToImage, constrainROI]);

    // Handle mouse move
    const handleMouseMove = useCallback((e: MouseEvent) => {
        handleInteractionMove(e.clientX, e.clientY);
    }, [handleInteractionMove]);

    // Handle touch move
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length > 0) {
            e.preventDefault(); // Prevent scrolling while dragging
            const touch = e.touches[0];
            handleInteractionMove(touch.clientX, touch.clientY);
        }
    }, [handleInteractionMove]);

    // Handle interaction end (mouse up or touch end)
    const handleInteractionEnd = useCallback(() => {
        setIsDragging(false);
        setIsResizing(null);
    }, []);

    // Add/remove global mouse and touch listeners
    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleInteractionEnd);
            window.addEventListener('touchcancel', handleInteractionEnd);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleInteractionEnd);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleInteractionEnd);
                window.removeEventListener('touchcancel', handleInteractionEnd);
            };
        }
    }, [isDragging, isResizing, handleMouseMove, handleTouchMove, handleInteractionEnd]);

    // Zoom controls
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
    const handleZoomReset = () => setZoom(1);

    // Calculate scaled ROI for display
    const scaledROI = {
        x: roi.x * scale,
        y: roi.y * scale,
        width: roi.width * scale,
        height: roi.height * scale,
    };

    const handleSize = 12;

    return (
        <div className="space-y-4">
            {/* Zoom Controls */}
            <div className="flex justify-center gap-3">
                <button onClick={handleZoomOut} className="px-4 py-2 glass rounded-lg text-sm font-medium hover:bg-white/10">
                    🔍 −
                </button>
                <button onClick={handleZoomReset} className="px-4 py-2 glass rounded-lg text-sm font-medium hover:bg-white/10">
                    {Math.round(zoom * 100)}%
                </button>
                <button onClick={handleZoomIn} className="px-4 py-2 glass rounded-lg text-sm font-medium hover:bg-white/10">
                    🔍 +
                </button>
            </div>

            {/* Canvas Container */}
            <div className="flex justify-center">
                <div
                    ref={containerRef}
                    className="relative inline-block rounded-lg overflow-hidden shadow-2xl select-none"
                    style={{
                        width: displayWidth,
                        height: displayHeight,
                        touchAction: 'none' // Prevents default touch behaviors
                    }}
                >
                    {/* Background Image */}
                    <img
                        src={image.src}
                        alt="Annotate"
                        className="block"
                        style={{ width: displayWidth, height: displayHeight }}
                        draggable={false}
                    />

                    {/* Dark Overlay - Top */}
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: 0, top: 0,
                            width: displayWidth,
                            height: scaledROI.y,
                        }}
                    />
                    {/* Dark Overlay - Bottom */}
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: 0,
                            top: scaledROI.y + scaledROI.height,
                            width: displayWidth,
                            height: displayHeight - scaledROI.y - scaledROI.height,
                        }}
                    />
                    {/* Dark Overlay - Left */}
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: 0,
                            top: scaledROI.y,
                            width: scaledROI.x,
                            height: scaledROI.height,
                        }}
                    />
                    {/* Dark Overlay - Right */}
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: scaledROI.x + scaledROI.width,
                            top: scaledROI.y,
                            width: displayWidth - scaledROI.x - scaledROI.width,
                            height: scaledROI.height,
                        }}
                    />

                    {/* ROI Box - Draggable Area */}
                    <div
                        className="absolute border-3 border-emerald-500 cursor-move"
                        style={{
                            left: scaledROI.x,
                            top: scaledROI.y,
                            width: scaledROI.width,
                            height: scaledROI.height,
                            borderWidth: 3,
                            borderColor: '#10B981',
                            touchAction: 'none'
                        }}
                        onMouseDown={handleBoxMouseDown}
                        onTouchStart={handleBoxTouchStart}
                    />

                    {/* Corner Handles */}
                    {[
                        { name: 'top-left', left: scaledROI.x - handleSize / 2, top: scaledROI.y - handleSize / 2, cursor: 'nwse-resize' },
                        { name: 'top-right', left: scaledROI.x + scaledROI.width - handleSize / 2, top: scaledROI.y - handleSize / 2, cursor: 'nesw-resize' },
                        { name: 'bottom-left', left: scaledROI.x - handleSize / 2, top: scaledROI.y + scaledROI.height - handleSize / 2, cursor: 'nesw-resize' },
                        { name: 'bottom-right', left: scaledROI.x + scaledROI.width - handleSize / 2, top: scaledROI.y + scaledROI.height - handleSize / 2, cursor: 'nwse-resize' },
                    ].map((handle) => (
                        <div
                            key={handle.name}
                            className="absolute bg-emerald-500 border-2 border-white rounded-full shadow-lg"
                            style={{
                                left: handle.left,
                                top: handle.top,
                                width: handleSize,
                                height: handleSize,
                                cursor: handle.cursor,
                                touchAction: 'none'
                            }}
                            onMouseDown={handleHandleMouseDown(handle.name)}
                            onTouchStart={handleHandleTouchStart(handle.name)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}