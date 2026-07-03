import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, ShoppingBag } from "lucide-react";
import products from "../data/products.json";

// Using first 4 products as demo wishlist items
// When you add global wishlist state, replace this with actual wishlist data
const DEMO_ITEMS = products.slice(0, 10);

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
}

const toItem = (p: (typeof products)[number]): WishlistItem => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  price: p.variants[0].sizes[0].price,
  image: p.variants[0].images[0],
  category: p.category,
});

const Wishlist = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>(DEMO_ITEMS.map(toItem));

  const remove = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const clearAll = () => setItems([]);

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 sm:px-8 py-4 sm:py-10">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <div>
          <h1 className=" text-lg sm:text-2xl font-serif font-medium text-gray-900 ">
            My Wishlist
          </h1>
          {/* <p className="text-lg sm:text-[24px] font-sans-serif  text-gray-900 leading-tight">
            Saved Items
            {items.length > 0 && (
              <span className="ml-2 text-[14px] font-sans text-gray-400 font-normal">
                ({items.length})
              </span>
            )}
          </p> */}
        </div>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] tracking-[0.1em] uppercase text-gray-400 hover:text-gray-700 transition-colors border-b border-gray-300 hover:border-gray-600 pb-px"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Empty state ── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-24 gap-5 border border-gray-200 rounded">
          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center">
            <Heart size={20} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-[13px] text-gray-700 font-medium mb-1">
              Your wishlist is empty
            </p>
            <p className="text-[12px] text-gray-400 sm:max-w-xs leading-relaxed">
              Save items you love by clicking the heart icon on any product.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 mt-2 px-6 py-2.5 bg-gray-900 text-white text-[11px] tracking-[0.12em] uppercase hover:bg-gray-700 transition-colors"
          >
            <ShoppingBag size={13} />
            Explore Products
          </button>
        </div>
      ) : (
        <>
          {/* ── Item grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-2 sm:gap-x-3 gap-2 sm:gap-y-8">
            {items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={() => remove(item.id)}
                onNavigate={() => navigate(`/product/${item.id}`)}
              />
            ))}
          </div>

          {/* ── Continue shopping ── */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-gray-400">
              Double-click any product to view details
            </p>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-[11px] tracking-[0.12em] uppercase text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;

// ── Wishlist Card ──────────────────────────────────────────

function WishlistCard({
  item,
  onRemove,
  onNavigate,
}: {
  item: WishlistItem;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={onNavigate}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded cursor-pointer mb-2">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />

        {/* Remove button */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove from wishlist"
          className="absolute top-2 right-2 w-7 h-7 rounded-sm bg-white/90 flex items-center justify-center transition-opacity hover:bg-white"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <X size={13} className="text-gray-600" />
        </button>



        {/* Add to cart overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gray-900/90 flex items-center justify-center py-2.5 transition-all duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          <span className="text-[10px] tracking-[0.14em] uppercase text-white flex items-center gap-1.5">
            <ShoppingBag size={11} />
            Add to Cart
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-0.5">
          {item.brand}
        </p>
        <p className="text-[12px] text-gray-700 leading-snug line-clamp-2 mb-1">
          {item.name}
        </p>
        <p className="text-[12px] sm:text-[13px] sm:font-medium text-gray-900">
          ₹ {item.price.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
