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
  // rating,
  // ratingCount,
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

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [lightboxIdx]);

  // Keyboard navigation
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
      <div className="bg-[#f5f5f5] w-full">
        {/* ── Mobile: single image + thumbnail strip ── */}
        <div className="block md:hidden">
          <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden cursor-zoom-in">
            <img
              src={getSrc(validImages[activeMobileIdx], activeMobileIdx)}
              alt={`${productName} — ${color} view ${activeMobileIdx + 1}`}
              onError={() => handleImageError(activeMobileIdx)}
              className="w-full h-full object-contain transition-all duration-300"
              onClick={() => openLightbox(activeMobileIdx)}
            />
            {validImages.length > 1 && (
              <span className="absolute top-3 right-3 rounded-full bg-black/50 text-white text-[11px] px-2.5 py-0.5 pointer-events-none">
                {activeMobileIdx + 1} / {validImages.length}
              </span>
            )}
          </div>
          {validImages.length > 1 && (
            <div className="flex items-center gap-2 p-2 overflow-x-auto bg-white border-b border-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {validImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMobileIdx(i)}
                  className={`w-14 h-16 shrink-0 rounded border overflow-hidden transition-all ${activeMobileIdx === i ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                >
                  <img src={getSrc(src, i)} alt={`Thumbnail ${i + 1}`} onError={() => handleImageError(i)} className="w-full h-full object-contain bg-[#f5f5f5]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop: 2-column image grid ── */}
        <div className={`hidden md:grid gap-[2px] ${validImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {validImages.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-[#f5f5f5] cursor-zoom-in aspect-[2/3]"
              role="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => openLightbox(i)}
            >
              <img
                src={getSrc(src, i)}
                alt={`${productName} — ${color} view ${i + 1}`}
                loading={i < 2 ? 'eager' : 'lazy'}
                onError={() => handleImageError(i)}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[9999] select-none flex flex-col"
          style={{ backgroundColor: '#e5e5e5' }}
          role="dialog"
          aria-modal="true"
        >
          {/* Close — top right */}
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-900 shadow-md transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ── DESKTOP (md+): left thumb strip + centered image ── */}
          <div className="hidden md:flex w-full h-full">
            {/* Left vertical thumbnail strip */}
            {validImages.length > 1 && (
              <div className="flex flex-col gap-2 justify-center pl-5 pr-3 overflow-y-auto max-h-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
                {validImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`w-[52px] h-[66px] shrink-0 overflow-hidden rounded transition-all border-2 ${
                      lightboxIdx === idx
                        ? 'border-gray-900 opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-75'
                    }`}
                  >
                    <img
                      src={getSrc(src, idx)}
                      alt={`Thumb ${idx + 1}`}
                      onError={() => handleImageError(idx)}
                      className="w-full h-full object-contain bg-white"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image + prev/next */}
            <div className="flex-1 flex items-center justify-center relative">
              {validImages.length > 1 && (
                <button
                  onClick={prevImage}
                  aria-label="Previous"
                  className="absolute left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-900 shadow-md transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <img
                key={lightboxIdx}
                src={getSrc(validImages[lightboxIdx], lightboxIdx)}
                alt={`${productName} — view ${lightboxIdx + 1}`}
                className="max-w-[65vw] max-h-[90vh] object-contain"
              />
              {validImages.length > 1 && (
                <button
                  onClick={nextImage}
                  aria-label="Next"
                  className="absolute right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-900 shadow-md transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── MOBILE (< md): full image + bottom horizontal thumbnails ── */}
          <div className="flex md:hidden flex-col w-full h-full">
            {/* Main image — fills available space */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden px-10">
              {validImages.length > 1 && (
                <button
                  onClick={prevImage}
                  aria-label="Previous"
                  className="absolute left-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 shadow-md"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <img
                key={lightboxIdx}
                src={getSrc(validImages[lightboxIdx], lightboxIdx)}
                alt={`${productName} — view ${lightboxIdx + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              {validImages.length > 1 && (
                <button
                  onClick={nextImage}
                  aria-label="Next"
                  className="absolute right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 shadow-md"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Bottom horizontal thumbnail strip */}
            {validImages.length > 1 && (
              <div className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {validImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`w-12 h-16 shrink-0 overflow-hidden rounded transition-all border-2 ${
                      lightboxIdx === idx
                        ? 'border-gray-900 opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-75'
                    }`}
                  >
                    <img
                      src={getSrc(src, idx)}
                      alt={`Thumb ${idx + 1}`}
                      onError={() => handleImageError(idx)}
                      className="w-full h-full object-contain bg-white"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
