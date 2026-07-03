import { useState } from "react";
import type { MouseEvent } from "react";
import { Heart } from "lucide-react";

interface ProductCardProps {
  name?: string;
  price?: number;
  currency?: string;
  images?: string[];
  onDoubleClick?: () => void;
}
export default function ProductCard({
  name = "",
  price = 0,
  currency = "₹",
  images = [],
  onDoubleClick,
}: ProductCardProps) {
  const [index, setIndex] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  const prev = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  const toggleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLiked((l) => !l);
  };

  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={onDoubleClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded cursor-pointer">
        <img
          src={images[index]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out text-[14px] text-gray-400 text-center"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />

        {/* Wishlist */}
        <button
          onClick={toggleLike}
          aria-label="Add to wishlist"
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-sm bg-white/85 flex items-center justify-center transition-opacity"
          style={{ opacity: hovered || liked ? 1 : 0 }}
        >
          <Heart
            size={14}
            stroke={liked ? "none" : "#333"}
            fill={liked ? "#c0392b" : "none"}
          />
        </button>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-1 hidden sm:block top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center transition-opacity"
              style={{ opacity: hovered ? 1 : 0, mixBlendMode: "difference" }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute -right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hidden sm:block transition-opacity"
              style={{ opacity: hovered ? 1 : 0, mixBlendMode: "difference" }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute  bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full transition-all duration-200"
                style={{
                  background: i === index ? "#fff" : "rgba(255,255,255,0.5)",
                  transform: i === index ? "scale(1.25)" : "scale(1)",
                  filter: "drop-shadow(0 0 1px rgba(0,0,0,0.8))",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-2 px-0.5">
        <p className="text-[13px] text-stone-700 leading-snug">{name}</p>
        <p className="text-[13px] text-stone-900 font-medium mt-1">
          {currency} {price.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
