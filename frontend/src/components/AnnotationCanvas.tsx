import { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Target } from 'lucide-react';
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

    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 800,
        height: typeof window !== 'undefined' ? window.innerHeight : 600,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxWidth = Math.min(windowSize.width - 32, 680);
    const maxHeight = Math.min(windowSize.height - 300, 420);
    const scaleToFitWidth = maxWidth / image.width;
    const scaleToFitHeight = maxHeight / image.height;
    const baseScale = Math.min(scaleToFitWidth, scaleToFitHeight, 1);
    const scale = baseScale * zoom;
    const displayWidth = Math.round(image.width * scale);
    const displayHeight = Math.round(image.height * scale);

    useEffect(() => {
        const initialWidth = Math.round(image.width * DEFAULT_ROI_PERCENTAGE);
        const initialHeight = Math.round(image.height * DEFAULT_ROI_PERCENTAGE);
        const initialROI = {
            x: Math.round((image.width - initialWidth) / 2),
            y: Math.round((image.height - initialHeight) / 2),
            width: initialWidth,
            height: initialHeight,
        };
        setROI(initialROI);
        onROIChange(initialROI);
    }, [image]);

    useEffect(() => {
        onROIChange(roi);
    }, [roi, onROIChange]);

    const screenToImage = useCallback((screenX: number, screenY: number) => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0 };
        const rect = container.getBoundingClientRect();
        return {
            x: (screenX - rect.left) / scale,
            y: (screenY - rect.top) / scale,
        };
    }, [scale]);

    const constrainROI = useCallback((newROI: ROI): ROI => {
        const minSize = MIN_ROI_SIZE_PX;
        let { x, y, width, height } = newROI;

        width = Math.max(minSize, width);
        height = Math.max(minSize, height);

        x = Math.max(0, Math.min(x, image.width - width));
        y = Math.max(0, Math.min(y, image.height - height));
        width = Math.min(width, image.width - x);
        height = Math.min(height, image.height - y);

        return { x, y, width, height };
    }, [image.width, image.height]);

    const handleInteractionStart = useCallback((clientX: number, clientY: number, isDrag: boolean, corner?: string) => {
        const pos = screenToImage(clientX, clientY);
        if (isDrag) {
            setIsDragging(true);
            setDragStart({ x: pos.x - roi.x, y: pos.y - roi.y });
        } else if (corner) {
            setIsResizing(corner);
        }
    }, [screenToImage, roi]);

    const handleBoxMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleInteractionStart(e.clientX, e.clientY, true);
    };

    const handleBoxTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        handleInteractionStart(touch.clientX, touch.clientY, true);
    };

    const handleHandleMouseDown = (corner: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleInteractionStart(e.clientX, e.clientY, false, corner);
    };

    const handleHandleTouchStart = (corner: string) => (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        handleInteractionStart(touch.clientX, touch.clientY, false, corner);
    };

    const handleInteractionMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging && !isResizing) return;

        const pos = screenToImage(clientX, clientY);

        if (isDragging) {
            const newROI = constrainROI({
                x: pos.x - dragStart.x,
                y: pos.y - dragStart.y,
                width: roi.width,
                height: roi.height,
            });
            setROI(newROI);
        } else if (isResizing) {
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

    const handleMouseMove = useCallback((e: MouseEvent) => {
        handleInteractionMove(e.clientX, e.clientY);
    }, [handleInteractionMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length > 0) {
            e.preventDefault();
            const touch = e.touches[0];
            handleInteractionMove(touch.clientX, touch.clientY);
        }
    }, [handleInteractionMove]);

    const handleInteractionEnd = useCallback(() => {
        setIsDragging(false);
        setIsResizing(null);
    }, []);

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

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.0));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
    const handleZoomReset = () => setZoom(1);

    const handleCenterROI = () => {
        const width = Math.round(image.width * DEFAULT_ROI_PERCENTAGE);
        const height = Math.round(image.height * DEFAULT_ROI_PERCENTAGE);
        setROI({
            x: Math.round((image.width - width) / 2),
            y: Math.round((image.height - height) / 2),
            width,
            height,
        });
    };

    const scaledROI = {
        x: roi.x * scale,
        y: roi.y * scale,
        width: roi.width * scale,
        height: roi.height * scale,
    };

    const handleSize = 12;

    return (
        <div className="space-y-3 w-full flex flex-col items-center">
            {/* Viewfinder Controls Toolbar */}
            <div className="flex items-center gap-1.5 ui-card px-2.5 py-1">
                <button
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-white transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                    onClick={handleZoomReset}
                    className="px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-300 hover:bg-white/[0.08] rounded transition-colors"
                >
                    {Math.round(zoom * 100)}%
                </button>

                <button
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-white transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-3 bg-white/[0.1] mx-1" />

                <button
                    onClick={handleCenterROI}
                    className="flex items-center gap-1 px-2 py-1 hover:bg-white/[0.08] rounded text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                    <Target className="w-3 h-3 text-emerald-400" />
                    <span>Center</span>
                </button>
            </div>

            {/* Canvas Container */}
            <div className="relative rounded-lg overflow-hidden p-1.5 ui-card bg-black/60 max-w-full">
                <div
                    ref={containerRef}
                    className="relative inline-block rounded overflow-hidden select-none max-w-full"
                    style={{
                        width: displayWidth,
                        height: displayHeight,
                        touchAction: 'none',
                    }}
                >
                    <img
                        src={image.src}
                        alt="Annotate"
                        className="block max-w-none"
                        style={{ width: displayWidth, height: displayHeight }}
                        draggable={false}
                    />

                    {/* Darkened Mask Overlays */}
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: 0,
                            top: 0,
                            width: displayWidth,
                            height: scaledROI.y,
                        }}
                    />
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: 0,
                            top: scaledROI.y + scaledROI.height,
                            width: displayWidth,
                            height: displayHeight - scaledROI.y - scaledROI.height,
                        }}
                    />
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: 0,
                            top: scaledROI.y,
                            width: scaledROI.x,
                            height: scaledROI.height,
                        }}
                    />
                    <div
                        className="absolute bg-black/60 pointer-events-none"
                        style={{
                            left: scaledROI.x + scaledROI.width,
                            top: scaledROI.y,
                            width: displayWidth - scaledROI.x - scaledROI.width,
                            height: scaledROI.height,
                        }}
                    />

                    {/* Restrained ROI Bounding Box */}
                    <div
                        className="absolute cursor-move border border-emerald-400 bg-emerald-500/[0.08]"
                        style={{
                            left: scaledROI.x,
                            top: scaledROI.y,
                            width: scaledROI.width,
                            height: scaledROI.height,
                            touchAction: 'none',
                        }}
                        onMouseDown={handleBoxMouseDown}
                        onTouchStart={handleBoxTouchStart}
                    >
                        {/* Compact HUD Tag */}
                        <div className="absolute -top-5 left-0 bg-zinc-900/95 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                            {Math.round(roi.width)} × {Math.round(roi.height)} px
                        </div>
                    </div>

                    {/* 4 Clean Corner Handles with Expanded Touch Area */}
                    {[
                        { name: 'top-left', left: scaledROI.x - handleSize / 2, top: scaledROI.y - handleSize / 2, cursor: 'nwse-resize' },
                        { name: 'top-right', left: scaledROI.x + scaledROI.width - handleSize / 2, top: scaledROI.y - handleSize / 2, cursor: 'nesw-resize' },
                        { name: 'bottom-left', left: scaledROI.x - handleSize / 2, top: scaledROI.y + scaledROI.height - handleSize / 2, cursor: 'nesw-resize' },
                        { name: 'bottom-right', left: scaledROI.x + scaledROI.width - handleSize / 2, top: scaledROI.y + scaledROI.height - handleSize / 2, cursor: 'nwse-resize' },
                    ].map((handle) => (
                        <div
                            key={handle.name}
                            className="absolute flex items-center justify-center -m-1 p-1 cursor-pointer"
                            style={{
                                left: handle.left,
                                top: handle.top,
                                width: handleSize + 8,
                                height: handleSize + 8,
                                cursor: handle.cursor,
                                touchAction: 'none',
                            }}
                            onMouseDown={handleHandleMouseDown(handle.name)}
                            onTouchStart={handleHandleTouchStart(handle.name)}
                        >
                            <div className="w-2.5 h-2.5 bg-emerald-400 border border-zinc-900 rounded-sm pointer-events-none shadow" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}