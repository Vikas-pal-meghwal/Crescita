import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Heart, User, ShoppingBasket } from "lucide-react";
import products from "../../data/products.json";
import logo from "../../assets/crescita-logo.png"

// Maps nav label → query params for /products
const NAV_ITEMS: { label: string; params: Record<string, string>; highlight?: boolean }[] = [
  { label: "New Arrivals", params: { sort: "newest" } },
  { label: "Women", params: { category: "Fashion", sub: "Women's Clothing" } },
  { label: "Men", params: { category: "Fashion", sub: "Men's Clothing" } },
  { label: "Kids", params: { category: "Fashion", sub: "Kids Clothing" } },
  { label: "Beauty", params: { category: "Beauty" } },
  { label: "Home & Living", params: { category: "Home & Living" } },
  { label: "Sale", params: { sort: "discount" }, highlight: true },
];

const Header = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNav = (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    navigate(`/products?${qs}`);
  };

  // Focus input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // Live suggestions — top 6 matches
  const suggestions = query.trim().length > 1
    ? products
      .filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  const goToProduct = (id: string) => {
    setSearchOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 flex items-center justify-between md:px-2 h-[52px]">
        {/* Logo */}
        <a href="/" className="shrink-0" aria-label="Home">
          <img src={logo} alt="Logo" className="h-6 sm:h-10 w-auto object-contain" />
        </a>

        {/* Nav links */}
        <ul className="hidden md:flex gap-0 list-none">
          {NAV_ITEMS.map(({ label, params, highlight }) => (
            <li key={label}>
              <button
                onClick={() => handleNav(params)}
                className={`text-xs font-normal tracking-[0.03em] px-2.5 lg:px-3.5 h-[52px] inline-flex items-center transition-colors ${
                  highlight
                    ? "text-red-500 font-semibold hover:text-red-700"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right icons */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="text-xs tracking-[0.03em] text-gray-700 hover:text-black transition-colors flex items-center gap-1 p-1"
          >
            <Search size={16} />
          </button>
          <a href="/wishlist" className="flex items-center p-1" aria-label="Wishlist">
            <Heart className="w-[18px] h-[18px] stroke-gray-700 hover:stroke-black transition-colors" />
          </a>
          <a href="/wishlist" className="flex items-center p-1" aria-label="Cart">
            <ShoppingBasket className="w-[18px] h-[18px] stroke-gray-700 hover:stroke-black transition-colors" />
          </a>
          <a href="/wishlist" className="flex items-center p-1" aria-label="Account">
            <User className="w-[18px] h-[18px] stroke-gray-700 hover:stroke-black transition-colors" />
          </a>
        </div>
      </nav>

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: "rgba(255,255,255,0.97)" }}
        >
          {/* Search bar row */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 px-6 sm:px-12 border-b border-gray-100"
            style={{ height: "64px" }}
          >
            <Search size={17} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, brands..."
              className="flex-1 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </form>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-4">
            {query.trim().length > 1 ? (
              suggestions.length > 0 ? (
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 mb-3">
                    Results ({suggestions.length})
                  </p>
                  <ul className="divide-y divide-gray-50">
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => goToProduct(p.id)}
                          className="w-full flex items-center gap-4 py-3 hover:bg-gray-50 transition-colors rounded px-2 -mx-2 text-left"
                        >
                          <img
                            src={p.variants[0].images[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded shrink-0 bg-gray-100"
                          />
                          <div className="min-w-0">
                            <p className="text-[13px] text-gray-800 font-medium leading-snug truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {p.brand} · {p.category}
                            </p>
                          </div>
                          <p className="ml-auto text-[13px] font-medium text-gray-700 shrink-0">
                            ₹ {p.variants[0].sizes[0].price.toLocaleString("en-IN")}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* View all results */}
                  <button
                    onClick={handleSubmit as never}
                    className="mt-4 text-[11px] tracking-[0.12em] uppercase text-gray-500 hover:text-gray-900 transition-colors border-b border-gray-300 pb-px"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 mt-6">
                  No products found for "<span className="text-gray-600">{query}</span>"
                </p>
              )
            ) : (
              /* Quick links when no query */
              <div>
                <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 mb-3">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Fashion", "Beauty", "Home & Living", "Skincare", "Footwear", "Makeup"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/products?category=${encodeURIComponent(cat)}`);
                      }}
                      className="px-4 py-1.5 border border-gray-200 text-[12px] text-gray-600 hover:border-gray-500 hover:text-gray-900 transition-colors rounded-full"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
