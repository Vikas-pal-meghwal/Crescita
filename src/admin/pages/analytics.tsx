import { useState, useMemo } from 'react'
import MainLayout from '../component/layout'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, CartesianGrid,
} from 'recharts'
import { TrendingUp, TrendingDown, Package, Star, AlertTriangle, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react'
import products from '../../data/products.json'

/* ─── Data derivations ─────────────────────── */

const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(Math.round(n))

const totalProducts = products.length

const totalStock = products.reduce((s, p) =>
  s + p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0), 0)

const totalInventoryValue = products.reduce((s, p) =>
  s + p.variants.reduce((vs, v) =>
    vs + v.sizes.reduce((ss, sz) => ss + sz.stock * sz.price, 0), 0), 0)

const avgRating = products.reduce((s, p) => s + p.rating, 0) / products.length

const lowStockProducts = products.filter(p =>
  p.variants.some(v => v.sizes.some(s => s.stock < 10)))

// Flattened one row per (product, variant, size) combo that's under threshold —
// this is what actually gets paginated, since a product can contribute multiple rows.
const lowStockRows = lowStockProducts.flatMap(p =>
  p.variants.flatMap(v =>
    v.sizes
      .filter(s => s.stock < 10)
      .map(s => ({
        key: s.sku,
        name: p.name,
        subcategory: p.subcategory,
        brand: p.brand,
        image: v.images[0],
        colorCode: v.colorCode,
        color: v.color,
        size: s.size,
        stock: s.stock,
        price: s.price,
      }))
  )
)

// Products per category
const categoryData = Object.entries(
  products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1; return acc
  }, {})
).map(([name, value]) => ({ name, value }))

// Products per subcategory (top 8)
const subcategoryData = Object.entries(
  products.reduce<Record<string, number>>((acc, p) => {
    acc[p.subcategory] = (acc[p.subcategory] ?? 0) + 1; return acc
  }, {})
).sort((a, b) => b[1] - a[1]).slice(0, 8)
  .map(([name, count]) => ({ name, count }))

// Stock per category
const stockByCategory = Object.entries(
  products.reduce<Record<string, number>>((acc, p) => {
    const stock = p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0)
    acc[p.category] = (acc[p.category] ?? 0) + stock; return acc
  }, {})
).map(([name, stock]) => ({ name, stock }))

// Avg price per category
const priceByCategory = Object.entries(
  products.reduce<Record<string, number[]>>((acc, p) => {
    const price = p.variants[0].sizes[0].price
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(price); return acc
  }, {})
).map(([cat, prices]) => ({
  name: cat,
  avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
  min: Math.min(...prices),
  max: Math.max(...prices),
}))

// Rating distribution
const ratingDist = [5, 4, 3, 2, 1].map(r => ({
  label: `${r}★`,
  count: products.filter(p => Math.floor(p.rating) === r).length,
}))

// Top 5 most stocked products
const topStocked = [...products]
  .map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
    stock: p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0),
    category: p.category,
  }))
  .sort((a, b) => b.stock - a.stock)
  .slice(0, 6)

// Top 5 most valuable (stock * price)
const topValue = [...products]
  .map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
    value: p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock * sz.price, 0), 0),
    image: p.variants[0].images[0],
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5)

// Brands breakdown
const brandData = Object.entries(
  products.reduce<Record<string, number>>((acc, p) => {
    acc[p.brand] = (acc[p.brand] ?? 0) + 1; return acc
  }, {})
).sort((a, b) => b[1] - a[1]).slice(0, 6)

// Radar: category health (normalised)
const maxStock = Math.max(...stockByCategory.map(s => s.stock))
const radarData = stockByCategory.map(s => ({
  category: s.name,
  Stock: Math.round((s.stock / maxStock) * 100),
  Products: Math.round((categoryData.find(c => c.name === s.name)?.value ?? 0) / totalProducts * 100),
}))

// Simulated "monthly" trend (split products across 6 months by id hash)
const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
const trendData = months.map((month, i) => ({
  month,
  products: Math.round(totalProducts * (0.55 + i * 0.07 + Math.sin(i) * 0.04)),
  stock: Math.round(totalStock * (0.50 + i * 0.08 + Math.cos(i) * 0.03)),
}))

/* ─── Colour palette ───────────────────────── */
const PALETTE = ['#1f2937', '#6b7280', '#9ca3af', '#d1d5db', '#374151', '#4b5563']
const CAT_COLORS: Record<string, string> = {
  Fashion: '#1f2937',
  Beauty: '#9ca3af',
  'Home & Living': '#d1d5db',
}

/* ─── Tiny reusable components ─────────────── */
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-100 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="px-5 py-4 border-b border-gray-50">
    <h3 className="text-[18px] font-semibold text-gray-800">{title}</h3>
    {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
  </div>
)

const customTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #f3f4f6',
  borderRadius: '8px',
  fontSize: '11px',
  color: '#374151',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

/* ─── Page ─────────────────────────────────── */
const Analytics = () => {
  const [lowStockPage, setLowStockPage] = useState(1)
  const LOW_STOCK_PAGE_SIZE = 8
  const lowStockTotalPages = Math.max(1, Math.ceil(lowStockRows.length / LOW_STOCK_PAGE_SIZE))
  const lowStockCurrentPage = Math.min(lowStockPage, lowStockTotalPages)
  const lowStockPaginated = useMemo(
    () => lowStockRows.slice(
      (lowStockCurrentPage - 1) * LOW_STOCK_PAGE_SIZE,
      lowStockCurrentPage * LOW_STOCK_PAGE_SIZE
    ),
    [lowStockCurrentPage]
  )
  const lowStockRangeStart = lowStockRows.length === 0 ? 0 : (lowStockCurrentPage - 1) * LOW_STOCK_PAGE_SIZE + 1
  const lowStockRangeEnd = Math.min(lowStockCurrentPage * LOW_STOCK_PAGE_SIZE, lowStockRows.length)

  const kpis = [
    {
      label: 'Total Products', value: totalProducts, icon: <Package size={16} />,
      sub: `${categoryData.length} categories`, trend: 'up', color: 'text-blue-600', bg: 'bg-blue-50',
    },
    {
      label: 'Total Stock Units', value: fmt(totalStock), icon: <TrendingUp size={16} />,
      sub: `${lowStockProducts.length} low-stock items`, trend: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50',
    },
    {
      label: 'Inventory Value', value: '₹' + fmt(totalInventoryValue), icon: <DollarSign size={16} />,
      sub: 'Stock × price', trend: 'up', color: 'text-violet-600', bg: 'bg-violet-50',
    },
    {
      label: 'Avg. Rating', value: avgRating.toFixed(2) + ' / 5', icon: <Star size={16} />,
      sub: `Across ${totalProducts} products`, trend: avgRating >= 4 ? 'up' : 'down',
      color: 'text-amber-600', bg: 'bg-amber-50',
    },
    {
      label: 'Low Stock Alerts', value: lowStockProducts.length, icon: <AlertTriangle size={16} />,
      sub: 'Stock < 10 units', trend: 'down', color: 'text-red-600', bg: 'bg-red-50',
    },
    {
      label: 'Unique Brands', value: brandData.length, icon: <TrendingDown size={16} />,
      sub: `${topValue[0]?.name} top value`, trend: 'up', color: 'text-pink-600', bg: 'bg-pink-50',
    },
  ]

  return (
    <MainLayout>
      <div className="w-full px-4 sm:px-8 py-6 space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-[1.5rem] sm:text-[1.9rem] font-semibold tracking-tight text-gray-900">
            Analytics
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Inventory & catalogue insights · {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map(k => (
            <Card key={k.label} className="p-4 flex flex-col gap-2.5 hover:shadow-md hover:-translate-y-[1px] transition-all">
              <div className={`${k.bg} ${k.color} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                {k.icon}
              </div>
              <div>
                <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 leading-tight">{k.label}</p>
                <p className="text-[1.15rem] font-semibold tracking-tight text-gray-900 leading-tight mt-0.5">
                  {k.value}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{k.sub}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Row 1: Trend + Category Pie ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Inventory trend (area) */}
          <Card className="lg:col-span-2">
            <CardHeader title="Catalogue Growth" sub="Products & stock trend (last 6 months, simulated)" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1f2937" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1f2937" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gProducts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Area type="monotone" dataKey="stock" name="Stock" stroke="#1f2937" strokeWidth={2} fill="url(#gStock)" dot={false} />
                  <Area type="monotone" dataKey="products" name="Products" stroke="#9ca3af" strokeWidth={1.5} fill="url(#gProducts)" dot={false} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Pie */}
          <Card>
            <CardHeader title="By Category" sub="Product count distribution" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    dataKey="value" nameKey="name" paddingAngle={3}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CAT_COLORS[entry.name] ?? '#e5e7eb'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── Row 2: Subcategory bar + Price range ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Subcategory bar */}
          <Card>
            <CardHeader title="Top Subcategories" sub="Product count per subcategory" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={subcategoryData} layout="vertical"
                  margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={110}
                    tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="count" name="Products" fill="#1f2937" radius={[0, 3, 3, 0]} maxBarSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Price range by category */}
          <Card>
            <CardHeader title="Price Range by Category" sub="Min / Avg / Max price (₹)" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={priceByCategory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                    tickFormatter={v => '₹' + fmt(v)} width={56} />
                  {/* <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => '₹' + fmt(v)} /> */}
                  <Tooltip
                    contentStyle={customTooltipStyle}
                    formatter={(v) => '₹' + fmt(Number(v ?? 0))}
                  />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
                  <Bar dataKey="min" name="Min" fill="#d1d5db" radius={[3, 3, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="avg" name="Avg" fill="#6b7280" radius={[3, 3, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="max" name="Max" fill="#1f2937" radius={[3, 3, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── Row 3: Stock bar + Radar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Stock by category bar */}
          <Card>
            <CardHeader title="Stock Units by Category" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stockByCategory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  {stockByCategory.map((entry, i) => (
                    <Bar key={entry.name} dataKey="stock" name="Stock" fill={PALETTE[i]} radius={[4, 4, 0, 0]} maxBarSize={48} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Radar: category health */}
          <Card>
            <CardHeader title="Category Health" sub="Relative stock & product distribution (%)" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f3f4f6" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Radar name="Stock %" dataKey="Stock" stroke="#1f2937" fill="#1f2937" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Products %" dataKey="Products" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── Row 4: Rating dist + Top stocked ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Rating distribution */}
          <Card>
            <CardHeader title="Rating Distribution" sub="Number of products per star rating" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={ratingDist} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {ratingDist.map((_, i) => (
                      <Cell key={i} fill={['#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top stocked */}
          <Card>
            <CardHeader title="Most Stocked Products" sub="Top 6 by total units" />
            <div className="px-5 py-4 space-y-3">
              {topStocked.map((p, i) => {
                const pct = Math.round((p.stock / topStocked[0].stock) * 100)
                return (
                  <div key={p.name}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-gray-300 w-4 shrink-0">{i + 1}</span>
                        <span className="text-gray-700 font-medium truncate max-w-[180px]">{p.name}</span>
                        <span className="text-[10px] text-gray-400 hidden sm:inline shrink-0">{p.category}</span>
                      </div>
                      <span className="text-gray-600 font-semibold shrink-0">{fmt(p.stock)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-800 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* ── Row 5: Top value + Brand breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top inventory value */}
          <Card>
            <CardHeader title="Highest Inventory Value" sub="Stock × selling price (₹)" />
            <div className="px-5 py-4 space-y-3.5">
              {topValue.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-300 w-4 shrink-0">{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-8 h-9 object-cover rounded-lg bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-gray-700 font-medium truncate">{p.name}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gray-700 rounded-full"
                        style={{ width: `${Math.round((p.value / topValue[0].value) * 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-gray-800 shrink-0">₹{fmt(p.value)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Brands */}
          <Card>
            <CardHeader title="Brand Distribution" sub="Products per brand (top 6)" />
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={brandData.map(([name, count]) => ({ name, count }))}
                  margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="count" name="Products" fill="#4b5563" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {brandData.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* ── Low stock table ── */}
        {lowStockRows.length > 0 && (
          <Card>
            <CardHeader title="Low Stock Products"
              sub={`${lowStockProducts.length} products with at least one variant < 10 units`} />
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['Product', 'Category', 'Brand', 'Variant', 'Stock', 'Price'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium first:pl-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {lowStockPaginated.map(row => (
                    <tr key={row.key} className="hover:bg-red-50/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={row.image} alt={row.name}
                            className="w-8 h-9 object-cover rounded-lg bg-gray-100 shrink-0" />
                          <span className="text-gray-800 font-medium truncate max-w-[140px]">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{row.subcategory}</td>
                      <td className="px-5 py-3 text-gray-500">{row.brand}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border border-gray-200"
                            style={{ background: row.colorCode }} />
                          <span className="text-gray-600">{row.color} · {row.size}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={9} />
                          {row.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-medium">₹{fmt(row.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-wrap gap-3">
              <p className="text-[11px] text-gray-400">
                Showing <span className="text-gray-700 font-medium">{lowStockRangeStart}–{lowStockRangeEnd}</span> of {lowStockRows.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLowStockPage(p => Math.max(1, p - 1))}
                  disabled={lowStockCurrentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors rounded-lg"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: lowStockTotalPages }, (_, i) => i + 1)
                  .filter(n =>
                    n === 1 || n === lowStockTotalPages || Math.abs(n - lowStockCurrentPage) <= 1
                  )
                  .reduce<(number | 'ellipsis')[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('ellipsis')
                    acc.push(n)
                    return acc
                  }, [])
                  .map((n, i) =>
                    n === 'ellipsis' ? (
                      <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-gray-300 text-[12px]">…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setLowStockPage(n)}
                        className={`w-8 h-8 flex items-center justify-center text-[11px] font-medium rounded-lg border transition-colors ${n === lowStockCurrentPage
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        {n}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setLowStockPage(p => Math.min(lowStockTotalPages, p + 1))}
                  disabled={lowStockCurrentPage === lowStockTotalPages}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors rounded-lg"
                  aria-label="Next page"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </Card>
        )}

      </div>
    </MainLayout>
  )
}

export default Analytics

// import MainLayout from '../component/layout'
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend,
//   RadarChart, Radar, PolarGrid, PolarAngleAxis,
//   AreaChart, Area, CartesianGrid,
// } from 'recharts'
// import { TrendingUp, TrendingDown, Package, Star, AlertTriangle, DollarSign } from 'lucide-react'
// import products from '../../data/products.json'

// /* ─── Data derivations ─────────────────────── */

// const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(Math.round(n))

// const totalProducts = products.length

// const totalStock = products.reduce((s, p) =>
//   s + p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0), 0)

// const totalInventoryValue = products.reduce((s, p) =>
//   s + p.variants.reduce((vs, v) =>
//     vs + v.sizes.reduce((ss, sz) => ss + sz.stock * sz.price, 0), 0), 0)

// const avgRating = products.reduce((s, p) => s + p.rating, 0) / products.length

// const lowStockProducts = products.filter(p =>
//   p.variants.some(v => v.sizes.some(s => s.stock < 10)))

// // Products per category
// const categoryData = Object.entries(
//   products.reduce<Record<string, number>>((acc, p) => {
//     acc[p.category] = (acc[p.category] ?? 0) + 1; return acc
//   }, {})
// ).map(([name, value]) => ({ name, value }))

// // Products per subcategory (top 8)
// const subcategoryData = Object.entries(
//   products.reduce<Record<string, number>>((acc, p) => {
//     acc[p.subcategory] = (acc[p.subcategory] ?? 0) + 1; return acc
//   }, {})
// ).sort((a, b) => b[1] - a[1]).slice(0, 8)
//   .map(([name, count]) => ({ name, count }))

// // Stock per category
// const stockByCategory = Object.entries(
//   products.reduce<Record<string, number>>((acc, p) => {
//     const stock = p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0)
//     acc[p.category] = (acc[p.category] ?? 0) + stock; return acc
//   }, {})
// ).map(([name, stock]) => ({ name, stock }))

// // Avg price per category
// const priceByCategory = Object.entries(
//   products.reduce<Record<string, number[]>>((acc, p) => {
//     const price = p.variants[0].sizes[0].price
//     if (!acc[p.category]) acc[p.category] = []
//     acc[p.category].push(price); return acc
//   }, {})
// ).map(([cat, prices]) => ({
//   name: cat,
//   avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
//   min: Math.min(...prices),
//   max: Math.max(...prices),
// }))

// // Rating distribution
// const ratingDist = [5, 4, 3, 2, 1].map(r => ({
//   label: `${r}★`,
//   count: products.filter(p => Math.floor(p.rating) === r).length,
// }))

// // Top 5 most stocked products
// const topStocked = [...products]
//   .map(p => ({
//     name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
//     stock: p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0),
//     category: p.category,
//   }))
//   .sort((a, b) => b.stock - a.stock)
//   .slice(0, 6)

// // Top 5 most valuable (stock * price)
// const topValue = [...products]
//   .map(p => ({
//     name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
//     value: p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock * sz.price, 0), 0),
//     image: p.variants[0].images[0],
//   }))
//   .sort((a, b) => b.value - a.value)
//   .slice(0, 5)

// // Brands breakdown
// const brandData = Object.entries(
//   products.reduce<Record<string, number>>((acc, p) => {
//     acc[p.brand] = (acc[p.brand] ?? 0) + 1; return acc
//   }, {})
// ).sort((a, b) => b[1] - a[1]).slice(0, 6)

// // Radar: category health (normalised)
// const maxStock = Math.max(...stockByCategory.map(s => s.stock))
// const radarData = stockByCategory.map(s => ({
//   category: s.name,
//   Stock: Math.round((s.stock / maxStock) * 100),
//   Products: Math.round((categoryData.find(c => c.name === s.name)?.value ?? 0) / totalProducts * 100),
// }))

// // Simulated "monthly" trend (split products across 6 months by id hash)
// const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
// const trendData = months.map((month, i) => ({
//   month,
//   products: Math.round(totalProducts * (0.55 + i * 0.07 + Math.sin(i) * 0.04)),
//   stock: Math.round(totalStock * (0.50 + i * 0.08 + Math.cos(i) * 0.03)),
// }))

// /* ─── Colour palette ───────────────────────── */
// const PALETTE = ['#1f2937', '#6b7280', '#9ca3af', '#d1d5db', '#374151', '#4b5563']
// const CAT_COLORS: Record<string, string> = {
//   Fashion: '#1f2937',
//   Beauty: '#9ca3af',
//   'Home & Living': '#d1d5db',
// }

// /* ─── Tiny reusable components ─────────────── */
// const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
//   <div className={`bg-white border border-gray-100 rounded-xl shadow-sm ${className}`}>
//     {children}
//   </div>
// )

// const CardHeader = ({ title, sub }: { title: string; sub?: string }) => (
//   <div className="px-5 py-4 border-b border-gray-50">
//     <h3 className="text-[13px] font-semibold text-gray-800">{title}</h3>
//     {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
//   </div>
// )

// const customTooltipStyle = {
//   backgroundColor: '#fff',
//   border: '1px solid #f3f4f6',
//   borderRadius: '8px',
//   fontSize: '11px',
//   color: '#374151',
//   boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
// }

// /* ─── Page ─────────────────────────────────── */
// const Analytics = () => {
//   const kpis = [
//     {
//       label: 'Total Products', value: totalProducts, icon: <Package size={16} />,
//       sub: `${categoryData.length} categories`, trend: 'up', color: 'text-blue-600', bg: 'bg-blue-50',
//     },
//     {
//       label: 'Total Stock Units', value: fmt(totalStock), icon: <TrendingUp size={16} />,
//       sub: `${lowStockProducts.length} low-stock items`, trend: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50',
//     },
//     {
//       label: 'Inventory Value', value: '₹' + fmt(totalInventoryValue), icon: <DollarSign size={16} />,
//       sub: 'Stock × price', trend: 'up', color: 'text-violet-600', bg: 'bg-violet-50',
//     },
//     {
//       label: 'Avg. Rating', value: avgRating.toFixed(2) + ' / 5', icon: <Star size={16} />,
//       sub: `Across ${totalProducts} products`, trend: avgRating >= 4 ? 'up' : 'down',
//       color: 'text-amber-600', bg: 'bg-amber-50',
//     },
//     {
//       label: 'Low Stock Alerts', value: lowStockProducts.length, icon: <AlertTriangle size={16} />,
//       sub: 'Stock < 10 units', trend: 'down', color: 'text-red-600', bg: 'bg-red-50',
//     },
//     {
//       label: 'Unique Brands', value: brandData.length, icon: <TrendingDown size={16} />,
//       sub: `${topValue[0]?.name} top value`, trend: 'up', color: 'text-pink-600', bg: 'bg-pink-50',
//     },
//   ]

//   return (
//     <MainLayout>
//       <div className="w-full px-4 sm:px-8 py-6 space-y-6">

//         {/* Title */}
//         <div>
//           <h1 className="text-[1.5rem] sm:text-[1.9rem] font-semibold tracking-tight text-gray-900">
//             Analytics
//           </h1>
//           <p className="text-[12px] text-gray-400 mt-0.5">
//             Inventory & catalogue insights · {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
//           </p>
//         </div>

//         {/* ── KPI Cards ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//           {kpis.map(k => (
//             <Card key={k.label} className="p-4 flex flex-col gap-2.5 hover:shadow-md hover:-translate-y-[1px] transition-all">
//               <div className={`${k.bg} ${k.color} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
//                 {k.icon}
//               </div>
//               <div>
//                 <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 leading-tight">{k.label}</p>
//                 <p className="text-[1.15rem] font-semibold tracking-tight text-gray-900 leading-tight mt-0.5">
//                   {k.value}
//                 </p>
//                 <p className="text-[10px] text-gray-400 mt-0.5">{k.sub}</p>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {/* ── Row 1: Trend + Category Pie ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//           {/* Inventory trend (area) */}
//           <Card className="lg:col-span-2">
//             <CardHeader title="Catalogue Growth" sub="Products & stock trend (last 6 months, simulated)" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={220}>
//                 <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
//                   <defs>
//                     <linearGradient id="gStock" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#1f2937" stopOpacity={0.15} />
//                       <stop offset="95%" stopColor="#1f2937" stopOpacity={0} />
//                     </linearGradient>
//                     <linearGradient id="gProducts" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
//                       <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                   <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={36} />
//                   <Tooltip contentStyle={customTooltipStyle} />
//                   <Area type="monotone" dataKey="stock" name="Stock" stroke="#1f2937" strokeWidth={2} fill="url(#gStock)" dot={false} />
//                   <Area type="monotone" dataKey="products" name="Products" stroke="#9ca3af" strokeWidth={1.5} fill="url(#gProducts)" dot={false} strokeDasharray="4 2" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>

//           {/* Category Pie */}
//           <Card>
//             <CardHeader title="By Category" sub="Product count distribution" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={220}>
//                 <PieChart>
//                   <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
//                     dataKey="value" nameKey="name" paddingAngle={3}>
//                     {categoryData.map((entry) => (
//                       <Cell key={entry.name} fill={CAT_COLORS[entry.name] ?? '#e5e7eb'} />
//                     ))}
//                   </Pie>
//                   <Tooltip contentStyle={customTooltipStyle} />
//                   <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </div>

//         {/* ── Row 2: Subcategory bar + Price range ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//           {/* Subcategory bar */}
//           <Card>
//             <CardHeader title="Top Subcategories" sub="Product count per subcategory" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={240}>
//                 <BarChart data={subcategoryData} layout="vertical"
//                   margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
//                   <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//                   <YAxis type="category" dataKey="name" width={110}
//                     tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
//                   <Tooltip contentStyle={customTooltipStyle} />
//                   <Bar dataKey="count" name="Products" fill="#1f2937" radius={[0, 3, 3, 0]} maxBarSize={14} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>

//           {/* Price range by category */}
//           <Card>
//             <CardHeader title="Price Range by Category" sub="Min / Avg / Max price (₹)" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={240}>
//                 <BarChart data={priceByCategory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
//                   <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
//                     tickFormatter={v => '₹' + fmt(v)} width={56} />
//                   <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => '₹' + fmt(v)} />
//                   <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
//                   <Bar dataKey="min" name="Min" fill="#d1d5db" radius={[3, 3, 0, 0]} maxBarSize={32} />
//                   <Bar dataKey="avg" name="Avg" fill="#6b7280" radius={[3, 3, 0, 0]} maxBarSize={32} />
//                   <Bar dataKey="max" name="Max" fill="#1f2937" radius={[3, 3, 0, 0]} maxBarSize={32} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </div>

//         {/* ── Row 3: Stock bar + Radar ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//           {/* Stock by category bar */}
//           <Card>
//             <CardHeader title="Stock Units by Category" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart data={stockByCategory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
//                   <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
//                   <Tooltip contentStyle={customTooltipStyle} />
//                   {stockByCategory.map((entry, i) => (
//                     <Bar key={entry.name} dataKey="stock" name="Stock" fill={PALETTE[i]} radius={[4, 4, 0, 0]} maxBarSize={48} />
//                   ))}
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>

//           {/* Radar: category health */}
//           <Card>
//             <CardHeader title="Category Health" sub="Relative stock & product distribution (%)" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={200}>
//                 <RadarChart data={radarData}>
//                   <PolarGrid stroke="#f3f4f6" />
//                   <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#6b7280' }} />
//                   <Radar name="Stock %" dataKey="Stock" stroke="#1f2937" fill="#1f2937" fillOpacity={0.15} strokeWidth={2} />
//                   <Radar name="Products %" dataKey="Products" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
//                   <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
//                   <Tooltip contentStyle={customTooltipStyle} />
//                 </RadarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </div>

//         {/* ── Row 4: Rating dist + Top stocked ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//           {/* Rating distribution */}
//           <Card>
//             <CardHeader title="Rating Distribution" sub="Number of products per star rating" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={190}>
//                 <BarChart data={ratingDist} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
//                   <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
//                   <Tooltip contentStyle={customTooltipStyle} />
//                   <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]} maxBarSize={40}>
//                     {ratingDist.map((_, i) => (
//                       <Cell key={i} fill={['#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db'][i]} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>

//           {/* Top stocked */}
//           <Card>
//             <CardHeader title="Most Stocked Products" sub="Top 6 by total units" />
//             <div className="px-5 py-4 space-y-3">
//               {topStocked.map((p, i) => {
//                 const pct = Math.round((p.stock / topStocked[0].stock) * 100)
//                 return (
//                   <div key={p.name}>
//                     <div className="flex justify-between text-[12px] mb-1">
//                       <div className="flex items-center gap-2 min-w-0">
//                         <span className="text-[10px] font-mono text-gray-300 w-4 shrink-0">{i + 1}</span>
//                         <span className="text-gray-700 font-medium truncate max-w-[180px]">{p.name}</span>
//                         <span className="text-[10px] text-gray-400 hidden sm:inline shrink-0">{p.category}</span>
//                       </div>
//                       <span className="text-gray-600 font-semibold shrink-0">{fmt(p.stock)}</span>
//                     </div>
//                     <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-gray-800 rounded-full transition-all duration-700"
//                         style={{ width: `${pct}%` }} />
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </Card>
//         </div>

//         {/* ── Row 5: Top value + Brand breakdown ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//           {/* Top inventory value */}
//           <Card>
//             <CardHeader title="Highest Inventory Value" sub="Stock × selling price (₹)" />
//             <div className="px-5 py-4 space-y-3.5">
//               {topValue.map((p, i) => (
//                 <div key={p.name} className="flex items-center gap-3">
//                   <span className="text-[10px] font-mono text-gray-300 w-4 shrink-0">{i + 1}</span>
//                   <img src={p.image} alt={p.name} className="w-8 h-9 object-cover rounded-lg bg-gray-100 shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[12px] text-gray-700 font-medium truncate">{p.name}</p>
//                     <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
//                       <div className="h-full bg-gray-700 rounded-full"
//                         style={{ width: `${Math.round((p.value / topValue[0].value) * 100)}%` }} />
//                     </div>
//                   </div>
//                   <span className="text-[12px] font-semibold text-gray-800 shrink-0">₹{fmt(p.value)}</span>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Brands */}
//           <Card>
//             <CardHeader title="Brand Distribution" sub="Products per brand (top 6)" />
//             <div className="p-4">
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart data={brandData.map(([name, count]) => ({ name, count }))}
//                   margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
//                   <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
//                   <Tooltip contentStyle={customTooltipStyle} />
//                   <Bar dataKey="count" name="Products" fill="#4b5563" radius={[4, 4, 0, 0]} maxBarSize={36}>
//                     {brandData.map((_, i) => (
//                       <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>

//         </div>

//         {/* ── Low stock table ── */}
//         {lowStockProducts.length > 0 && (
//           <Card>
//             <CardHeader title="Low Stock Products"
//               sub={`${lowStockProducts.length} products with at least one variant < 10 units`} />
//             <div className="overflow-x-auto">
//               <table className="w-full text-[13px]">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/60">
//                     {['Product', 'Category', 'Brand', 'Variant', 'Stock', 'Price'].map(h => (
//                       <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium first:pl-5">
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {lowStockProducts.flatMap(p =>
//                     p.variants.flatMap(v =>
//                       v.sizes
//                         .filter(s => s.stock < 10)
//                         .map(s => (
//                           <tr key={s.sku} className="hover:bg-red-50/30 transition-colors">
//                             <td className="px-5 py-3">
//                               <div className="flex items-center gap-2.5">
//                                 <img src={v.images[0]} alt={p.name}
//                                   className="w-8 h-9 object-cover rounded-lg bg-gray-100 shrink-0" />
//                                 <span className="text-gray-800 font-medium truncate max-w-[140px]">{p.name}</span>
//                               </div>
//                             </td>
//                             <td className="px-5 py-3 text-gray-500">{p.subcategory}</td>
//                             <td className="px-5 py-3 text-gray-500">{p.brand}</td>
//                             <td className="px-5 py-3">
//                               <div className="flex items-center gap-1.5">
//                                 <span className="w-3 h-3 rounded-full border border-gray-200"
//                                   style={{ background: v.colorCode }} />
//                                 <span className="text-gray-600">{v.color} · {s.size}</span>
//                               </div>
//                             </td>
//                             <td className="px-5 py-3">
//                               <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
//                                 <AlertTriangle size={9} />
//                                 {s.stock}
//                               </span>
//                             </td>
//                             <td className="px-5 py-3 text-gray-700 font-medium">₹{fmt(s.price)}</td>
//                           </tr>
//                         ))
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </Card>
//         )}

//       </div>
//     </MainLayout>
//   )
// }

// export default Analytics

// // import MainLayout from '../component/layout'
// // import {
// //   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
// //   PieChart, Pie, Cell, Legend,
// //   RadarChart, Radar, PolarGrid, PolarAngleAxis,
// //   AreaChart, Area, CartesianGrid,
// // } from 'recharts'
// // import { TrendingUp, TrendingDown, Package, Star, AlertTriangle, DollarSign } from 'lucide-react'
// // import products from '../../data/products.json'

// // /* ─── Data derivations ─────────────────────── */

// // const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(Math.round(n))

// // const totalProducts = products.length

// // const totalStock = products.reduce((s, p) =>
// //   s + p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0), 0)

// // const totalInventoryValue = products.reduce((s, p) =>
// //   s + p.variants.reduce((vs, v) =>
// //     vs + v.sizes.reduce((ss, sz) => ss + sz.stock * sz.price, 0), 0), 0)

// // const avgRating = products.reduce((s, p) => s + p.rating, 0) / products.length

// // const lowStockProducts = products.filter(p =>
// //   p.variants.some(v => v.sizes.some(s => s.stock < 10)))

// // // Products per category
// // const categoryData = Object.entries(
// //   products.reduce<Record<string, number>>((acc, p) => {
// //     acc[p.category] = (acc[p.category] ?? 0) + 1; return acc
// //   }, {})
// // ).map(([name, value]) => ({ name, value }))

// // // Products per subcategory (top 8)
// // const subcategoryData = Object.entries(
// //   products.reduce<Record<string, number>>((acc, p) => {
// //     acc[p.subcategory] = (acc[p.subcategory] ?? 0) + 1; return acc
// //   }, {})
// // ).sort((a, b) => b[1] - a[1]).slice(0, 8)
// //   .map(([name, count]) => ({ name, count }))

// // // Stock per category
// // const stockByCategory = Object.entries(
// //   products.reduce<Record<string, number>>((acc, p) => {
// //     const stock = p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0)
// //     acc[p.category] = (acc[p.category] ?? 0) + stock; return acc
// //   }, {})
// // ).map(([name, stock]) => ({ name, stock }))

// // // Avg price per category
// // const priceByCategory = Object.entries(
// //   products.reduce<Record<string, number[]>>((acc, p) => {
// //     const price = p.variants[0].sizes[0].price
// //     if (!acc[p.category]) acc[p.category] = []
// //     acc[p.category].push(price); return acc
// //   }, {})
// // ).map(([cat, prices]) => ({
// //   name: cat,
// //   avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
// //   min: Math.min(...prices),
// //   max: Math.max(...prices),
// // }))

// // // Rating distribution
// // const ratingDist = [5, 4, 3, 2, 1].map(r => ({
// //   label: `${r}★`,
// //   count: products.filter(p => Math.floor(p.rating) === r).length,
// // }))

// // // Top 5 most stocked products
// // const topStocked = [...products]
// //   .map(p => ({
// //     name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
// //     stock: p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0),
// //     category: p.category,
// //   }))
// //   .sort((a, b) => b.stock - a.stock)
// //   .slice(0, 6)

// // // Top 5 most valuable (stock * price)
// // const topValue = [...products]
// //   .map(p => ({
// //     name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
// //     value: p.variants.reduce((vs, v) => vs + v.sizes.reduce((ss, sz) => ss + sz.stock * sz.price, 0), 0),
// //     image: p.variants[0].images[0],
// //   }))
// //   .sort((a, b) => b.value - a.value)
// //   .slice(0, 5)

// // // Brands breakdown
// // const brandData = Object.entries(
// //   products.reduce<Record<string, number>>((acc, p) => {
// //     acc[p.brand] = (acc[p.brand] ?? 0) + 1; return acc
// //   }, {})
// // ).sort((a, b) => b[1] - a[1]).slice(0, 6)

// // // Radar: category health (normalised)
// // const maxStock = Math.max(...stockByCategory.map(s => s.stock))
// // const radarData = stockByCategory.map(s => ({
// //   category: s.name,
// //   Stock: Math.round((s.stock / maxStock) * 100),
// //   Products: Math.round((categoryData.find(c => c.name === s.name)?.value ?? 0) / totalProducts * 100),
// // }))

// // // Simulated "monthly" trend (split products across 6 months by id hash)
// // const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
// // const trendData = months.map((month, i) => ({
// //   month,
// //   products: Math.round(totalProducts * (0.55 + i * 0.07 + Math.sin(i) * 0.04)),
// //   stock: Math.round(totalStock * (0.50 + i * 0.08 + Math.cos(i) * 0.03)),
// // }))

// // /* ─── Colour palette ───────────────────────── */
// // const PALETTE = ['#1f2937', '#6b7280', '#9ca3af', '#d1d5db', '#374151', '#4b5563']
// // const CAT_COLORS: Record<string, string> = {
// //   Fashion: '#1f2937',
// //   Beauty: '#9ca3af',
// //   'Home & Living': '#d1d5db',
// // }

// // /* ─── Tiny reusable components ─────────────── */
// // const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
// //   <div className={`bg-white border border-gray-100 rounded-sm shadow-sm ${className}`}>
// //     {children}
// //   </div>
// // )

// // const CardHeader = ({ title, sub }: { title: string; sub?: string }) => (
// //   <div className="px-5 py-4 border-b border-gray-50">
// //     <h3 className="text-[13px] font-semibold text-gray-700">{title}</h3>
// //     {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
// //   </div>
// // )

// // const customTooltipStyle = {
// //   backgroundColor: '#fff',
// //   border: '1px solid #f3f4f6',
// //   borderRadius: '4px',
// //   fontSize: '11px',
// //   color: '#374151',
// //   boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
// // }

// // /* ─── Page ─────────────────────────────────── */
// // const Analytics = () => {
// //   const kpis = [
// //     {
// //       label: 'Total Products', value: totalProducts, icon: <Package size={16} />,
// //       sub: `${categoryData.length} categories`, trend: 'up', color: 'text-blue-600', bg: 'bg-blue-50',
// //     },
// //     {
// //       label: 'Total Stock Units', value: fmt(totalStock), icon: <TrendingUp size={16} />,
// //       sub: `${lowStockProducts.length} low-stock items`, trend: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50',
// //     },
// //     {
// //       label: 'Inventory Value', value: '₹' + fmt(totalInventoryValue), icon: <DollarSign size={16} />,
// //       sub: 'Stock × price', trend: 'up', color: 'text-violet-600', bg: 'bg-violet-50',
// //     },
// //     {
// //       label: 'Avg. Rating', value: avgRating.toFixed(2) + ' / 5', icon: <Star size={16} />,
// //       sub: `Across ${totalProducts} products`, trend: avgRating >= 4 ? 'up' : 'down',
// //       color: 'text-amber-600', bg: 'bg-amber-50',
// //     },
// //     {
// //       label: 'Low Stock Alerts', value: lowStockProducts.length, icon: <AlertTriangle size={16} />,
// //       sub: 'Stock < 10 units', trend: 'down', color: 'text-red-600', bg: 'bg-red-50',
// //     },
// //     {
// //       label: 'Unique Brands', value: brandData.length, icon: <TrendingDown size={16} />,
// //       sub: `${topValue[0]?.name} top value`, trend: 'up', color: 'text-pink-600', bg: 'bg-pink-50',
// //     },
// //   ]

// //   return (
// //     <MainLayout>
// //         <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-6">

// //           {/* Title */}
// //           <div>
// //             <h1 className="text-[1.4rem] sm:text-[1.8rem] font-normal text-gray-900"
// //               style={{ fontFamily: "'Playfair Display', serif" }}>
// //               Analytics
// //             </h1>
// //             <p className="text-[12px] text-gray-400 mt-0.5">
// //               Inventory & catalogue insights · {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
// //             </p>
// //           </div>

// //           {/* ── KPI Cards ── */}
// //           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
// //             {kpis.map(k => (
// //               <Card key={k.label} className="p-4 flex flex-col gap-2.5">
// //                 <div className={`${k.bg} ${k.color} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
// //                   {k.icon}
// //                 </div>
// //                 <div>
// //                   <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 leading-tight">{k.label}</p>
// //                   <p className="text-[1.1rem] font-normal text-gray-900 leading-tight mt-0.5"
// //                     style={{ fontFamily: "'Playfair Display', serif" }}>
// //                     {k.value}
// //                   </p>
// //                   <p className="text-[10px] text-gray-400 mt-0.5">{k.sub}</p>
// //                 </div>
// //               </Card>
// //             ))}
// //           </div>

// //           {/* ── Row 1: Trend + Category Pie ── */}
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

// //             {/* Inventory trend (area) */}
// //             <Card className="lg:col-span-2">
// //               <CardHeader title="Catalogue Growth" sub="Products & stock trend (last 6 months, simulated)" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={220}>
// //                   <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
// //                     <defs>
// //                       <linearGradient id="gStock" x1="0" y1="0" x2="0" y2="1">
// //                         <stop offset="5%" stopColor="#1f2937" stopOpacity={0.15} />
// //                         <stop offset="95%" stopColor="#1f2937" stopOpacity={0} />
// //                       </linearGradient>
// //                       <linearGradient id="gProducts" x1="0" y1="0" x2="0" y2="1">
// //                         <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
// //                         <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
// //                       </linearGradient>
// //                     </defs>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
// //                     <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
// //                     <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={36} />
// //                     <Tooltip contentStyle={customTooltipStyle} />
// //                     <Area type="monotone" dataKey="stock" name="Stock" stroke="#1f2937" strokeWidth={2} fill="url(#gStock)" dot={false} />
// //                     <Area type="monotone" dataKey="products" name="Products" stroke="#9ca3af" strokeWidth={1.5} fill="url(#gProducts)" dot={false} strokeDasharray="4 2" />
// //                   </AreaChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>

// //             {/* Category Pie */}
// //             <Card>
// //               <CardHeader title="By Category" sub="Product count distribution" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={220}>
// //                   <PieChart>
// //                     <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
// //                       dataKey="value" nameKey="name" paddingAngle={3}>
// //                       {categoryData.map((entry) => (
// //                         <Cell key={entry.name} fill={CAT_COLORS[entry.name] ?? '#e5e7eb'} />
// //                       ))}
// //                     </Pie>
// //                     <Tooltip contentStyle={customTooltipStyle} />
// //                     <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>
// //           </div>

// //           {/* ── Row 2: Subcategory bar + Price range ── */}
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

// //             {/* Subcategory bar */}
// //             <Card>
// //               <CardHeader title="Top Subcategories" sub="Product count per subcategory" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={240}>
// //                   <BarChart data={subcategoryData} layout="vertical"
// //                     margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
// //                     <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
// //                     <YAxis type="category" dataKey="name" width={110}
// //                       tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
// //                     <Tooltip contentStyle={customTooltipStyle} />
// //                     <Bar dataKey="count" name="Products" fill="#1f2937" radius={[0, 3, 3, 0]} maxBarSize={14} />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>

// //             {/* Price range by category */}
// //             <Card>
// //               <CardHeader title="Price Range by Category" sub="Min / Avg / Max price (₹)" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={240}>
// //                   <BarChart data={priceByCategory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
// //                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
// //                     <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
// //                       tickFormatter={v => '₹' + fmt(v)} width={56} />
// //                     <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => '₹' + fmt(v)} />
// //                     <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
// //                     <Bar dataKey="min" name="Min" fill="#d1d5db" radius={[3, 3, 0, 0]} maxBarSize={32} />
// //                     <Bar dataKey="avg" name="Avg" fill="#6b7280" radius={[3, 3, 0, 0]} maxBarSize={32} />
// //                     <Bar dataKey="max" name="Max" fill="#1f2937" radius={[3, 3, 0, 0]} maxBarSize={32} />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>
// //           </div>

// //           {/* ── Row 3: Stock bar + Radar ── */}
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

// //             {/* Stock by category bar */}
// //             <Card>
// //               <CardHeader title="Stock Units by Category" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={200}>
// //                   <BarChart data={stockByCategory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
// //                     <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
// //                     <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
// //                     <Tooltip contentStyle={customTooltipStyle} />
// //                     {stockByCategory.map((entry, i) => (
// //                       <Bar key={entry.name} dataKey="stock" name="Stock" fill={PALETTE[i]} radius={[4, 4, 0, 0]} maxBarSize={48} />
// //                     ))}
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>

// //             {/* Radar: category health */}
// //             <Card>
// //               <CardHeader title="Category Health" sub="Relative stock & product distribution (%)" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={200}>
// //                   <RadarChart data={radarData}>
// //                     <PolarGrid stroke="#f3f4f6" />
// //                     <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#6b7280' }} />
// //                     <Radar name="Stock %" dataKey="Stock" stroke="#1f2937" fill="#1f2937" fillOpacity={0.15} strokeWidth={2} />
// //                     <Radar name="Products %" dataKey="Products" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
// //                     <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
// //                     <Tooltip contentStyle={customTooltipStyle} />
// //                   </RadarChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>
// //           </div>

// //           {/* ── Row 4: Rating dist + Top stocked ── */}
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

// //             {/* Rating distribution */}
// //             <Card>
// //               <CardHeader title="Rating Distribution" sub="Number of products per star rating" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={190}>
// //                   <BarChart data={ratingDist} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
// //                     <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
// //                     <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
// //                     <Tooltip contentStyle={customTooltipStyle} />
// //                     <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]} maxBarSize={40}>
// //                       {ratingDist.map((_, i) => (
// //                         <Cell key={i} fill={['#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db'][i]} />
// //                       ))}
// //                     </Bar>
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>

// //             {/* Top stocked */}
// //             <Card>
// //               <CardHeader title="Most Stocked Products" sub="Top 6 by total units" />
// //               <div className="px-5 py-3 space-y-2.5">
// //                 {topStocked.map((p, i) => {
// //                   const pct = Math.round((p.stock / topStocked[0].stock) * 100)
// //                   return (
// //                     <div key={p.name}>
// //                       <div className="flex justify-between text-[12px] mb-1">
// //                         <div className="flex items-center gap-2">
// //                           <span className="text-[10px] font-mono text-gray-300 w-4">{i + 1}</span>
// //                           <span className="text-gray-700 truncate max-w-[180px]">{p.name}</span>
// //                           <span className="text-[10px] text-gray-400 hidden sm:inline">{p.category}</span>
// //                         </div>
// //                         <span className="text-gray-500 font-medium shrink-0">{fmt(p.stock)}</span>
// //                       </div>
// //                       <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
// //                         <div className="h-full bg-gray-800 rounded-full transition-all duration-700"
// //                           style={{ width: `${pct}%` }} />
// //                       </div>
// //                     </div>
// //                   )
// //                 })}
// //               </div>
// //             </Card>
// //           </div>

// //           {/* ── Row 5: Top value + Brand breakdown ── */}
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

// //             {/* Top inventory value */}
// //             <Card>
// //               <CardHeader title="Highest Inventory Value" sub="Stock × selling price (₹)" />
// //               <div className="px-5 py-3 space-y-3">
// //                 {topValue.map((p, i) => (
// //                   <div key={p.name} className="flex items-center gap-3">
// //                     <span className="text-[10px] font-mono text-gray-300 w-4 shrink-0">{i + 1}</span>
// //                     <img src={p.image} alt={p.name} className="w-8 h-9 object-cover rounded-sm bg-gray-100 shrink-0" />
// //                     <div className="flex-1 min-w-0">
// //                       <p className="text-[12px] text-gray-700 truncate">{p.name}</p>
// //                       <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
// //                         <div className="h-full bg-gray-700 rounded-full"
// //                           style={{ width: `${Math.round((p.value / topValue[0].value) * 100)}%` }} />
// //                       </div>
// //                     </div>
// //                     <span className="text-[12px] font-medium text-gray-800 shrink-0">₹{fmt(p.value)}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </Card>

// //             {/* Brands */}
// //             <Card>
// //               <CardHeader title="Brand Distribution" sub="Products per brand (top 6)" />
// //               <div className="p-4">
// //                 <ResponsiveContainer width="100%" height={200}>
// //                   <BarChart data={brandData.map(([name, count]) => ({ name, count }))}
// //                     margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
// //                     <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
// //                     <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
// //                     <Tooltip contentStyle={customTooltipStyle} />
// //                     <Bar dataKey="count" name="Products" fill="#4b5563" radius={[4, 4, 0, 0]} maxBarSize={36}>
// //                       {brandData.map((_, i) => (
// //                         <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
// //                       ))}
// //                     </Bar>
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </Card>

// //           </div>

// //           {/* ── Low stock table ── */}
// //           {lowStockProducts.length > 0 && (
// //             <Card>
// //               <CardHeader title="Low Stock Products"
// //                 sub={`${lowStockProducts.length} products with at least one variant < 10 units`} />
// //               <div className="overflow-x-auto">
// //                 <table className="w-full text-[12px]">
// //                   <thead>
// //                     <tr className="border-b border-gray-50 bg-gray-50/60">
// //                       {['Product', 'Category', 'Brand', 'Variant', 'Stock', 'Price'].map(h => (
// //                         <th key={h} className="text-left px-5 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal first:pl-5">
// //                           {h}
// //                         </th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-gray-50">
// //                     {lowStockProducts.flatMap(p =>
// //                       p.variants.flatMap(v =>
// //                         v.sizes
// //                           .filter(s => s.stock < 10)
// //                           .map(s => (
// //                             <tr key={s.sku} className="hover:bg-red-50/30 transition-colors">
// //                               <td className="px-5 py-2.5">
// //                                 <div className="flex items-center gap-2.5">
// //                                   <img src={v.images[0]} alt={p.name}
// //                                     className="w-7 h-8 object-cover rounded-sm bg-gray-100 shrink-0" />
// //                                   <span className="text-gray-800 font-medium truncate max-w-[140px]">{p.name}</span>
// //                                 </div>
// //                               </td>
// //                               <td className="px-5 py-2.5 text-gray-500">{p.subcategory}</td>
// //                               <td className="px-5 py-2.5 text-gray-500">{p.brand}</td>
// //                               <td className="px-5 py-2.5">
// //                                 <div className="flex items-center gap-1.5">
// //                                   <span className="w-3 h-3 rounded-full border border-gray-200"
// //                                     style={{ background: v.colorCode }} />
// //                                   <span className="text-gray-600">{v.color} · {s.size}</span>
// //                                 </div>
// //                               </td>
// //                               <td className="px-5 py-2.5">
// //                                 <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
// //                                   <AlertTriangle size={9} />
// //                                   {s.stock}
// //                                 </span>
// //                               </td>
// //                               <td className="px-5 py-2.5 text-gray-700 font-medium">₹{fmt(s.price)}</td>
// //                             </tr>
// //                           ))
// //                       )
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </Card>
// //           )}

// //         </div>
// //     </MainLayout>
// //   )
// // }

// // export default Analytics
