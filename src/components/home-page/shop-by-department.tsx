import { useNavigate } from "react-router-dom";
import products from "../../data/products.json";


const DEPARTMENTS = [
  {
    num: "01",
    name: "Fashion",
    sub: "Clothing, Footwear & Accessories.",
    params: "category=Fashion",
    image: "https://media.istockphoto.com/id/2157081744/photo/modern-built-in-wardrobe-closet-with-personal-accessories.webp?a=1&b=1&s=612x612&w=0&k=20&c=t-vdtlpGeYlI8T1rc9DXzjUUnOpEYdDAkVlsECXSnWs="
  },
  {
    num: "02",
    name: "Beauty",
    sub: "Skincare, makeup .",
    params: "category=Beauty",
    image: "https://plus.unsplash.com/premium_photo-1683120952553-af3ec9cd60c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJlYXV0eXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    num: "03",
    name: "Home & Living",
    sub: "Decor, lighting.",
    params: "category=Home+%26+Living",
    image: "https://plus.unsplash.com/premium_photo-1661963157936-513b550b8c79?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEhvbWUlMjAlMjYlMjBMaXZpbmd8ZW58MHx8MHx8fDA%3D"
  },
];

const gradient =
  "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 40%, transparent 70%)";

const ShopByDepartment = () => {
  const navigate = useNavigate();

  const countFor = (params: string) => {
    const sp = new URLSearchParams(params);
    const cat = sp.get("category");
    const sub = sp.get("sub");
    return products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (sub && p.subcategory !== sub) return false;
      return true;
    }).length;
  };

  return (
    <section className="px-3 sm:pl-6 py-8">

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

      {/* ── Desktop Bento Grid ── */}
      <div className="hidden sm:grid grid-cols-2 gap-1.5" style={{ height: "720px" }}>

        {/* Left — large card */}
        <DeptCard
          dept={DEPARTMENTS[0]}
          count={countFor(DEPARTMENTS[0].params)}
          size="large"
          onNavigate={() => navigate(`/products?${DEPARTMENTS[0].params}`)}
        />

        {/* Right — two stacked cards */}
        <div className="grid grid-rows-2 gap-1.5 h-full">
          <DeptCard
            dept={DEPARTMENTS[1]}
            count={countFor(DEPARTMENTS[1].params)}
            size="small"
            onNavigate={() => navigate(`/products?${DEPARTMENTS[1].params}`)}
          />
          <DeptCard
            dept={DEPARTMENTS[2]}
            count={countFor(DEPARTMENTS[2].params)}
            size="small"
            onNavigate={() => navigate(`/products?${DEPARTMENTS[2].params}`)}
          />
        </div>
      </div>

      {/* ── Mobile: stacked ── */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {DEPARTMENTS.map((dept) => (
          <DeptCard
            key={dept.name}
            dept={dept}
            count={countFor(dept.params)}
            size="mobile"
            onNavigate={() => navigate(`/products?${dept.params}`)}
          />
        ))}
        <button
          onClick={() => navigate("/products")}
          className="mt-2 self-center inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400"
        >
          Everything ({products.length} pieces)
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default ShopByDepartment;

/* ── Card Component ── */

type DeptItem = (typeof DEPARTMENTS)[number];

function DeptCard({
  dept,
  // count,
  size,
  onNavigate,
}: {
  dept: DeptItem;
  count: number;
  size: "large" | "small" | "mobile";
  onNavigate: () => void;
}) {
  const isLarge = size === "large";
  const isMobile = size === "mobile";

  return (
    <div
      onClick={onNavigate}
      className="relative overflow-hidden cursor-pointer group rounded-sm w-full h-full"
      style={isMobile ? { height: "260px" } : undefined}
    >

      {/* Image */}
      <img
        src={dept.image}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: gradient }} />

      {/* N° badge */}
      <span className="absolute top-4 right-4 text-[10px] tracking-[0.2em] font-mono text-white/50">
        N°{dept.num}
      </span>

      {/* Bottom content */}
      <div className={`absolute bottom-0 left-0 right-0 flex items-end justify-between ${isLarge ? "p-6 sm:p-8" : "p-4 sm:p-5"}`}>
        <div>
          <p className="text-[10px] tracking-[0.14em] uppercase text-white/65 mb-0.5">
            {dept.name}
          </p>
          <h3
            className="text-white font-basic leading-tight text-[1.4rem]"
          >
            {dept.sub}
          </h3>
        </div>


        {/* Arrow button */}
        <div
          className={`shrink-0 border border-white/30 flex items-center justify-center text-white/70
            group-hover:bg-white group-hover:text-gray-900 group-hover:border-white
            transition-all duration-300
            ${isLarge ? "w-10 h-10" : "w-8 h-8"}`}
        >
          <svg
            className={isLarge ? "w-4 h-4" : "w-3 h-3"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
