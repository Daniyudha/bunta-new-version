'use client';

import { useEffect } from 'react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function Lightbox({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
  type,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false
}: LightboxProps) {
  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const getEmbedUrl = (url: string): string => {
    const youtubeId = extractYoutubeId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    }
    return url;
  };

  // Determine if it's a YouTube Short (9:16 aspect ratio)
  const isYouTubeShort = (url: string): boolean => {
    const youtubeId = extractYoutubeId(url);
    // For now, we'll assume all videos are regular videos unless we have a way to detect shorts
    // You can enhance this by checking video metadata or adding a prop
    return false;
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        onPrev();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Close Button - Top Right */}
      <button
        className="absolute top-6 right-6 text-white text-3xl cursor-pointer z-10 rounded-full p-3 hover:text-gray-400 transition-colors"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Navigation Buttons - Left and Right */}
      {onNext && onPrev && (
        <>
          {hasPrev && (
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer z-10 rounded-full p-3 hover:text-gray-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
            >
              {/* ChevronLeft icon - using SVG similar to example */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {hasNext && (
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer z-10 rounded-full p-3 hover:text-gray-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
            >
              {/* ChevronRight icon - using SVG similar to example */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Main Content Container - Centered and sized to media */}
      <div
        className="flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Area - Sized based on content */}
        <div className="bg-black/50 rounded-t-lg overflow-hidden flex justify-center">
          {type === 'image' ? (
            imageUrl ? (
              // Image Content - Natural aspect ratio
              <img
                src={imageUrl}
                alt={title}
                className="max-h-[75vh] w-auto object-contain"
              />
            ) : (
              <span className="text-gray-500 p-8">No Image</span>
            )
          ) : (
            // Video Content - Sized based on type
            imageUrl ? (
              <div className={
                isYouTubeShort(imageUrl) 
                  ? 'w-[40vw] max-w-[400px] aspect-[9/16]'
                  : 'w-[80vw] max-w-[1200px] aspect-video'
              }>
                <iframe
                  src={getEmbedUrl(imageUrl)}
                  title={title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={(e) => {
                    console.error('Failed to load video:', imageUrl);
                    const iframe = e.currentTarget as HTMLIFrameElement;
                    iframe.style.display = 'none';
                    // Show error message
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'flex items-center justify-center h-full text-red-500';
                    errorDiv.innerHTML = 'Failed to load video';
                    iframe.parentNode?.appendChild(errorDiv);
                  }}
                />
              </div>
            ) : (
              <span className="text-gray-500 p-8">No Video URL</span>
            )
          )}
        </div>

        {/* Caption Area - Matches media width exactly */}
        <div className="bg-white p-4 rounded-b-lg w-full">
          <div className="text-center">
            <h3 className="text-xl font-bold text-black break-words mb-2">{title}</h3>
            <p className="text-sm text-gray-600 break-words">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}