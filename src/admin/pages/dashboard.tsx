

import { useMemo, useState } from "react";
import MainLayout from "../component/layout"
import { useNavigate } from "react-router-dom";
import {
    Package,
    Tag,
    Star,
    TrendingUp,
    AlertTriangle,
    BarChart2,
    Search,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
} from "lucide-react";
import products from "../../data/products.json";

/* ── Config ── */
// A product counts as "low stock" based on TOTAL units left, not a single
// size dipping under a threshold — otherwise a product with 258 units in
// stock (but one size at 9) gets flagged as low, which is misleading.
const LOW_STOCK_THRESHOLD = 30;

const CATEGORY_COLORS: Record<string, { text: string; bg: string; bar: string }> = {
    Beauty: { text: "text-pink-600", bg: "bg-pink-50", bar: "bg-pink-500" },
    Fashion: { text: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
    "Home & Living": { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
};
const FALLBACK_COLOR = { text: "text-gray-600", bg: "bg-gray-100", bar: "bg-gray-500" };
const colorFor = (cat: string) => CATEGORY_COLORS[cat] ?? FALLBACK_COLOR;

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(Math.round(n));

type SortKey = "price" | "rating" | "stock";
type SortDir = "asc" | "desc";

/* ── Component ── */
const Dashboard = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    /* Precompute per-product totals once instead of on every render pass */
    const enriched = useMemo(
        () =>
            products.map((p) => {
                const stock = p.variants.reduce(
                    (s, v) => s + v.sizes.reduce((ss, sz) => ss + sz.stock, 0),
                    0
                );
                return { ...p, stock, isLow: stock < LOW_STOCK_THRESHOLD };
            }),
        []
    );

    const totalProducts = enriched.length;

    const categoryCount = useMemo(
        () =>
            enriched.reduce<Record<string, number>>((acc, p) => {
                acc[p.category] = (acc[p.category] ?? 0) + 1;
                return acc;
            }, {}),
        [enriched]
    );

    const subcategoryCount = useMemo(
        () =>
            enriched.reduce<Record<string, number>>((acc, p) => {
                acc[p.subcategory] = (acc[p.subcategory] ?? 0) + 1;
                return acc;
            }, {}),
        [enriched]
    );

    const avgRating = enriched.reduce((sum, p) => sum + (p.rating ?? 0), 0) / totalProducts;
    const totalStock = enriched.reduce((sum, p) => sum + p.stock, 0);
    const avgPrice =
        enriched.reduce((sum, p) => sum + p.variants[0].sizes[0].price, 0) / totalProducts;

    const lowStock = useMemo(
        () => [...enriched].filter((p) => p.isLow).sort((a, b) => a.stock - b.stock),
        [enriched]
    );

    const STAT_CARDS = [
        { icon: <Package size={18} />, label: "Total Products", value: totalProducts, color: "text-blue-600", bg: "bg-blue-50" },
        { icon: <BarChart2 size={18} />, label: "Total Stock Units", value: fmt(totalStock), color: "text-emerald-600", bg: "bg-emerald-50" },
        { icon: <Star size={18} />, label: "Avg. Rating", value: avgRating.toFixed(1) + " / 5", color: "text-amber-600", bg: "bg-amber-50" },
        { icon: <TrendingUp size={18} />, label: "Avg. Price", value: "₹ " + fmt(avgPrice), color: "text-violet-600", bg: "bg-violet-50" },
        { icon: <Tag size={18} />, label: "Categories", value: Object.keys(categoryCount).length, color: "text-pink-600", bg: "bg-pink-50" },
        { icon: <AlertTriangle size={18} />, label: "Low Stock Items", value: lowStock.length, color: "text-red-600", bg: "bg-red-50" },
    ];

    /* Dashboard table: a focused "needs attention" slice, not the full catalog.
       Search overrides the low-stock-first default so people can still find
       any product without leaving the page. */
    const tableRows = useMemo(() => {
        let rows = enriched;
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            rows = rows.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.subcategory.toLowerCase().includes(q)
            );
        } else {
            rows = lowStock.length ? lowStock : enriched;
        }

        if (sortKey) {
            rows = [...rows].sort((a, b) => {
                const av = sortKey === "price" ? a.variants[0].sizes[0].price : sortKey === "rating" ? a.rating ?? 0 : a.stock;
                const bv = sortKey === "price" ? b.variants[0].sizes[0].price : sortKey === "rating" ? b.rating ?? 0 : b.stock;
                return sortDir === "asc" ? av - bv : bv - av;
            });
        }

        return rows.slice(0, query.trim() ? 20 : 8);
    }, [enriched, lowStock, query, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const SortHeader = ({ label, keyName }: { label: string; keyName: SortKey }) => (
        <th
            className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal select-none"
        >
            <button
                type="button"
                onClick={() => toggleSort(keyName)}
                className="inline-flex items-center gap-1 hover:text-gray-600 transition-colors"
            >
                {label}
                {sortKey === keyName ? (
                    sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />
                ) : (
                    <ArrowUpDown size={11} className="opacity-30" />
                )}
            </button>
        </th>
    );

    return (
        <MainLayout>
            {/* Scrollable page content */}
            <div className="flex-1 ">
                <div className="px-4 sm:px-4 py-6 max-w-full mx-auto space-y-6">

                    {/* ── Stat cards ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {STAT_CARDS.map((card) => (
                            <div
                                key={card.label}
                                className="bg-white border border-gray-100 rounded-sm p-4 flex flex-col gap-3 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all"
                            >
                                <div className={`${card.bg} ${card.color} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-0.5 leading-tight">
                                        {card.label}
                                    </p>
                                    <p
                                        className="text-[1.15rem] sm:text-[1.3rem] font-normal text-gray-900 leading-tight"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Main grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                        {/* Products table */}
                        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                                <div>
                                    <h2 className="text-[13px] font-medium text-gray-700">
                                        {query.trim() ? "Search Results" : "Needs Attention"}
                                    </h2>
                                    {!query.trim() && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {lowStock.length ? "Lowest stock first" : "Nothing urgent — showing all products"}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Search products…"
                                            className="pl-7 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-full w-40 sm:w-48 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/admin/products")}
                                        className="text-[10px] tracking-[0.1em] uppercase text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap"
                                    >
                                        View all {totalProducts} →
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[12px]">
                                    <thead>
                                        <tr className="border-b border-gray-50 bg-gray-50/60">
                                            <th className="text-left px-5 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">Product</th>
                                            <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal hidden sm:table-cell">Category</th>
                                            <SortHeader label="Price" keyName="price" />
                                            <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal hidden sm:table-cell">
                                                <SortHeader label="Rating" keyName="rating" />
                                            </th>
                                            <SortHeader label="Stock" keyName="stock" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {tableRows.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-[12px]">
                                                    No products match "{query}"
                                                </td>
                                            </tr>
                                        )}
                                        {tableRows.map((p) => (
                                            <tr
                                                key={p.id}
                                                tabIndex={0}
                                                role="button"
                                                onClick={() => navigate(`/product/${p.id}`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        navigate(`/product/${p.id}`);
                                                    }
                                                }}
                                                className="hover:bg-gray-50/70 transition-colors cursor-pointer focus:outline-none focus:bg-gray-50"
                                            >
                                                <td className="px-5 py-2.5">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={p.variants[0].images[0]}
                                                            alt={p.name}
                                                            className="w-8 h-9 object-cover rounded-sm bg-gray-100 shrink-0"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-gray-800 font-medium truncate max-w-[120px] sm:max-w-[180px]">{p.name}</p>
                                                            <p className="text-gray-400 text-[10px]">{p.brand}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-gray-500 hidden sm:table-cell">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${colorFor(p.category).bg} ${colorFor(p.category).text}`}>
                                                        {p.subcategory}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 text-gray-700 font-medium">
                                                    ₹{fmt(p.variants[0].sizes[0].price)}
                                                </td>
                                                <td className="px-3 py-2.5 hidden sm:table-cell">
                                                    <div className="flex items-center gap-1">
                                                        <Star size={10} className="text-amber-400 fill-amber-400" />
                                                        <span className="text-gray-600">{p.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${p.isLow ? "text-red-500" : "text-emerald-600"}`}>
                                                        {p.isLow && <AlertTriangle size={10} />}
                                                        {p.stock}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="flex flex-col gap-4">

                            {/* Category breakdown */}
                            <div className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
                                <h2 className="text-[13px] font-medium text-gray-700 mb-4">By Category</h2>
                                <div className="space-y-3">
                                    {Object.entries(categoryCount)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([cat, count]) => (
                                            <div key={cat}>
                                                <div className="flex justify-between text-[12px] mb-1">
                                                    <span className="text-gray-600">{cat}</span>
                                                    <span className="text-gray-400">{count} products</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${colorFor(cat).bar}`}
                                                        style={{ width: `${(count / totalProducts) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Subcategories */}
                            <div className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
                                <h2 className="text-[13px] font-medium text-gray-700 mb-4">Top Subcategories</h2>
                                <div className="space-y-1">
                                    {Object.entries(subcategoryCount)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 8)
                                        .map(([sub, count]) => (
                                            <div key={sub} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                                <span className="text-[12px] text-gray-600">{sub}</span>
                                                <span className="text-[11px] font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    {count}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Low stock alert */}
                            <div className="bg-red-50 border border-red-100 rounded-sm p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle size={13} className="text-red-500" />
                                    <h2 className="text-[13px] font-medium text-red-600">Low Stock Alert</h2>
                                </div>
                                {lowStock.length === 0 ? (
                                    <p className="text-[12px] text-red-400">All products are well stocked.</p>
                                ) : (
                                    <div className="space-y-2.5">
                                        {lowStock.slice(0, 5).map((p) => (
                                            <div
                                                key={p.id}
                                                tabIndex={0}
                                                role="button"
                                                className="flex items-center justify-between cursor-pointer group focus:outline-none"
                                                onClick={() => navigate(`/product/${p.id}`)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        navigate(`/product/${p.id}`);
                                                    }
                                                }}
                                            >
                                                <span className="text-[12px] text-red-700 truncate max-w-[140px] group-hover:underline group-focus:underline">
                                                    {p.name}
                                                </span>
                                                <span className="text-[10px] text-red-400 shrink-0 ml-2 font-medium">
                                                    {p.stock} left
                                                </span>
                                            </div>
                                        ))}
                                        {lowStock.length > 5 && (
                                            <p className="text-[10px] text-red-400 mt-1">+{lowStock.length - 5} more</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;

