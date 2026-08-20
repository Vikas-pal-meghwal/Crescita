import { useNavigate } from "react-router-dom";
import {
  Package,
  Tag,
  Star,
  TrendingUp,
  LogOut,
  Home,
  ChevronRight,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import products from "../../data/products.json";

/* ── Derived stats ─────────────────────────── */
const totalProducts = products.length;

const categoryCount = products.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});

const subcategoryCount = products.reduce<Record<string, number>>((acc, p) => {
  acc[p.subcategory] = (acc[p.subcategory] ?? 0) + 1;
  return acc;
}, {});

const avgRating =
  products.reduce((sum, p) => sum + (p.rating ?? 0), 0) / products.length;

const lowStock = products.filter((p) =>
  p.variants.some((v) => v.sizes.some((s) => s.stock < 10))
);

const totalStock = products.reduce(
  (sum, p) =>
    sum + p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, s) => ss + s.stock, 0), 0),
  0
);

const avgPrice =
  products.reduce((sum, p) => sum + p.variants[0].sizes[0].price, 0) /
  products.length;

/* ── Helpers ───────────────────────────────── */
const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(Math.round(n));

/* ── Component ─────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("crescita_admin");
    navigate("/admin", { replace: true });
  };

  const STAT_CARDS = [
    {
      icon: <Package size={18} />,
      label: "Total Products",
      value: totalProducts,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: <BarChart2 size={18} />,
      label: "Total Stock Units",
      value: fmt(totalStock),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: <Star size={18} />,
      label: "Avg. Rating",
      value: avgRating.toFixed(1) + " / 5",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: <TrendingUp size={18} />,
      label: "Avg. Price",
      value: "₹ " + fmt(avgPrice),
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: <Tag size={18} />,
      label: "Categories",
      value: Object.keys(categoryCount).length,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      icon: <AlertTriangle size={18} />,
      label: "Low Stock Items",
      value: lowStock.length,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f7] flex flex-col">

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-gray-100 px-6 sm:px-10 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span
            className="text-[1.1rem] font-normal text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Crescita
          </span>
          <ChevronRight size={13} className="text-gray-300" />
          <span className="text-[12px] text-gray-400 tracking-wide">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-800 transition-colors tracking-wide"
          >
            <Home size={13} />
            <span className="hidden sm:inline">View Store</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-600 transition-colors tracking-wide"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full">

        {/* Page title */}
        <div className="mb-8">
          <h1
            className="text-[1.6rem] sm:text-[2rem] font-normal text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Overview
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Welcome back, Admin · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-100 rounded-sm p-4 sm:p-5 flex flex-col gap-3"
            >
              <div className={`${card.bg} ${card.color} w-8 h-8 rounded-full flex items-center justify-center`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-1">{card.label}</p>
                <p className="text-[1.2rem] sm:text-[1.4rem] font-normal text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* ── Products table ── */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-[13px] font-medium text-gray-700">All Products</h2>
              <span className="text-[10px] tracking-[0.1em] uppercase text-gray-300">{totalProducts} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-5 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">Product</th>
                    <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal hidden sm:table-cell">Category</th>
                    <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">Price</th>
                    <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal hidden sm:table-cell">Rating</th>
                    <th className="text-left px-3 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => {
                    const stock = p.variants.reduce(
                      (s, v) => s + v.sizes.reduce((ss, sz) => ss + sz.stock, 0),
                      0
                    );
                    const isLow = p.variants.some((v) =>
                      v.sizes.some((s) => s.stock < 10)
                    );
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        {/* Product name + image */}
                        <td className="px-5 py-3">
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
                        <td className="px-3 py-3 text-gray-500 hidden sm:table-cell">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full text-[10px]">
                            {p.subcategory}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-700 font-medium">
                          ₹{fmt(p.variants[0].sizes[0].price)}
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-gray-600">{p.rating}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${isLow ? "text-red-500" : "text-emerald-600"}`}>
                            {isLow && <AlertTriangle size={10} />}
                            {stock}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">

            {/* Category breakdown */}
            <div className="bg-white border border-gray-100 rounded-sm p-5">
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
                          className="h-full bg-gray-800 rounded-full transition-all duration-700"
                          style={{ width: `${(count / totalProducts) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sub-category breakdown */}
            <div className="bg-white border border-gray-100 rounded-sm p-5">
              <h2 className="text-[13px] font-medium text-gray-700 mb-4">Top Subcategories</h2>
              <div className="space-y-2">
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
            {lowStock.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={13} className="text-red-500" />
                  <h2 className="text-[13px] font-medium text-red-600">Low Stock Alert</h2>
                </div>
                <div className="space-y-2">
                  {lowStock.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => navigate(`/product/${p.id}`)}
                    >
                      <span className="text-[12px] text-red-700 truncate max-w-[140px]">{p.name}</span>
                      <span className="text-[10px] text-red-400 shrink-0 ml-2">
                        {p.variants.reduce((s, v) => s + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0)} left
                      </span>
                    </div>
                  ))}
                  {lowStock.length > 5 && (
                    <p className="text-[10px] text-red-400 mt-1">+{lowStock.length - 5} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
