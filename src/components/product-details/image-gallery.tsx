import React, { useState, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  color: string;
  rating: number;
  ratingCount: number;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80";

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  color,
  rating,
  ratingCount,
}) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const validImages = images && images.length > 0 ? images : [FALLBACK_IMAGE];

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const getSrc = (src: string, index: number) => {
    if (failedImages[index] || !src) return FALLBACK_IMAGE;
    return src;
  };

  const openLightbox = (index: number) => setLightboxIdx(index);
  const closeLightbox = () => setLightboxIdx(null);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIdx((i) => (i !== null ? (i - 1 + validImages.length) % validImages.length : null));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIdx((i) => (i !== null ? (i + 1) % validImages.length : null));
  };

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIdx]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i !== null ? (i + 1) % validImages.length : null));
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i !== null ? (i - 1 + validImages.length) % validImages.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, validImages.length]);

  return (
    <>
      <div className="bg-gray-100 w-full">
        {/* ── Mobile View (< md screen): Main image + thumbnail row ── */}
        <div className="block md:hidden">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] bg-gray-200 overflow-hidden cursor-zoom-in">
            <img
              src={getSrc(validImages[activeMobileIdx], activeMobileIdx)}
              alt={`${productName} — ${color} view ${activeMobileIdx + 1}`}
              onError={() => handleImageError(activeMobileIdx)}
              className="w-full h-full object-cover transition-all duration-300"
              onClick={() => openLightbox(activeMobileIdx)}
            />

            {/* Rating badge */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full py-1 px-3 text-xs flex items-center gap-1 shadow-sm pointer-events-none">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="font-medium text-gray-800">{rating}</span>
              <span className="text-gray-400">({ratingCount})</span>
            </div>

            {/* Image counter */}
            {validImages.length > 1 && (
              <span className="absolute top-3 right-3 rounded-full bg-black/60 text-white text-[11px] font-mono px-2.5 py-0.5 pointer-events-none">
                {activeMobileIdx + 1} / {validImages.length}
              </span>
            )}
          </div>

          {/* Horizontal thumbnail strip for mobile */}
          {validImages.length > 1 && (
            <div className="flex items-center gap-2 p-2 overflow-x-auto bg-white border-b border-gray-100 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {validImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMobileIdx(i)}
                  className={`relative w-14 h-16 shrink-0 rounded border overflow-hidden transition-all ${activeMobileIdx === i ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={getSrc(src, i)}
                    alt={`Thumbnail ${i + 1}`}
                    onError={() => handleImageError(i)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop View (>= md screen): Grid ── */}
        <div className="hidden md:grid grid-cols-2 gap-[2px]">
          {validImages.map((src, i) => {
            const isFullWidth =
              validImages.length === 1 ||
              validImages.length === 2 ||
              (validImages.length === 3 && i === 0);

            const imageSrc = getSrc(src, i);

            return (
              <div
                key={i}
                className={`
                  relative overflow-hidden bg-gray-200 cursor-zoom-in
                  ${isFullWidth ? 'col-span-2 aspect-[4/3]' : 'aspect-[4/3]'}
                `}
                role="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={imageSrc}
                  alt={`${productName} — ${color} view ${i + 1}`}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  onError={() => handleImageError(i)}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* First image: rating badge */}
                {i === 0 && (
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full py-1 px-3 text-xs flex items-center gap-1 pointer-events-none shadow-sm">
                    <span className="text-yellow-500 text-xs">★</span> {rating} ({ratingCount})
                  </div>
                )}

                {/* Image counter */}
                {validImages.length > 2 && (
                  <span className="absolute top-0 left-0 rounded-br bg-white/90 text-gray-700 text-[11px] tracking-wide font-mono px-2.5 py-1 pointer-events-none">
                    {i + 1} / {validImages.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Enhanced Lightbox Modal with Side Thumbnails ── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar Info & Close button */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded px-4 py-1.5 text-xs flex items-center gap-2 pointer-events-auto">
              <span className="font-medium">{productName}</span>
              <span className="text-gray-400">· {color}</span>
              <span className="text-yellow-400 text-mono">({lightboxIdx + 1} / {validImages.length})</span>
            </div>
            <button
              className="bg-black/60 backdrop-blur-md border border-white/20 text-white w-9 h-9 rounded text-base flex items-center justify-center hover:bg-white/20 transition pointer-events-auto shadow-lg"
              onClick={closeLightbox}
              aria-label="Close enlarged view"
            >
              ✕
            </button>
          </div>

          {/* Left Side / Bottom Thumbnails Strip */}
          {validImages.length > 1 && (
            <div className="order-2 md:order-1 flex md:flex-col gap-2.5 p-2 bg-black/50 backdrop-blur-md rounded border border-white/10 z-20 max-w-full md:max-w-none overflow-x-auto md:overflow-y-auto max-h-[15vh] md:max-h-[75vh] mt-4 md:mt-0 shrink-0 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {validImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIdx(idx)}
                  className={`relative w-12 h-16 md:w-16 md:h-20 shrink-0 rounded overflow-hidden transition-all border-2 ${lightboxIdx === idx
                    ? 'border-white scale-105 shadow-md shadow-white/20 ring-2 ring-white/50'
                    : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/50'
                    }`}
                  aria-label={`Switch to image ${idx + 1}`}
                >
                  <img
                    src={getSrc(src, idx)}
                    alt={`Thumbnail ${idx + 1}`}
                    onError={() => handleImageError(idx)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main enlarged image preview + Nav arrows */}
          <div className="order-1 md:order-2 flex-1 flex items-center justify-center relative w-full h-full max-h-[82vh] md:max-h-[88vh] px-2 md:px-8">
            {/* Prev Arrow */}
            {validImages.length > 1 && (
              <button
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-2 md:left-4 z-20 w-11 h-11 rounded bg-black/60 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <img
              src={getSrc(validImages[lightboxIdx], lightboxIdx)}
              alt={`${productName} — enlarged view ${lightboxIdx + 1}`}
              className="max-w-[85vw] md:max-w-[70vw] max-h-[78vh] md:max-h-[85vh] object-contain rounded shadow-2xl transition-all duration-300"
            />

            {/* Next Arrow */}
            {validImages.length > 1 && (
              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-2 md:right-4 z-20 w-11 h-11 rounded bg-black/60 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

