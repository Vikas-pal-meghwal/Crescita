import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../component/layout'
// import ThinScroll from '../component/thin-scroll'
import {
  Search, Plus, Pencil, Trash2, X, AlertTriangle,
  Star, ChevronDown, Eye, ChevronLeft, ChevronRight
} from 'lucide-react'
import rawProducts from '../../data/products.json'

/* ── Types ── */
type Size = { size: string; sku: string; price: number; stock: number }
type Variant = { color: string; colorCode: string; images: string[]; sizes: Size[] }
type Product = {
  id: string; name: string; category: string; subcategory: string
  brand: string; description: string; basePrice: number; currency: string
  rating: number; tags: string[]; variants: Variant[]
}

const CATEGORIES = ['All', 'Beauty', 'Fashion', 'Home & Living']
const CATEGORY_COLORS: Record<string, string> = {
  Beauty: 'bg-pink-50 text-pink-600',
  Fashion: 'bg-blue-50 text-blue-600',
  'Home & Living': 'bg-emerald-50 text-emerald-600',
}
const categoryColor = (cat: string) => CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-600'
const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(Math.round(n))

/* ── Delete Confirm Modal ── */
const DeleteModal = ({ product, onConfirm, onCancel }: {
  product: Product; onConfirm: () => void; onCancel: () => void
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-red-50 p-2 rounded-full shrink-0">
          <AlertTriangle size={18} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-gray-800">Delete Product</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">This action cannot be undone.</p>
        </div>
      </div>
      <p className="text-[13px] text-gray-600 mb-5">
        Are you sure you want to delete <span className="font-medium text-gray-900">"{product.name}"</span>?
      </p>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 text-[12px] font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
)

/* ── Product Form Modal ── */
const ProductModal = ({ product, onSave, onClose }: {
  product: Partial<Product> | null; onSave: (p: Product) => void; onClose: () => void
}) => {
  const isEdit = !!product?.id
  const [form, setForm] = useState<Partial<Product>>(product ?? {
    id: '', name: '', category: 'Fashion', subcategory: '', brand: '',
    description: '', basePrice: 0, currency: 'INR', rating: 4.0, tags: [],
    variants: [{ color: 'Default', colorCode: '#000000', images: [''], sizes: [{ size: 'Standard', sku: '', price: 0, stock: 0 }] }]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: keyof Product, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.id?.trim()) e.id = 'Required'
    if (!form.name?.trim()) e.name = 'Required'
    if (!form.brand?.trim()) e.brand = 'Required'
    if (!form.subcategory?.trim()) e.subcategory = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(form as Product)
  }

  const Field = ({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-1">{label}</label>
      {children}
      {err && <p className="text-[10px] text-red-500 mt-0.5">{err}</p>}
    </div>
  )

  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 text-[13px] border ${err ? 'border-red-300' : 'border-gray-200'} outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors rounded-lg`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-800">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
          <div className="px-6 py-5 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <Field label="Product ID" err={errors.id}>
                <input value={form.id ?? ''} onChange={e => set('id', e.target.value)}
                  disabled={isEdit} placeholder="P001"
                  className={inputCls(errors.id) + (isEdit ? ' bg-gray-50 text-gray-400 cursor-not-allowed' : '')} />
              </Field>
              <Field label="Product Name" err={errors.name}>
                <input value={form.name ?? ''} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Silk Blouse" className={inputCls(errors.name)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Brand" err={errors.brand}>
                <input value={form.brand ?? ''} onChange={e => set('brand', e.target.value)}
                  placeholder="e.g. GlowUp" className={inputCls(errors.brand)} />
              </Field>
              <Field label="Base Price (₹)">
                <input type="number" value={form.basePrice ?? 0}
                  onChange={e => set('basePrice', Number(e.target.value))}
                  className={inputCls()} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select value={form.category ?? 'Fashion'} onChange={e => set('category', e.target.value)}
                  className={inputCls()}>
                  <option>Fashion</option>
                  <option>Beauty</option>
                  <option>Home & Living</option>
                </select>
              </Field>
              <Field label="Subcategory" err={errors.subcategory}>
                <input value={form.subcategory ?? ''} onChange={e => set('subcategory', e.target.value)}
                  placeholder="e.g. Skincare" className={inputCls(errors.subcategory)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating (0–5)">
                <input type="number" step="0.1" min="0" max="5" value={form.rating ?? 4}
                  onChange={e => set('rating', parseFloat(e.target.value))}
                  className={inputCls()} />
              </Field>
              <Field label="Tags (comma separated)">
                <input value={(form.tags ?? []).join(', ')}
                  onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="casual, summer, cotton" className={inputCls()} />
              </Field>
            </div>

            <Field label="Description">
              <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)}
                rows={2} placeholder="Short product description..."
                className={inputCls() + ' resize-none'} />
            </Field>

            {/* Variant — show first variant's first size for simplicity */}
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
              <p className="text-[11px] tracking-[0.1em] uppercase text-gray-400 mb-3">First Variant</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Color Name">
                  <input value={form.variants?.[0]?.color ?? ''}
                    onChange={e => {
                      const v = [...(form.variants ?? [])]
                      v[0] = { ...v[0], color: e.target.value }
                      set('variants', v)
                    }}
                    placeholder="Black" className={inputCls()} />
                </Field>
                <Field label="Color Code">
                  <div className="flex gap-2">
                    <input type="color" value={form.variants?.[0]?.colorCode ?? '#000000'}
                      onChange={e => {
                        const v = [...(form.variants ?? [])]
                        v[0] = { ...v[0], colorCode: e.target.value }
                        set('variants', v)
                      }}
                      className="w-10 h-9 border border-gray-200 rounded-lg cursor-pointer p-0.5" />
                    <input value={form.variants?.[0]?.colorCode ?? ''}
                      onChange={e => {
                        const v = [...(form.variants ?? [])]
                        v[0] = { ...v[0], colorCode: e.target.value }
                        set('variants', v)
                      }}
                      className={inputCls() + ' flex-1'} />
                  </div>
                </Field>
                <Field label="Price (₹)">
                  <input type="number"
                    value={form.variants?.[0]?.sizes?.[0]?.price ?? 0}
                    onChange={e => {
                      const v = [...(form.variants ?? [])]
                      v[0] = { ...v[0], sizes: [{ ...v[0].sizes[0], price: Number(e.target.value) }] }
                      set('variants', v)
                    }}
                    className={inputCls()} />
                </Field>
                <Field label="Stock">
                  <input type="number"
                    value={form.variants?.[0]?.sizes?.[0]?.stock ?? 0}
                    onChange={e => {
                      const v = [...(form.variants ?? [])]
                      v[0] = { ...v[0], sizes: [{ ...v[0].sizes[0], stock: Number(e.target.value) }] }
                      set('variants', v)
                    }}
                    className={inputCls()} />
                </Field>
                <Field label="Image URL" err={undefined}>
                  <input value={form.variants?.[0]?.images?.[0] ?? ''}
                    onChange={e => {
                      const v = [...(form.variants ?? [])]
                      v[0] = { ...v[0], images: [e.target.value] }
                      set('variants', v)
                    }}
                    placeholder="https://..." className={inputCls() + ' col-span-2'} />
                </Field>
              </div>
            </div>

          </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="px-4 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className="px-5 py-2 text-[12px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors">
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Products Page ── */
const AdminProducts = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>(rawProducts as Product[])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'rating'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [editProduct, setEditProduct] = useState<Product | null | 'new'>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  /* ── Filtered + sorted list ── */
  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== 'All') list = list.filter(p => p.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      let av: number | string, bv: number | string
      if (sortBy === 'price') { av = a.variants[0].sizes[0].price; bv = b.variants[0].sizes[0].price }
      else if (sortBy === 'stock') {
        av = a.variants.reduce((s, v) => s + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0)
        bv = b.variants.reduce((s, v) => s + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0)
      }
      else if (sortBy === 'rating') { av = a.rating; bv = b.rating }
      else { av = a.name.toLowerCase(); bv = b.name.toLowerCase() }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [products, search, category, sortBy, sortDir])

  // Filters/search/sort changed the result set — page 1 is the only page
  // guaranteed to still exist, so land there instead of on a stale/empty page.
  useEffect(() => {
    setPage(1)
  }, [search, category, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  )
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const SortIcon = ({ col }: { col: typeof sortBy }) => (
    <ChevronDown size={12} className={`inline ml-0.5 transition-transform ${sortBy === col && sortDir === 'desc' ? 'rotate-180' : ''} ${sortBy === col ? 'opacity-100' : 'opacity-30'}`} />
  )

  const handleSave = (updated: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === updated.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = updated; return n }
      return [updated, ...prev]
    })
    setEditProduct(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const totalStock = (p: Product) =>
    p.variants.reduce((s, v) => s + v.sizes.reduce((ss, sz) => ss + sz.stock, 0), 0)

  const isLow = (p: Product) =>
    p.variants.some(v => v.sizes.some(s => s.stock < 10))

  return (
    <MainLayout>
        {/* Full-width container — no max-w/mx-auto centering, so freed
            sidebar space (e.g. when collapsed) is actually used. */}
        <div className="w-full px-4 sm:px-8 py-6 space-y-6">

          {/* ── Header row ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-[1.5rem] sm:text-[1.9rem] font-semibold tracking-tight text-gray-900">
                Products
              </h1>
              <p className="text-[12px] text-gray-400 mt-0.5">{products.length} total products</p>
            </div>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:bg-gray-700 transition-colors shrink-0"
            >
              <Plus size={14} />
              Add Product
            </button>
          </div>

          {/* ── Filters bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, brand, ID…"
                className="w-full pl-9 pr-9 py-2.5 text-[13px] border border-gray-200 bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors rounded-lg"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category filter — segmented control for clearer grouping */}
            <div className="inline-flex items-center gap-1 p-1 bg-gray-100/70 rounded-lg w-fit">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${category === c
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ── Results count ── */}
          <p className="text-[11px] text-gray-400 -mt-2">
            Showing <span className="text-gray-700 font-medium">{rangeStart}–{rangeEnd}</span> of {filtered.length} products
            {search && <> for "<span className="text-gray-700">{search}</span>"</>}
          </p>

          {/* ── Table ── */}
          <div className="w-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {/* table-fixed + colgroup: columns share the full table width
                  instead of shrinking to content and leaving space unused. */}
              <table className="w-full text-[13px] table-fixed">
                <colgroup>
                  <col className="w-[26%]" />
                  <col className="w-[16%] hidden sm:table-column" />
                  <col className="w-[12%]" />
                  <col className="w-[10%] hidden md:table-column" />
                  <col className="w-[12%]" />
                  <col className="w-[14%] hidden sm:table-column" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium">Product</th>
                    <th className="text-left px-3 py-3.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium hidden sm:table-cell">Category</th>
                    <th className="text-left px-3 py-3.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium cursor-pointer select-none hover:text-gray-600"
                      onClick={() => toggleSort('price')}>
                      Price <SortIcon col="price" />
                    </th>
                    <th className="text-left px-3 py-3.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium hidden md:table-cell cursor-pointer select-none hover:text-gray-600"
                      onClick={() => toggleSort('rating')}>
                      Rating <SortIcon col="rating" />
                    </th>
                    <th className="text-left px-3 py-3.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium cursor-pointer select-none hover:text-gray-600"
                      onClick={() => toggleSort('stock')}>
                      Stock <SortIcon col="stock" />
                    </th>
                    <th className="text-left px-3 py-3.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium hidden sm:table-cell">Variants</th>
                    <th className="px-3 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center text-[13px] text-gray-400">
                        No products found.
                      </td>
                    </tr>
                  ) : paginated.map(p => {
                    const stock = totalStock(p)
                    const low = isLow(p)
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition-colors group">

                        {/* Product */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={p.variants[0].images[0]} alt={p.name}
                              className="w-10 h-11 object-cover rounded-lg bg-gray-100 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-gray-800 font-medium truncate">{p.name}</p>
                              <p className="text-gray-400 text-[11px] truncate">{p.brand} · {p.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3.5 hidden sm:table-cell">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium w-fit ${categoryColor(p.category)}`}>{p.category}</span>
                            <span className="text-[10px] text-gray-400 truncate">{p.subcategory}</span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-3 py-3.5 text-gray-700 font-medium">
                          ₹{fmt(p.variants[0].sizes[0].price)}
                        </td>

                        {/* Rating */}
                        <td className="px-3 py-3.5 hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Star size={11} className="text-amber-400 fill-amber-400" />
                            <span className="text-gray-600">{p.rating}</span>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-3 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${low ? 'text-red-600 bg-red-50' : 'text-emerald-700 bg-emerald-50'}`}>
                            {low && <AlertTriangle size={9} />}
                            {stock}
                          </span>
                        </td>

                        {/* Variants */}
                        <td className="px-3 py-3.5 hidden sm:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {p.variants.slice(0, 4).map(v => (
                              <span key={v.color} title={v.color}
                                className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                                style={{ background: v.colorCode }} />
                            ))}
                            {p.variants.length > 4 && (
                              <span className="text-[9px] text-gray-400 self-center">+{p.variants.length - 4}</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewProduct(p)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View">
                              <Eye size={13} />
                            </button>
                            <button onClick={() => setEditProduct(p)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                              title="Edit">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => setDeleteTarget(p)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-wrap gap-3">
                <p className="text-[11px] text-gray-400">
                  Page <span className="text-gray-700 font-medium">{currentPage}</span> of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors rounded-lg"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={13} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(n =>
                      n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1
                    )
                    .reduce<(number | 'ellipsis')[]>((acc, n, i, arr) => {
                      if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('ellipsis')
                      acc.push(n)
                      return acc
                    }, [])
                    .map((n, i) =>
                      n === 'ellipsis' ? (
                        <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-gray-300 text-[12px]">…</span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-8 h-8 flex items-center justify-center text-[11px] font-medium rounded-lg border transition-colors ${
                            n === currentPage
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {n}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors rounded-lg"
                    aria-label="Next page"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      {/* ── View Product Drawer ── */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-[1px]"
          onClick={() => setViewProduct(null)}>
          <div className="bg-white w-full max-w-full h-full shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[14px] font-semibold text-gray-800">{viewProduct.name}</h3>
              <button onClick={() => setViewProduct(null)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
              <div className="p-5 space-y-5">
                {/* Images */}
                <div className="grid grid-cols-3 gap-2">
                  {viewProduct.variants[0].images.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded-lg bg-gray-100" />
                  ))}
                </div>
                {/* Info */}
                <div className="space-y-2 text-[13px]">
                  {[
                    ['ID', viewProduct.id],
                    ['Brand', viewProduct.brand],
                    ['Category', viewProduct.category],
                    ['Subcategory', viewProduct.subcategory],
                    ['Base Price', `₹${fmt(viewProduct.basePrice)}`],
                    ['Rating', viewProduct.rating + ' / 5'],
                    ['Total Stock', totalStock(viewProduct).toString()],
                    ['Tags', viewProduct.tags.join(', ') || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-400">{k}</span>
                      <span className="text-gray-800 font-medium text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                </div>
                {/* Description */}
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-1">Description</p>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{viewProduct.description || '—'}</p>
                </div>
                {/* Variants */}
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-2">
                    Variants ({viewProduct.variants.length})
                  </p>
                  <div className="space-y-2">
                    {viewProduct.variants.map(v => (
                      <div key={v.color} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="w-5 h-5 rounded-full border border-gray-200 shrink-0"
                          style={{ background: v.colorCode }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-gray-800">{v.color}</p>
                          {v.sizes.map(s => (
                            <p key={s.sku} className="text-[10px] text-gray-400">
                              {s.size} · ₹{fmt(s.price)} · {s.stock} in stock
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
              <button onClick={() => { setViewProduct(null); setEditProduct(viewProduct) }}
                className="flex-1 py-2 text-[12px] text-white bg-gray-900 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <Pencil size={13} /> Edit Product
              </button>
              <button onClick={() => { setViewProduct(null); setDeleteTarget(viewProduct) }}
                className="px-4 py-2 text-[12px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit / Add Modal ── */}
      {editProduct !== null && (
        <ProductModal
          product={editProduct === 'new' ? null : editProduct}
          onSave={handleSave}
          onClose={() => setEditProduct(null)}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </MainLayout>
  )
}

export default AdminProducts