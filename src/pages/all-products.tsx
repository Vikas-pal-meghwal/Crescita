import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/product/productcard";
import { ProductCardSkeleton } from "../components/product-details/product-skeleton";
import { FilterPanel, type FilterState, DEFAULT_FILTERS } from "../components/filters";
import { fetchProducts } from "../services/api";

type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest Arrivals",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
};

const AllProducts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Read URL params on mount / when URL changes
  useEffect(() => {
    const category = searchParams.get("category");
    const sub = searchParams.get("sub");
    const sortParam = searchParams.get("sort") as SortOption | null;
    const q = searchParams.get("q");

    setFilters({
      ...DEFAULT_FILTERS,
      categories: category ? [category] : [],
      subcategories: sub ? [sub] : [],
    });

    if (sortParam && sortParam in SORT_LABELS) {
      setSort(sortParam);
    } else {
      setSort("newest");
    }

    setSearch(q ?? "");
  }, [searchParams]);

  // count active filters for badge
  const activeCount =
    filters.categories.length +
    filters.subcategories.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceMax < 5000 ? 1 : 0);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
  };

  const filtered = useMemo(() => {
    if (loading) return [];
    const q = search.trim().toLowerCase();

    let list = products.filter((p) => {
      // search
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q)
      )
        return false;

      // category
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(p.category)
      )
        return false;

      // subcategory
      if (
        filters.subcategories.length > 0 &&
        !filters.subcategories.includes(p.subcategory)
      )
        return false;

      // price — check first variant first size
      const price = p.variants[0].sizes[0].price;
      if (price > filters.priceMax) return false;

      // rating
      if (p.rating < filters.minRating) return false;

      return true;
    });

    if (sort === "price-asc") {
      list.sort(
        (a, b) =>
          a.variants[0].sizes[0].price - b.variants[0].sizes[0].price
      );
    } else if (sort === "price-desc") {
      list.sort(
        (a, b) =>
          b.variants[0].sizes[0].price - a.variants[0].sizes[0].price
      );
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [search, sort, filters, products]);

  return (
    <div className="pb-4 sm:pt-0 px-0 sm:px-0">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      {/* <div className="w-full py-10 sm:py-14 border-b border-stone-100 mb-0 text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400 mb-2">
          Explore the Collection
        </p>
        <h1 className="font-serif text-[2rem] sm:text-[2.8rem] font-normal text-stone-900 leading-none tracking-tight">
          All Products
        </h1>
        <div className="mt-3 mx-auto w-8 h-px bg-stone-300" />
        <p className="mt-3 text-[10px] text-stone-400 tracking-[0.2em] uppercase">
          {filtered.length} Items
        </p>
      </div> */}

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative w-full  h-[100px] sm:h-[220px] overflow-hidden mb-0 bg-white">

        {/* Premium Light Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fafc 35%, #eef4ff 70%, #ffffff 100%)",
          }}
        />

        {/* Visible Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        linear-gradient(rgba(148,163,184,0.10) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148,163,184,0.10) 1px, transparent 1px)
      `,
            backgroundSize: "48px 48px",
            opacity: 1,
          }}
        />

        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 0.6px, transparent 0.6px)",
            backgroundSize: "12px 12px",
          }}
        />

        {/* Left Glow */}
        <div
          className="absolute -left-28 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px]"
          style={{
            background: "rgba(99,102,241,0.1)",
          }}
        />

        {/* Right Glow */}
        <div
          className="absolute -right-24 bottom-0 w-80 h-80 rounded-full blur-[120px]"
          style={{
            background: "rgba(59,130,246,0.1)",
          }}
        />

        {/* Center Glow */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[450px] h-[220px] rounded-full blur-[120px]"
          style={{
            background: "rgba(255,255,255,0.1)",
          }}
        />
        {/* Subtle Border */}
        <div className="absolute inset-0 border border-slate-200/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="my-2 sm:my-4 w-14 sm:w-20 h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
          <h1 className="font-serif text-xl sm:text-3xl sm:font-medium text-slate-900 tracking-tight leading-none">
            All Products
          </h1>
          <p className="text-[12px] tracking-[0.15em] sm:tracking-[0.35em] uppercase text-slate-500 mt-2">
            Explore the Collection
          </p>
        </div>
      </div>

      {/* ── Below hero: toolbar wrapper ─────────────────────────── */}
      <div className="px-2 sm:px-8 pt-5">
        {/* ── Toolbar ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3 border border-stone-300 px-3 sm:px-4 py-2.5">

          {/* Search — icon only on mobile, full input on sm+ */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => { setSearchOpen((o) => !o); }}
              className="shrink-0 text-stone-400 hover:text-stone-700 transition-colors sm:cursor-default"
              aria-label="Search"
            >
              <Search size={15} className="text-stone-400" />
            </button>

            {/* always visible on sm+, toggle on mobile */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!search) setSearchOpen(false); }}
              placeholder="Search products..."
              className={`bg-transparent text-[13px] text-stone-700 placeholder:text-stone-400 outline-none transition-all duration-200 min-w-0
              ${searchOpen || search ? "w-full opacity-100" : "w-0 opacity-0 sm:w-full sm:opacity-100"}
            `}
            />

            {search && (
              <button
                onClick={() => { setSearch(""); setSearchOpen(false); }}
                aria-label="Clear search"
                className="shrink-0 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Divider */}
          <span className="h-4 w-px bg-stone-300 shrink-0" />

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1 sm:gap-1.5 text-[13px] text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowUpDown size={14} />
              {/* Full label on md+, short on smaller */}
              <span className="hidden md:inline">{SORT_LABELS[sort]}</span>
              <span className="inline md:hidden">
                {sort === "newest" ? "Newest" : sort === "price-asc" ? "Price ↑" : sort === "price-desc" ? "Price ↓" : "Rating"}
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {sortOpen && (
              <div className="absolute -right-8 top-full mt-2.5 z-20 bg-white border border-stone-200 shadow-md p-1 min-w-[170px]">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 transition-colors ${sort === key ? "text-stone-800 font-medium bg-gray-100" : "text-stone-600"
                      }`}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <span className="h-4 w-px bg-stone-300 shrink-0" />

          {/* Filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1.5 text-[13px] text-stone-600 hover:text-stone-900 transition-colors shrink-0"
          >
            <span className="tracking-wide hidden xs:inline sm:inline">Filter</span>
            {activeCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 rounded bg-gray-200 text-gray-700 text-[8px] font-semibold leading-none">
                {activeCount}
              </span>
            )}
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* ── Grid / Loading / Empty state ──────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-3 gap-y-6 sm:gap-y-8 py-4 sm:py-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 px-4 border border-stone-200 mx-4 my-8 rounded">
            <p className="text-[13px] text-stone-500 text-center leading-relaxed max-w-xs">
              We couldn't find any products matching your active filters. Try
              adjusting your selections or clear filters to explore the
              collection.
            </p>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 border border-stone-300 px-5 py-2 text-[12px] font-medium tracking-widest text-stone-700 hover:bg-stone-50 transition-colors"
            >
              CLEAR ALL FILTERS
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-2 gap-y-4 sm:gap-y-8 py-4 sm:py-8">
            {filtered.map((product) => {
              const firstVariant = product.variants[0];
              const firstPrice = firstVariant.sizes[0].price;
              return (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={firstPrice}
                  currency="₹"
                  images={firstVariant.images}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              );
            })}
          </div>
        )}

        {/* Filter panel */}
        <FilterPanel
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
          activeCount={activeCount}
        />
      </div>{/* end px wrapper */}
    </div>
  );
};

export default AllProducts; 
