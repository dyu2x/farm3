import React, { useState } from 'react';
import { Fish } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fittingType?: 'cover' | 'contain' | 'fill';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fittingType = 'cover'
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackPlaceholder = "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1000";

  const fitClass = fittingType === 'cover' ? 'object-cover' : fittingType === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div className={`relative overflow-hidden bg-muted/40 ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse flex items-center justify-center">
          <Fish className="w-8 h-8 text-muted-foreground/30 animate-spin" />
        </div>
      )}
      <img
        src={error || !src ? fallbackPlaceholder : src}
        alt={alt}
        className={`w-full h-full ${fitClass} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
