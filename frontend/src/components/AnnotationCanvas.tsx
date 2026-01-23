import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Circle, Group } from 'react-konva';
import { DEFAULT_ROI_PERCENTAGE, MIN_ROI_SIZE_PX } from '../utils/constants';
import type { ROI } from '../types/api';

interface AnnotationCanvasProps {
    image: HTMLImageElement;
    onROIChange: (roi: ROI) => void;
}

export default function AnnotationCanvas({ image, onROIChange }: AnnotationCanvasProps) {
    const [roi, setROI] = useState<ROI>({ x: 0, y: 0, width: 0, height: 0 });
    const [zoom, setZoom] = useState(1);
    const stageRef = useRef<any>(null);

    // Calculate canvas dimensions to fit nicely on screen with max height limit
    const maxWidth = Math.min(window.innerWidth - 100, 700);
    const maxHeight = Math.min(window.innerHeight - 300, 500);

    // Calculate scale to fit both width and height constraints
    const scaleToFitWidth = maxWidth / image.width;
    const scaleToFitHeight = maxHeight / image.height;
    const baseScale = Math.min(scaleToFitWidth, scaleToFitHeight, 1); // Never scale up

    const scale = baseScale * zoom;
    const canvasWidth = image.width * scale;
    const canvasHeight = image.height * scale;

    // Initialize ROI in the center
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

    const constrainROI = (newROI: ROI): ROI => {
        return {
            x: Math.max(0, Math.min(newROI.x, image.width - newROI.width)),
            y: Math.max(0, Math.min(newROI.y, image.height - newROI.height)),
            width: Math.max(MIN_ROI_SIZE_PX, Math.min(newROI.width, image.width - newROI.x)),
            height: Math.max(MIN_ROI_SIZE_PX, Math.min(newROI.height, image.height - newROI.y)),
        };
    };

    const handleDragMove = (e: any) => {
        const newROI = {
            ...roi,
            x: e.target.x(),
            y: e.target.y(),
        };
        setROI(constrainROI(newROI));
    };

    const handleResize = (e: any, handle: string) => {
        const stage = e.target.getStage();
        const pointerPos = stage.getPointerPosition();

        // Convert pointer position back to image coordinates
        const imageX = pointerPos.x / scale;
        const imageY = pointerPos.y / scale;

        let newROI = { ...roi };

        switch (handle) {
            case 'top-left':
                newROI = {
                    x: imageX,
                    y: imageY,
                    width: roi.x + roi.width - imageX,
                    height: roi.y + roi.height - imageY,
                };
                break;
            case 'top-right':
                newROI = {
                    ...roi,
                    y: imageY,
                    width: imageX - roi.x,
                    height: roi.y + roi.height - imageY,
                };
                break;
            case 'bottom-left':
                newROI = {
                    x: imageX,
                    y: roi.y,
                    width: roi.x + roi.width - imageX,
                    height: imageY - roi.y,
                };
                break;
            case 'bottom-right':
                newROI = {
                    ...roi,
                    width: imageX - roi.x,
                    height: imageY - roi.y,
                };
                break;
        }

        setROI(constrainROI(newROI));
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 2)); // Max 2x zoom
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 0.5)); // Min 0.5x zoom
    };

    const handleZoomReset = () => {
        setZoom(1);
    };

    const handleSize = 10; // Reduced handle size

    return (
        <div className="space-y-4">
            {/* Zoom Controls */}
            <div className="flex justify-center gap-3">
                <button
                    onClick={handleZoomOut}
                    className="px-4 py-2 glass glass-hover rounded-lg text-sm font-medium"
                    title="Zoom Out"
                >
                    🔍−
                </button>
                <button
                    onClick={handleZoomReset}
                    className="px-4 py-2 glass glass-hover rounded-lg text-sm font-medium"
                    title="Reset Zoom"
                >
                    {Math.round(zoom * 100)}%
                </button>
                <button
                    onClick={handleZoomIn}
                    className="px-4 py-2 glass glass-hover rounded-lg text-sm font-medium"
                    title="Zoom In"
                >
                    🔍+
                </button>
            </div>

            {/* Canvas Container */}
            <div className="flex justify-center">
                <div className="relative inline-block">
                    <Stage
                        ref={stageRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        scaleX={scale}
                        scaleY={scale}
                        className="rounded-lg overflow-hidden shadow-2xl"
                    >
                        <Layer>
                            {/* Background Image */}
                            <KonvaImage image={image} />

                            {/* Dark overlay outside ROI */}
                            <Rect
                                x={0}
                                y={0}
                                width={image.width}
                                height={roi.y}
                                fill="rgba(0, 0, 0, 0.6)"
                            />
                            <Rect
                                x={0}
                                y={roi.y + roi.height}
                                width={image.width}
                                height={image.height - (roi.y + roi.height)}
                                fill="rgba(0, 0, 0, 0.6)"
                            />
                            <Rect
                                x={0}
                                y={roi.y}
                                width={roi.x}
                                height={roi.height}
                                fill="rgba(0, 0, 0, 0.6)"
                            />
                            <Rect
                                x={roi.x + roi.width}
                                y={roi.y}
                                width={image.width - (roi.x + roi.width)}
                                height={roi.height}
                                fill="rgba(0, 0, 0, 0.6)"
                            />

                            {/* ROI Rectangle Group */}
                            <Group
                                x={roi.x}
                                y={roi.y}
                                draggable
                                onDragMove={handleDragMove}
                                dragBoundFunc={(pos) => {
                                    // Ensure the box stays within image bounds
                                    return {
                                        x: Math.max(0, Math.min(pos.x, image.width - roi.width)),
                                        y: Math.max(0, Math.min(pos.y, image.height - roi.height)),
                                    };
                                }}
                            >
                                {/* ROI Border */}
                                <Rect
                                    width={roi.width}
                                    height={roi.height}
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    listening={false}
                                />

                                {/* Only 4 corner resize handles */}
                                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((handle) => {
                                    const x = handle.includes('right') ? roi.width : 0;
                                    const y = handle.includes('bottom') ? roi.height : 0;

                                    return (
                                        <Circle
                                            key={handle}
                                            x={x}
                                            y={y}
                                            radius={handleSize}
                                            fill="#10B981"
                                            stroke="#fff"
                                            strokeWidth={2}
                                            draggable
                                            onDragMove={(e) => handleResize(e, handle)}
                                            onMouseEnter={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) {
                                                    container.style.cursor = 'nwse-resize';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) {
                                                    container.style.cursor = 'move';
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </Group>
                        </Layer>
                    </Stage>
                </div>
            </div>
        </div>
    );
}
