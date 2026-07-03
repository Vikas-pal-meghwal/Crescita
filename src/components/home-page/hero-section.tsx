import { useNavigate } from "react-router-dom";

const SLIDES = [
  {
    label: "New Season",
    heading: "Wear What\nMoves You",
    sub: "Explore the latest in Fashion, Beauty & Home",
    cta: "Shop Now",
    ctaLink: "/products",
    align: "center" as const,
    bg: "linear-gradient(135deg, #1c1917 0%, #292524 60%, #3b2a1a 100%)",
    accent: "#d4a96a",
  },
  {
    label: "Beauty Edit",
    heading: "Glow From\nWithin",
    sub: "Skincare, Makeup & Fragrance — curated for you",
    cta: "Shop Beauty",
    ctaLink: "/products?category=Beauty",
    align: "left" as const,
    bg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
    accent: "#be185d",
  },
  {
    label: "Home & Living",
    heading: "Style Your\nSpace",
    sub: "Bring warmth and elegance to every corner",
    cta: "Explore Home",
    ctaLink: "/products?category=Home+%26+Living",
    align: "right" as const,
    bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
    accent: "#15803d",
  },
];

import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActive((i) => (i + 1) % SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number) => {
    if (i === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(i);
      setAnimating(false);
    }, 200);
  };

  const slide = SLIDES[active];
  const isLight = active !== 0;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 52px)", minHeight: "480px", maxHeight: "800px" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: slide.bg }}
      />

      {/* Decorative circle */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-700"
        style={{
          width: "55vw",
          height: "55vw",
          maxWidth: "640px",
          maxHeight: "640px",
          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
          right: slide.align === "left" ? "-10%" : "auto",
          left: slide.align === "right" ? "-10%" : "auto",
          top: "50%",
          transform: "translateY(-50%)",
          border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
        }}
      />

      {/* Content */}
      <div
        className={`absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 transition-opacity duration-300 ${
          animating ? "opacity-0" : "opacity-100"
        } ${
          slide.align === "center"
            ? "items-center text-center"
            : slide.align === "right"
            ? "items-end text-right"
            : "items-start text-left"
        }`}
      >
        {/* Label pill */}
        <span
          className="inline-block text-[10px] tracking-[0.22em] uppercase px-3 py-1 rounded-full mb-5 border"
          style={{
            color: isLight ? slide.accent : "#d4a96a",
            borderColor: isLight ? slide.accent + "55" : "rgba(212,169,106,0.4)",
            background: isLight ? slide.accent + "15" : "rgba(212,169,106,0.1)",
          }}
        >
          {slide.label}
        </span>

        {/* Heading */}
        <h1
          className="font-serif font-normal leading-[1.08] tracking-tight mb-5"
          style={{
            fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
            color: isLight ? "#111827" : "#fafaf9",
            whiteSpace: "pre-line",
          }}
        >
          {slide.heading}
        </h1>

        {/* Sub */}
        <p
          className="text-[13px] sm:text-[14px] leading-relaxed mb-8 max-w-xs"
          style={{ color: isLight ? "#4b5563" : "rgba(250,250,249,0.65)" }}
        >
          {slide.sub}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate(slide.ctaLink)}
          className="inline-flex items-center gap-2.5 px-7 py-3 text-[11px] tracking-[0.14em] uppercase font-medium transition-all hover:gap-4"
          style={{
            background: isLight ? slide.accent : "#fafaf9",
            color: isLight ? "#fff" : "#1c1917",
          }}
        >
          {slide.cta}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === active ? "28px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: isLight
                ? i === active ? slide.accent : "rgba(0,0,0,0.2)"
                : i === active ? "#fafaf9" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div
        className="absolute bottom-8 right-8 text-[10px] tracking-[0.14em] font-mono"
        style={{ color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}
      >
        0{active + 1} / 0{SLIDES.length}
      </div>
    </section>
  );
};

export default HeroSection;
