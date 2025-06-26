import React, { useState, useRef, useEffect, useCallback } from "react";
import type { CarouselImage } from "../utils/imageApi";
import { fetchImages } from "../utils/imageApi";

interface GroupCarouselProps {
  initialImages: CarouselImage[];
}

const GroupCarousel: React.FC<GroupCarouselProps> = ({ initialImages }) => {
  const [allImages, setAllImages] = useState<CarouselImage[]>(initialImages);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, startIndex: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        // Reset to first group when switching between mobile/desktop
        setCurrentGroupIndex(0);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  // Configuration based on screen size
  const imagesPerGroup = isMobile ? 2 : 4; // Mobile: 2 images, Desktop: 4 images
  const totalGroups = Math.ceil(allImages.length / imagesPerGroup);

  // Get current images to display (exactly the right amount)
  const getCurrentImages = () => {
    const startIndex = currentGroupIndex * imagesPerGroup;
    const endIndex = startIndex + imagesPerGroup;
    return allImages.slice(startIndex, endIndex);
  };

  // Load more images when approaching the end
  const loadMoreImages = useCallback(async () => {
    if (isLoading) return;

    // Load more when we're at the last 2 groups
    const shouldLoad = currentGroupIndex >= totalGroups - 2;

    if (shouldLoad) {
      setIsLoading(true);
      try {
        const nextPage = currentPage + 1;
        const result = await fetchImages("casino", 50, nextPage);

        if (result.images.length > 0) {
          setAllImages((prev) => [...prev, ...result.images]);
          setCurrentPage(nextPage);
        }
      } catch (error) {
        console.error("Failed to load more images:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentGroupIndex, totalGroups, currentPage, isLoading]);

  // Move to specific group
  const moveToGroup = useCallback(
    (newGroupIndex: number) => {
      if (isMoving) return;

      setIsMoving(true);

      // Handle infinite loop - wrap around
      let targetIndex = newGroupIndex;
      if (newGroupIndex < 0) {
        targetIndex = totalGroups - 1;
      } else if (newGroupIndex >= totalGroups) {
        targetIndex = 0;
      }

      setCurrentGroupIndex(targetIndex);

      // Load more images if needed
      loadMoreImages();

      // Reset moving state after animation
      setTimeout(() => setIsMoving(false), 300);
    },
    [isMoving, totalGroups, loadMoreImages]
  );

  // Navigation functions
  const moveNext = useCallback(() => {
    moveToGroup(currentGroupIndex + 1);
  }, [currentGroupIndex, moveToGroup]);

  const movePrev = useCallback(() => {
    moveToGroup(currentGroupIndex - 1);
  }, [currentGroupIndex, moveToGroup]);

  // Mouse wheel and touchpad handling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!carouselRef.current?.contains(e.target as Node)) return;

      e.preventDefault();

      if (isMoving) return;

      // Handle horizontal scrolling (touchpad two-finger swipe)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal swipe detected
        if (e.deltaX > 0) {
          moveNext(); // Swipe left = next group
        } else if (e.deltaX < 0) {
          movePrev(); // Swipe right = previous group
        }
      } else {
        // Vertical scrolling (mouse wheel or touchpad vertical scroll)
        if (e.deltaY > 0) {
          moveNext(); // Scroll down = next group
        } else if (e.deltaY < 0) {
          movePrev(); // Scroll up = previous group
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [moveNext, movePrev, isMoving]);

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      startIndex: currentGroupIndex,
    });
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();

      const deltaX = e.clientX - dragStart.x;
      const threshold = 100; // Pixels needed to trigger move

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          movePrev(); // Drag right = previous
        } else {
          moveNext(); // Drag left = next
        }
        setIsDragging(false);
      }
    },
    [isDragging, dragStart.x, moveNext, movePrev]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX,
      startIndex: currentGroupIndex,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - dragStart.x;
    const threshold = 50; // Lower threshold for touch

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        movePrev();
      } else {
        moveNext();
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Update images when prop changes
  useEffect(() => {
    setAllImages(initialImages);
  }, [initialImages]);

  if (allImages.length === 0) {
    return <div className="text-white text-center">No images to display</div>;
  }

  const currentImages = getCurrentImages();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div
        ref={carouselRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className={`grid ${
            isMobile ? "grid-cols-2" : "grid-cols-4"
          } gap-4 transition-all duration-300 ease-out ${
            isMoving ? "opacity-75 scale-95" : "opacity-100 scale-100"
          }`}
          style={{
            gridTemplateColumns: isMobile
              ? `repeat(2, minmax(0, 1fr))`
              : `repeat(4, minmax(0, 1fr))`,
          }}
        >
          {currentImages.map((image, index) => (
            <div
              key={`${image.id}-${currentGroupIndex}-${index}`}
              className="flex flex-col items-center"
            >
              <img
                src={image.src}
                alt={`Photo by ${image.author}`}
                className="w-full h-48 object-cover rounded-lg shadow-xl border border-gray-600 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                loading="lazy"
                draggable={false}
              />
              <p className="text-white text-sm mt-2 text-center">
                by {image.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Status and indicators */}
      <div className="mt-6 space-y-4">
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: Math.min(totalGroups, 10) }).map((_, index) => (
            <button
              key={index}
              onClick={() => moveToGroup(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 border-2 ${
                index === currentGroupIndex % Math.min(totalGroups, 10)
                  ? "bg-white border-white scale-125"
                  : "bg-transparent border-white/50 hover:border-white/75"
              }`}
              aria-label={`Go to group ${index + 1}`}
            />
          ))}
          {totalGroups > 10 && (
            <span className="text-white/50 text-xs">...</span>
          )}
        </div>

        {/* Status info */}
        <div className="text-center text-white/60 text-sm">
          <p>
            Group {currentGroupIndex + 1} of {totalGroups} • Images{" "}
            {currentGroupIndex * imagesPerGroup + 1}-
            {Math.min(
              (currentGroupIndex + 1) * imagesPerGroup,
              allImages.length
            )}{" "}
            of {allImages.length}
            {isLoading && " • Loading more..."}
          </p>
          <p className="text-xs mt-1">
            Use mouse wheel, touchpad swipe, or drag to navigate •{" "}
            {imagesPerGroup} images per group
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupCarousel;
