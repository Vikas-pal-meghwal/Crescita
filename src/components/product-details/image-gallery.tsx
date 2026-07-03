import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  color: string;
  rating: number;
  ratingCount: number;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  color,
  rating,
  ratingCount,
}) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const openLightbox = (src: string) => setLightboxSrc(src);
  const closeLightbox = () => setLightboxSrc(null);


  return (
    <>
      {/* Gallery column */}
      <div className="bg-gray-100">
        <div className="grid grid-cols-2 gap-[2px]">
          {images.map((src, i) => {
            const isFullWidth =
              images.length === 1 ||
              images.length === 2 ||
              (images.length === 3 && i === 0);

            return (
              <div
                key={i}
                className={`
                  relative overflow-hidden bg-gray-200 cursor-zoom-in
                  ${isFullWidth ? 'col-span-2 aspect-[4/3]' : '4/3'}
                `}
                role="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => openLightbox(src)}
              >
                <img
                  src={src}
                  alt={`${productName} — ${color} view ${i + 1}`}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* First image: premium badge + rating */}
                {i === 0 && (
                  <>
                    <div className="absolute bottom-2 left-2 bg-white/90 border border-gray-300 rounded-full py-0.5 px-2.5 text-xs flex items-center gap-1 pointer-events-none">
                      <span className="text-yellow-500 text-xs">★</span> {rating} ({ratingCount})
                    </div>
                  </>
                )}

                {/* Image counter for 3+ images */}
                {images.length > 2 && (
                  <span className="absolute top-0 left-0 rounded-br bg-white/85 text-gray-600 text-[10px] tracking-wide font-mono px-2 py-0.5  pointer-events-none">
                    {i + 1} / {images.length}
                  </span>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center cursor-zoom-out"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeLightbox();
          }}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={lightboxSrc}
            alt="Enlarged view"
            className="max-w-[92vw] max-h-[92vh] object-contain rounded-sm animate-[lbIn_0.22s_ease]"
          />
          <button
            className="absolute top-5 right-6 border border-white/30 text-white w-9 h-9 rounded-full text-base flex items-center justify-center hover:bg-white/10 transition"
            onClick={closeLightbox}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
