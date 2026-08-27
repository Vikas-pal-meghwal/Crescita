import { useNavigate } from "react-router-dom";

const COLLECTIONS = [
  {
    label: "Footwear",
    sub: "Step into style",
    cta: "View all footwear",
    params: "category=Fashion&sub=Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85&crop=center",
  },
  {
    label: "Bags",
    sub: "Carry it with confidence",
    cta: "View all bags",
    params: "category=Fashion&sub=Accessories",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=85&crop=center",
  },
  {
    label: "Headwear",
    sub: "Top it off",
    cta: "View all headwear",
    params: "category=Fashion&sub=Accessories",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=85&crop=center",
  },
  {
    label: "Sunglasses",
    sub: "See the world differently",
    cta: "View all sunglasses",
    params: "category=Fashion&sub=Accessories",
    image:
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1600&auto=format&fit=crop&q=85&crop=center",
  },
] as const;

/* richer gradient — deeper at the bottom, fades to nothing at top */
const overlay =
  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.06) 62%, transparent 100%)";

const RecommendedCollections = () => {
  const navigate = useNavigate();
  const go = (params: string) => navigate(`/products?${params}`);

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-20 bg-[#fafaf9]">

      {/* ── Section header ── */}
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-[9px] tracking-[0.28em] uppercase text-gray-400 mb-3">
          Crescita Picks
        </p>
        <h2
          className="text-[1.8rem] sm:text-[2.6rem] font-normal text-gray-900 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Most Recommended Collections
        </h2>
        <p className="mt-3 text-[13px] text-gray-400 max-w-[340px] mx-auto leading-relaxed">
          Expertly curated pieces crafted for style and everyday wear — timeless
          designs that elevate every look.
        </p>
      </div>

      {/* ═══════════════════════════════════
          DESKTOP — bento grid
      ═══════════════════════════════════ */}
      <div className="hidden sm:flex flex-col gap-2.5 max-w-screen-xl mx-auto">

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-2.5" style={{ height: "580px" }}>

          {/* Left — large tall card */}
          <Card
            item={COLLECTIONS[0]}
            onClick={() => go(COLLECTIONS[0].params)}
            className="h-full"
            size="lg"
          />

          {/* Right — two equal cards stacked */}
          <div className="grid grid-rows-2 gap-2.5 h-full">
            <Card
              item={COLLECTIONS[1]}
              onClick={() => go(COLLECTIONS[1].params)}
              className="h-full"
              size="sm"
            />
            <Card
              item={COLLECTIONS[2]}
              onClick={() => go(COLLECTIONS[2].params)}
              className="h-full"
              size="sm"
            />
          </div>
        </div>

        {/* Row 2 — full-width panoramic */}
        <Card
          item={COLLECTIONS[3]}
          onClick={() => go(COLLECTIONS[3].params)}
          className="w-full"
          style={{ height: "300px" }}
          size="wide"
        />
      </div>

      {/* ═══════════════════════════════════
          MOBILE — vertical stack
      ═══════════════════════════════════ */}
      <div className="sm:hidden flex flex-col gap-2.5">
        <Card item={COLLECTIONS[0]} onClick={() => go(COLLECTIONS[0].params)} style={{ height: "300px" }} size="sm" />
        <div className="grid grid-cols-2 gap-2.5">
          <Card item={COLLECTIONS[1]} onClick={() => go(COLLECTIONS[1].params)} style={{ height: "220px" }} size="xs" />
          <Card item={COLLECTIONS[2]} onClick={() => go(COLLECTIONS[2].params)} style={{ height: "220px" }} size="xs" />
        </div>
        <Card item={COLLECTIONS[3]} onClick={() => go(COLLECTIONS[3].params)} style={{ height: "200px" }} size="sm" />
      </div>

    </section>
  );
};

/* ══════════════════════════════════
   Card component
══════════════════════════════════ */
type CollectionItem = (typeof COLLECTIONS)[number];
type CardSize = "lg" | "sm" | "wide" | "xs";

function Card({
  item,
  onClick,
  className = "",
  style,
  size,
}: {
  item: CollectionItem;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  size: CardSize;
}) {
  const isLg   = size === "lg";
  const isWide = size === "wide";
  const isXs   = size === "xs";

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}
      style={style}
    >
      {/* ── Photo ── */}
      <img
        src={item.image}
        alt={item.label}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ background: overlay }} />

      {/* ── Subtle top edge vignette for the number badge ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent h-24 pointer-events-none" />

      {/* ── Bottom content ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex items-end justify-between
          ${isLg ? "p-6 sm:p-7" : isWide ? "px-7 pb-6" : isXs ? "p-3.5" : "p-4 sm:p-5"}`}
      >
        {/* Text stack */}
        <div className="min-w-0 mr-3">
          {!isXs && (
            <p className={`text-white/60 mb-0.5 tracking-[0.12em] uppercase
              ${isLg ? "text-[10px]" : "text-[9px]"}`}>
              {item.sub}
            </p>
          )}
          <h3
            className={`text-white font-normal leading-tight
              ${isLg ? "text-[1.5rem]" : isWide ? "text-[1.3rem]" : isXs ? "text-[1rem]" : "text-[1.1rem]"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.label}
          </h3>
        </div>

        {/* Pill CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`
            shrink-0 inline-flex items-center gap-1.5 bg-white/95 text-gray-900 font-medium
            rounded-full shadow-md whitespace-nowrap
            hover:bg-gray-900 hover:text-white
            transition-all duration-300
            ${isLg ? "text-[11px] px-4 py-2" : isXs ? "text-[9px] px-2.5 py-1.5" : "text-[10px] px-3 py-1.5"}
          `}
        >
          {isXs ? "View all" : item.cta}
          {/* diagonal arrow */}
          <svg
            className={isLg ? "w-3 h-3" : "w-2.5 h-2.5"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RecommendedCollections;
