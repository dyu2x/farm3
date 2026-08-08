import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2, X } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface AboutSlideshowProps {
  images: string[];
  title?: string;
}

export const AboutSlideshow: React.FC<AboutSlideshowProps> = ({ images, title = "Mesina Farms Hatchery" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const safeImages = images && images.length > 0 ? images : ['https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg'];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % safeImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + safeImages.length) % safeImages.length);
  };

  useEffect(() => {
    if (isPlaying && !isHovered && safeImages.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, safeImages.length, currentIndex]);

  return (
    <>
      <div
        className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border/50 group bg-card/60"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Active Image */}
        <div className="relative w-full h-full">
          <ImageWithFallback
            src={safeImages[currentIndex]}
            alt={`${title} photo ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
            fittingType="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Top Badges & Fullscreen Button */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/10">
            Hatchery Gallery • {currentIndex + 1} / {safeImages.length}
          </span>

          <div className="flex items-center gap-2">
            {safeImages.length > 1 && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10"
                title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10"
              title="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prev & Next Arrow Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-all border border-white/10 opacity-80 sm:opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-all border border-white/10 opacity-80 sm:opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Dot Navigation & Thumbnails */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center gap-2 z-10">
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              {safeImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-primary shadow-lg shadow-primary/50'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl animate-fade-in">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={safeImages[currentIndex]}
              alt={`${title} photo ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-primary transition-all border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-primary transition-all border border-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
