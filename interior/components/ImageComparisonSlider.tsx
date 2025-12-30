import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ImageComparisonSliderProps {
    before: string;
    after: string;
}

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({ before, after }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    }, []);
    
    const changePosition = useCallback((newPosition: number) => {
        setSliderPosition(Math.max(0, Math.min(100, newPosition)));
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            changePosition(sliderPosition - 2); // Move 2% per key press
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            changePosition(sliderPosition + 2);
        } else if (e.key === 'Home') {
            e.preventDefault();
            changePosition(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            changePosition(100);
        }
    }, [sliderPosition, changePosition]);


    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        containerRef.current?.focus();
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
        containerRef.current?.focus();
    };

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current) return;
        handleMove(e.clientX);
    }, [handleMove]);
    
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging.current) return;
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    useEffect(() => {
        // Using window to catch mouse movements even outside the component
        const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
        const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e);

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('touchmove', handleGlobalTouchMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp, handleTouchMove]);

    return (
        <div 
            ref={containerRef} 
            className="relative w-full aspect-video rounded-lg overflow-hidden select-none cursor-ew-resize group focus:outline-none focus:ring-2 focus:ring-viniela-gold"
            role="slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Image comparison slider. Use left and right arrow keys to adjust."
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
            <div
                className="absolute inset-0 w-full h-full object-cover"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                aria-hidden="true"
            >
                <img src={before} alt="Before" className="w-full h-full object-cover" />
            </div>
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                aria-hidden="true"
            >
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white/80 shadow-md grid place-items-center transition-transform group-hover:scale-110"
                >
                    <ChevronsLeftRight className="w-6 h-6 text-viniela-brown" />
                </div>
            </div>
        </div>
    );
};

export default ImageComparisonSlider;