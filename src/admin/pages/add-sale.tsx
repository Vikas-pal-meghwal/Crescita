import { useState, useMemo } from "react";
import MainLayout from "../component/layout";
import { Tag, Search, X, Check, AlertTriangle } from "lucide-react";
import rawProducts from "../../data/products.json";

type Size = { size: string; sku: string; price: number; stock: number };
type Variant = { color: string; colorCode: string; images: string[]; sizes: Size[] };
type Product = {
  id: string; name: string; category: string; subcategory: string;
  brand: string; description: string; basePrice: number; currency: string;
  rating: number; tags: string[]; variants: Variant[];
};

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(Math.round(n));

const CATEGORY_COLORS: Record<string, string> = {
  Beauty: "bg-pink-50 text-pink-600",
  Fashion: "bg-blue-50 text-blue-600",
  "Home & Living": "bg-emerald-50 text-emerald-600",
};
const catColor = (cat: string) => CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600";

const AdminSale = () => {
  const products: Product[] = rawProducts as Product[];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState<number>(10);
  const [saleName, setSaleName] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, search, category]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (filtered.every((p) => selected.has(p.id))) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const handleApplySale = () => {
    if (!saleName.trim() || selected.size === 0) return;
    // In a real app: persist to backend/store. Here we show success feedback.
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const selectedProducts = products.filter((p) => selected.has(p.id));
  const avgOriginalPrice =
    selectedProducts.length > 0
      ? selectedProducts.reduce((s, p) => s + p.variants[0].sizes[0].price, 0) /
        selectedProducts.length
      : 0;
  const avgDiscountedPrice = avgOriginalPrice * (1 - discount / 100);

  return (
    <MainLayout>
      <div className="w-full px-2 sm:px-5 py-2 sm:py-4 space-y-6">
        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[1.5rem] sm:text-[1.9rem] font-semibold tracking-tight text-gray-900">
              Manage Sale
            </h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Select products and apply a discount to create a sale event.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: product selector ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-9 py-2.5 text-[13px] border border-gray-200 bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors rounded"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded w-fit">
                {["All", "Beauty", "Fashion", "Home & Living"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded whitespace-nowrap transition-colors ${
                      category === c
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleAll}
                          className="w-3.5 h-3.5 accent-gray-900 cursor-pointer"
                          aria-label="Select all"
                        />
                      </th>
                      <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium">
                        Product
                      </th>
                      <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium">
                        Price
                      </th>
                      <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium">
                        After Discount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-[13px] text-gray-400">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((p) => {
                        const originalPrice = p.variants[0].sizes[0].price;
                        const discountedPrice = originalPrice * (1 - discount / 100);
                        const isSelected = selected.has(p.id);
                        return (
                          <tr
                            key={p.id}
                            onClick={() => toggleSelect(p.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? "bg-gray-50" : "hover:bg-gray-50/60"
                            }`}
                          >
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(p.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-3.5 h-3.5 accent-gray-900 cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.variants[0].images[0]}
                                  alt={p.name}
                                  className="w-9 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-gray-800 font-medium truncate max-w-[140px]">
                                    {p.name}
                                  </p>
                                  <p className="text-gray-400 text-[11px] truncate">{p.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 hidden sm:table-cell">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${catColor(p.category)}`}
                              >
                                {p.subcategory}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-gray-500 line-through text-[12px]">
                              ₹{fmt(originalPrice)}
                            </td>
                            <td className="px-3 py-3 text-red-500 font-semibold text-[13px]">
                              ₹{fmt(discountedPrice)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Right: sale config ── */}
          <div className="space-y-4">
            {/* Sale details card */}
            <div className="bg-white border border-gray-100 rounded p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-red-50 p-2 rounded">
                  <Tag size={15} className="text-red-500" />
                </div>
                <h2 className="text-[13px] font-semibold text-gray-800">Sale Configuration</h2>
              </div>

              {/* Sale name */}
              <div>
                <label className="block text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-1">
                  Sale Name
                </label>
                <input
                  value={saleName}
                  onChange={(e) => setSaleName(e.target.value)}
                  placeholder="e.g. Summer Sale, Flash Deal…"
                  className="w-full px-3 py-2.5 text-[13px] border border-gray-200 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors rounded"
                />
              </div>

              {/* Discount % */}
              <div>
                <label className="block text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-1">
                  Discount — {discount}%
                </label>
                <input
                  type="range"
                  min={5}
                  max={80}
                  step={5}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                  <span>5%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* Quick % buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[10, 20, 30, 40, 50].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscount(d)}
                    className={`px-3 py-1 text-[11px] font-medium rounded border transition-colors ${
                      discount === d
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-white border border-gray-100 rounded p-5 shadow-sm space-y-3">
              <h2 className="text-[13px] font-semibold text-gray-800">Summary</h2>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Products</span>
                  <span className="font-semibold text-gray-800">{selected.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-semibold text-red-500">{discount}% OFF</span>
                </div>
                {selected.size > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg. Original Price</span>
                      <span className="text-gray-400 line-through">₹{fmt(avgOriginalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg. After Discount</span>
                      <span className="font-semibold text-red-500">₹{fmt(avgDiscountedPrice)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Validation warning */}
            {(!saleName.trim() || selected.size === 0) && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded px-4 py-3">
                <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-700">
                  {!saleName.trim() && selected.size === 0
                    ? "Enter a sale name and select at least one product."
                    : !saleName.trim()
                    ? "Enter a sale name to continue."
                    : "Select at least one product."}
                </p>
              </div>
            )}

            {/* Apply button */}
            <button
              onClick={handleApplySale}
              disabled={!saleName.trim() || selected.size === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded transition-colors"
            >
              {saved ? (
                <>
                  <Check size={15} />
                  Sale Applied!
                </>
              ) : (
                <>
                  <Tag size={15} />
                  Apply Sale to {selected.size > 0 ? `${selected.size} Product${selected.size > 1 ? "s" : ""}` : "Products"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSale;
