import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ProductGallery } from "../components/product-details/image-gallery";
import SizeGuide from "../components/size-guide";
import products from "../data/products.json";
import ProductCard from "../components/product/productcard";

// ── Icons ──────────────────────────────────────────────────────────────────

const DeliveryIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-[14px] h-[14px] shrink-0 mt-0.5 stroke-gray-500"
  >
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h5l2 5v3h-7V8z" />
    <circle cx="5.5" cy="18.5" r="1.5" />
    <circle cx="18.5" cy="18.5" r="1.5" />
  </svg>
);

const PinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-[14px] h-[14px] shrink-0 stroke-gray-500"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-[13px] h-[13px] shrink-0 stroke-gray-500"
  >
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-[13px] h-[13px] shrink-0 stroke-gray-500"
  >
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h5l2 5v3h-7V8z" />
    <circle cx="5.5" cy="18.5" r="1.5" />
    <circle cx="18.5" cy="18.5" r="1.5" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-[13px] h-[13px] shrink-0 stroke-gray-500"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-.08-5H23" />
  </svg>
);

const ChatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-[14px] h-[14px] shrink-0 stroke-gray-500"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-3.5 h-3.5 stroke-gray-400"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    className="w-3.5 h-3.5"
    fill={filled ? "#FBBF24" : "none"}
    stroke="#FBBF24"
    strokeWidth="1.5"
  >
    <path d="M10 1l2.39 5.26 5.61.52-4.16 3.73 1.27 5.49L10 13.27l-5.11 2.73 1.27-5.49L2 6.78l5.61-.52z" />
  </svg>
);

// ── Accordion ──────────────────────────────────────────────────────────────

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3 text-left text-[12px] text-gray-600 tracking-wide"
      >
        <span>{title}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] pb-4" : "max-h-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) ?? products[0];

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const variant = product.variants[selectedColorIdx];
  const selectedSize = variant.sizes[selectedSizeIdx];
  const isOutOfStock = selectedSize.stock === 0;
  const isLowStock = !isOutOfStock && selectedSize.stock <= 5;
  const maxQty = Math.min(10, selectedSize.stock);

  const handleColorSelect = (i: number) => {
    setSelectedColorIdx(i);
    setSelectedSizeIdx(0);
    setQty(1);
  };

  const handleSizeSelect = (i: number) => {
    if (variant.sizes[i].stock === 0) return;
    setSelectedSizeIdx(i);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const rating = product.rating;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  const isOnlyStandard =
    variant.sizes.length === 1 && variant.sizes[0].size === "Standard";

  // "You may also like" — other products
  const alsoLike = products.filter((_, i) => i !== 0).slice(0, 6);

  return (
    <>
      {/* Breadcrumb */}
      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 py-2.5 px-8 border-b border-gray-100">
        <a href="#" className="hover:text-gray-700 transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="#" className="hover:text-gray-700 transition-colors">
          {product.category}
        </a>
        <span>/</span>
        <a href="#" className="hover:text-gray-700 transition-colors">
          {product.subcategory}
        </a>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Main layout */}
      <div className="flex gap-0 items-start">
        {/* Gallery */}
        <div className="w-[55%]">
          <ProductGallery
            images={variant.images}
            productName={product.name}
            color={variant.color}
            rating={product.rating}
            ratingCount={120}
          />
        </div>

        {/* Detail panel */}
        <div className="w-[45%] pl-8 pr-6 py-6 sticky top-[52px] border-l border-gray-100">
          {/* Brand */}
          <p className="text-[11px] tracking-[0.12em] uppercase text-gray-400 mb-1">
            {product.brand}
          </p>

          {/* Name */}
          <h1 className="font-serif text-[1.6rem] font-normal leading-snug tracking-tight text-gray-900 mb-1.5">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  filled={s <= fullStars || (s === fullStars + 1 && hasHalf)}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">
              {rating} · 120 reviews
            </span>
          </div>

          {/* Description */}
          <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[22px] font-semibold tracking-tight text-gray-900">
              ₹ {selectedSize.price.toLocaleString("en-IN")}
            </span>
            {selectedSize.price < product.basePrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹ {product.basePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mb-5">
            Inclusive of all taxes
          </p>

          {/* Delivery box */}
          <div className="border border-gray-200 rounded text-[12px] divide-y divide-gray-100 mb-5">
            <div className="flex items-start gap-2 p-3 text-gray-600">
              <DeliveryIcon />
              <span>
                Get it by <strong className="text-gray-800">Fri, 4 Jul</strong>
                {" · "}Free delivery on orders above ₹1,000
                {" · "}
                <a
                  href="#"
                  className="underline text-gray-500 hover:text-gray-800"
                >
                  30-day guarantee
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2 p-3">
              <PinIcon />
              <input
                type="text"
                value={pincode}
                placeholder="Enter pincode for exact delivery date"
                maxLength={6}
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-[12px] text-gray-700"
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
              {pincode.length === 6 && (
                <button className="text-[11px] text-blue-600 hover:underline shrink-0">
                  Check
                </button>
              )}
            </div>
          </div>

          {/* Color selector */}
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2 font-medium">
              Colour —{" "}
              <span className="normal-case font-normal text-gray-700">
                {variant.color}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => handleColorSelect(i)}
                  aria-label={v.color}
                  title={v.color}
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${i === selectedColorIdx
                      ? "border-gray-900 scale-110"
                      : "border-gray-200"
                    }`}
                  style={{ backgroundColor: v.colorCode }}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          {!isOnlyStandard && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
                  Size —{" "}
                  <span className="normal-case font-normal text-gray-700">
                    {selectedSize.size}
                  </span>
                </p>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setSizeGuideOpen(true); }}
                  className="text-[11px] text-gray-400 underline hover:text-gray-700"
                >
                  Size guide
                </a>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {variant.sizes.map((s, i) => {
                  const oos = s.stock === 0;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSizeSelect(i)}
                      disabled={oos}
                      className={`min-w-[42px] h-8 px-3 text-[12px] border rounded transition-all ${i === selectedSizeIdx
                          ? "border-gray-900 bg-gray-900 text-white"
                          : oos
                            ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                            : "border-gray-300 text-gray-600 hover:border-gray-700"
                        }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock indicator */}
          <div className="text-[12px] mb-4">
            {isOutOfStock ? (
              <span className="text-red-500">Out of stock</span>
            ) : isLowStock ? (
              <span className="text-orange-500">
                Only {selectedSize.stock} left in stock
              </span>
            ) : (
              <span className="text-green-700">In stock</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-200 rounded overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 bg-gray-50 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <span className="w-9 h-8 flex items-center justify-center text-[13px] text-gray-800 border-x border-gray-200 font-mono">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                className="w-8 h-8 bg-gray-50 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-gray-400">Qty</span>
          </div>

          {/* CTA */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 h-11 text-[12px] font-medium tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all ${isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : addedToCart
                    ? "bg-green-700 text-white"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {isOutOfStock
                ? "Out of Stock"
                : addedToCart
                  ? "Added to Cart ✓"
                  : "Add to Cart"}
            </button>
            <button
              onClick={() => setWishlist((w) => !w)}
              aria-label="Wishlist"
              className={`w-11 h-11 rounded border flex items-center justify-center transition-all ${wishlist
                  ? "border-red-300 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-400 hover:border-gray-500"
                }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-[17px] h-[17px]"
                fill={wishlist ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-gray-500 mb-4 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1.5">
              <ShieldIcon /> 100% Authentic
            </span>
            <span className="flex items-center gap-1.5">
              <TruckIcon /> Free Delivery ₹1000+
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshIcon /> 7-day exchange
            </span>
          </div>

          {/* Chat */}
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-0.5">
            <ChatIcon />
            Need help?{" "}
            <a
              href="#"
              className="underline hover:text-gray-800 transition-colors"
            >
              Chat with us
            </a>
          </div>
          <p className="text-[11px] text-gray-400 mb-4">
            Our team can help you choose the right product
          </p>

          {/* Accordion */}
          <div className="border-t border-gray-100">
            <Accordion title="Description" defaultOpen>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                {product.description}
              </p>
            </Accordion>

            <Accordion title="Care Guide">
              <ul className="text-[12px] text-gray-500 leading-relaxed list-disc pl-4 space-y-1">
                <li>Machine wash cold, gentle cycle</li>
                <li>Do not bleach</li>
                <li>Tumble dry low</li>
                <li>Iron on medium heat</li>
                <li>Wash dark colours separately</li>
              </ul>
            </Accordion>

            <Accordion title="Shipping">
              <ul className="text-[12px] text-gray-500 leading-relaxed list-disc pl-4 space-y-1">
                <li>Orders dispatched within 1–2 business days</li>
                <li>Standard delivery: 4–7 business days</li>
                <li>Free shipping on orders above ₹1,000</li>
                <li>Express delivery available at checkout</li>
              </ul>
            </Accordion>

            <Accordion title="Specifications">
              <table className="w-full text-[12px]">
                <tbody>
                  {[
                    ["Brand", product.brand],
                    ["Category", product.category],
                    ["Subcategory", product.subcategory],
                    ["Rating", `${product.rating} / 5`],
                  ].map(([k, v]) => (
                    <tr
                      key={k}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-1.5 text-gray-400 w-2/5">{k}</td>
                      <td className="py-1.5 text-gray-700">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {alsoLike.length > 0 && (
        <section className="px-8 py-10 border-t border-gray-100">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-gray-400 mb-5">
            You May Also Like
          </p>
          <div className="grid grid-cols-6 gap-2 w-full">
            {alsoLike.map((p) => {
              return (
                <a key={p.id}  className="group block">
                  <ProductCard
                    key={p.id}
                    name={p.name}
                    price={p.basePrice}
                    currency="₹"
                    images={p.variants[0].images}
                  />
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
};

export default ProductDetails;
