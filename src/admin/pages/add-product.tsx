import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../component/layout'
import {
  Plus, Trash2, ChevronDown, ChevronUp,
  Check, AlertCircle, ArrowLeft, ImagePlus, X
} from 'lucide-react'

/* ─── Types ─────────────────────────────────── */
type Size = { size: string; sku: string; price: number; stock: number }
type Variant = { color: string; colorCode: string; images: string[]; sizes: Size[] }
type ProductForm = {
  id: string; name: string; category: string; subcategory: string
  brand: string; description: string; basePrice: number
  currency: string; rating: number; tags: string; variants: Variant[]
}

/* ─── Constants ─────────────────────────────── */
const CATEGORIES: Record<string, string[]> = {
  Fashion: ["Women's Clothing", "Men's Clothing", "Kids Clothing", "Footwear", "Accessories"],
  Beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
  'Home & Living': ['Furniture', 'Decor', 'Kitchenware', 'Bedding', 'Lighting', 'Appliances', 'Bath', 'Storage', 'Dinnerware', 'Home Textile'],
}
const SIZE_PRESETS: Record<string, string[]> = {
  Fashion: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Footwear: ['6', '7', '8', '9', '10', '11'],
  default: ['Standard', 'Small', 'Medium', 'Large'],
}

const emptySize = (): Size => ({ size: '', sku: '', price: 0, stock: 0 })
const emptyVariant = (): Variant => ({
  color: '', colorCode: '#000000', images: [''], sizes: [emptySize()]
})
const emptyForm = (): ProductForm => ({
  id: '', name: '', category: 'Fashion', subcategory: '', brand: '',
  description: '', basePrice: 0, currency: 'INR', rating: 4.0, tags: '',
  variants: [emptyVariant()],
})

/* ─── Small helpers ─────────────────────────── */
const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <label className="block text-[10px] tracking-[0.12em] uppercase text-gray-400 mb-1.5 font-medium">
    {text} {required && <span className="text-red-400">*</span>}
  </label>
)

const inputBase = 'w-full px-3 py-2 text-[13px] border outline-none transition-colors rounded-sm bg-white'
const inputCls = (err?: boolean) =>
  `${inputBase} ${err ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-500'}`

const ErrMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{msg}</p> : null

/* ─── Section wrapper ───────────────────────── */
const Section = ({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
      >
        <span className="text-[13px] font-semibold text-gray-700">{title}</span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-gray-50">{children}</div>}
    </div>
  )
}

/* ─── Main Component ────────────────────────── */
const AddProduct = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<ProductForm>(emptyForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [openVariant, setOpenVariant] = useState<number>(0)

  /* helpers */
  const setField = <K extends keyof ProductForm>(k: K, v: ProductForm[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const clearErr = (k: string) => setErrors(e => { const n = { ...e }; delete n[k]; return n })

  /* variant helpers */
  const updateVariant = (vi: number, patch: Partial<Variant>) =>
    setForm(f => {
      const v = [...f.variants]; v[vi] = { ...v[vi], ...patch }; return { ...f, variants: v }
    })

  const updateSize = (vi: number, si: number, patch: Partial<Size>) =>
    setForm(f => {
      const v = [...f.variants]
      const sizes = [...v[vi].sizes]
      sizes[si] = { ...sizes[si], ...patch }
      v[vi] = { ...v[vi], sizes }
      return { ...f, variants: v }
    })

  const addSize = (vi: number) =>
    setForm(f => {
      const v = [...f.variants]
      v[vi] = { ...v[vi], sizes: [...v[vi].sizes, emptySize()] }
      return { ...f, variants: v }
    })

  const removeSize = (vi: number, si: number) =>
    setForm(f => {
      const v = [...f.variants]
      v[vi] = { ...v[vi], sizes: v[vi].sizes.filter((_, i) => i !== si) }
      return { ...f, variants: v }
    })

  const addImage = (vi: number) =>
    setForm(f => {
      const v = [...f.variants]
      v[vi] = { ...v[vi], images: [...v[vi].images, ''] }
      return { ...f, variants: v }
    })

  const updateImage = (vi: number, ii: number, val: string) =>
    setForm(f => {
      const v = [...f.variants]
      const images = [...v[vi].images]; images[ii] = val
      v[vi] = { ...v[vi], images }; return { ...f, variants: v }
    })

  const removeImage = (vi: number, ii: number) =>
    setForm(f => {
      const v = [...f.variants]
      v[vi] = { ...v[vi], images: v[vi].images.filter((_, i) => i !== ii) }
      return { ...f, variants: v }
    })

  /* auto-generate SKU */
  const autoSku = (vi: number, si: number) => {
    const v = form.variants[vi]
    const s = v.sizes[si]
    if (!form.id || !v.color || !s.size) return
    const sku = `${form.id}-${v.color.slice(0, 3).toUpperCase()}-${s.size.slice(0, 3).toUpperCase()}`
    updateSize(vi, si, { sku })
  }

  /* validation */
  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.id.trim()) e.id = 'Product ID is required'
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.brand.trim()) e.brand = 'Brand is required'
    if (!form.subcategory.trim()) e.subcategory = 'Subcategory is required'
    if (form.basePrice <= 0) e.basePrice = 'Must be > 0'
    form.variants.forEach((v, vi) => {
      if (!v.color.trim()) e[`v${vi}_color`] = 'Color name required'
      v.sizes.forEach((s, si) => {
        if (!s.size.trim()) e[`v${vi}s${si}_size`] = 'Required'
        if (!s.sku.trim()) e[`v${vi}s${si}_sku`] = 'Required'
        if (s.price <= 0) e[`v${vi}s${si}_price`] = 'Must be > 0'
      })
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // In real app: POST to API. Here we just show success.
    setSaved(true)
    setTimeout(() => navigate('/admin/products'), 1800)
  }

  const subcats = CATEGORIES[form.category] ?? []
  const sizePreset = SIZE_PRESETS[form.subcategory] ?? SIZE_PRESETS[form.category] ?? SIZE_PRESETS.default
  const errorCount = Object.keys(errors).length

  return (
    <MainLayout>
        <div className="px-4 sm:px-8 py-6 max-w-full  space-y-5 pb-12">

          {/* ── Header ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/products')}
                className="text-gray-400 hover:text-gray-700 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-[1.4rem] sm:text-[1.8rem] font-normal text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Add Product
                </h1>
                <p className="text-[12px] text-gray-400">Fill in product details and variants</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => navigate('/admin/products')}
                className="px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors hidden sm:block">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="px-5 py-2 text-[12px] text-white bg-gray-900 hover:bg-gray-700 transition-colors flex items-center gap-2">
                {saved ? <><Check size={13} /> Saved!</> : <>Save Product</>}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {errorCount > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-sm text-[12px] text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              {errorCount} field{errorCount > 1 ? 's' : ''} need attention — check highlighted fields below.
            </div>
          )}

          {/* ── Basic Info ── */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              <div>
                <Label text="Product ID" required />
                <input value={form.id}
                  onChange={e => { setField('id', e.target.value.toUpperCase()); clearErr('id') }}
                  placeholder="e.g. P051"
                  className={inputCls(!!errors.id)} />
                <ErrMsg msg={errors.id} />
                <p className="text-[10px] text-gray-400 mt-1">Unique identifier. Used to generate SKUs.</p>
              </div>

              <div>
                <Label text="Product Name" required />
                <input value={form.name}
                  onChange={e => { setField('name', e.target.value); clearErr('name') }}
                  placeholder="e.g. Silk Wrap Dress"
                  className={inputCls(!!errors.name)} />
                <ErrMsg msg={errors.name} />
              </div>

              <div>
                <Label text="Brand" required />
                <input value={form.brand}
                  onChange={e => { setField('brand', e.target.value); clearErr('brand') }}
                  placeholder="e.g. Urbane"
                  className={inputCls(!!errors.brand)} />
                <ErrMsg msg={errors.brand} />
              </div>

              <div>
                <Label text="Base Price (₹)" required />
                <input type="number" min={1} value={form.basePrice || ''}
                  onChange={e => { setField('basePrice', Number(e.target.value)); clearErr('basePrice') }}
                  placeholder="999"
                  className={inputCls(!!errors.basePrice)} />
                <ErrMsg msg={errors.basePrice} />
              </div>

              <div>
                <Label text="Category" required />
                <select value={form.category}
                  onChange={e => { setField('category', e.target.value); setField('subcategory', '') }}
                  className={inputCls()}>
                  {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <Label text="Subcategory" required />
                <select value={form.subcategory}
                  onChange={e => { setField('subcategory', e.target.value); clearErr('subcategory') }}
                  className={inputCls(!!errors.subcategory)}>
                  <option value="">Select subcategory</option>
                  {subcats.map(s => <option key={s}>{s}</option>)}
                </select>
                <ErrMsg msg={errors.subcategory} />
              </div>

              <div>
                <Label text="Rating (0 – 5)" />
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={5} step={0.1}
                    value={form.rating}
                    onChange={e => setField('rating', parseFloat(e.target.value))}
                    className="flex-1 accent-gray-800" />
                  <span className="text-[13px] font-medium text-gray-700 w-8 text-right">{form.rating.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <Label text="Currency" />
                <select value={form.currency} onChange={e => setField('currency', e.target.value)}
                  className={inputCls()}>
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Label text="Tags" />
                <input value={form.tags}
                  onChange={e => setField('tags', e.target.value)}
                  placeholder="casual, summer, cotton  (comma separated)"
                  className={inputCls()} />
                <p className="text-[10px] text-gray-400 mt-1">Separate with commas.</p>
              </div>

              <div className="sm:col-span-2">
                <Label text="Description" />
                <textarea value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  rows={3} placeholder="Short product description visible to customers…"
                  className={inputCls() + ' resize-none'} />
              </div>

            </div>
          </Section>

          {/* ── Variants ── */}
          <Section title={`Variants (${form.variants.length})`}>
            <div className="mt-4 space-y-4">

              {form.variants.map((variant, vi) => (
                <div key={vi} className="border border-gray-100 rounded-sm overflow-hidden">

                  {/* Variant header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50/60 cursor-pointer"
                    onClick={() => setOpenVariant(openVariant === vi ? -1 : vi)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                        style={{ background: variant.colorCode }} />
                      <span className="text-[13px] font-medium text-gray-700">
                        {variant.color || `Variant ${vi + 1}`}
                      </span>
                      <span className="text-[10px] text-gray-400">{variant.sizes.length} size{variant.sizes.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {form.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation()
                            setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== vi) }))
                          }}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      {openVariant === vi
                        ? <ChevronUp size={14} className="text-gray-400" />
                        : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Variant body */}
                  {openVariant === vi && (
                    <div className="px-4 pb-4 pt-3 space-y-5">

                      {/* Color */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label text="Color Name" required />
                          <input value={variant.color}
                            onChange={e => { updateVariant(vi, { color: e.target.value }); clearErr(`v${vi}_color`) }}
                            placeholder="Black"
                            className={inputCls(!!errors[`v${vi}_color`])} />
                          <ErrMsg msg={errors[`v${vi}_color`]} />
                        </div>
                        <div>
                          <Label text="Color Code" />
                          <div className="flex gap-2">
                            <input type="color" value={variant.colorCode}
                              onChange={e => updateVariant(vi, { colorCode: e.target.value })}
                              className="h-9 w-12 border border-gray-200 rounded-sm cursor-pointer p-0.5 shrink-0" />
                            <input value={variant.colorCode}
                              onChange={e => updateVariant(vi, { colorCode: e.target.value })}
                              className={inputCls() + ' flex-1 font-mono text-[12px]'} />
                          </div>
                        </div>
                      </div>

                      {/* Images */}
                      <div>
                        <Label text="Image URLs" />
                        <div className="space-y-2">
                          {variant.images.map((img, ii) => (
                            <div key={ii} className="flex gap-2 items-start">
                              {/* Preview */}
                              <div className="w-10 h-10 border border-gray-100 rounded-sm shrink-0 overflow-hidden bg-gray-50">
                                {img
                                  ? <img src={img} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                                  : <ImagePlus size={14} className="m-auto mt-3 text-gray-300" />}
                              </div>
                              <input value={img}
                                onChange={e => updateImage(vi, ii, e.target.value)}
                                placeholder={`Image ${ii + 1} URL`}
                                className={inputCls() + ' flex-1 text-[12px]'} />
                              {variant.images.length > 1 && (
                                <button type="button" onClick={() => removeImage(vi, ii)}
                                  className="text-gray-300 hover:text-red-500 transition-colors mt-2">
                                  <X size={13} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => addImage(vi)}
                          className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
                          <Plus size={12} /> Add image URL
                        </button>
                      </div>

                      {/* Sizes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label text="Sizes & Pricing" required />
                          {/* Size presets */}
                          <div className="flex gap-1 flex-wrap justify-end">
                            {sizePreset.slice(0, 4).map(preset => (
                              <button key={preset} type="button"
                                onClick={() => {
                                  const exists = variant.sizes.some(s => s.size === preset)
                                  if (!exists) addSize(vi)
                                  const si = variant.sizes.length
                                  updateSize(vi, exists ? variant.sizes.findIndex(s => s.size === preset) : si, { size: preset })
                                  autoSku(vi, si)
                                }}
                                className="text-[9px] px-2 py-0.5 border border-gray-200 text-gray-400 hover:border-gray-500 hover:text-gray-700 transition-colors">
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Size rows */}
                        <div className="space-y-2">
                          {/* Header */}
                          <div className="grid grid-cols-12 gap-2 px-1">
                            {['Size', 'SKU', 'Price (₹)', 'Stock', ''].map((h, i) => (
                              <p key={i} className={`text-[9px] tracking-[0.1em] uppercase text-gray-400 ${i === 0 ? 'col-span-2' : i === 1 ? 'col-span-4' : i === 4 ? 'col-span-1' : 'col-span-2'}`}>{h}</p>
                            ))}
                          </div>

                          {variant.sizes.map((size, si) => (
                            <div key={si} className="grid grid-cols-12 gap-2 items-start">
                              {/* Size */}
                              <div className="col-span-2">
                                <input value={size.size}
                                  onChange={e => { updateSize(vi, si, { size: e.target.value }); clearErr(`v${vi}s${si}_size`) }}
                                  onBlur={() => autoSku(vi, si)}
                                  placeholder="M"
                                  className={inputCls(!!errors[`v${vi}s${si}_size`]) + ' text-center'} />
                                <ErrMsg msg={errors[`v${vi}s${si}_size`]} />
                              </div>
                              {/* SKU */}
                              <div className="col-span-4">
                                <input value={size.sku}
                                  onChange={e => { updateSize(vi, si, { sku: e.target.value }); clearErr(`v${vi}s${si}_sku`) }}
                                  placeholder="P051-BLK-M"
                                  className={inputCls(!!errors[`v${vi}s${si}_sku`]) + ' font-mono text-[11px]'} />
                                <ErrMsg msg={errors[`v${vi}s${si}_sku`]} />
                              </div>
                              {/* Price */}
                              <div className="col-span-2">
                                <input type="number" min={1} value={size.price || ''}
                                  onChange={e => { updateSize(vi, si, { price: Number(e.target.value) }); clearErr(`v${vi}s${si}_price`) }}
                                  placeholder="999"
                                  className={inputCls(!!errors[`v${vi}s${si}_price`])} />
                                <ErrMsg msg={errors[`v${vi}s${si}_price`]} />
                              </div>
                              {/* Stock */}
                              <div className="col-span-2">
                                <input type="number" min={0} value={size.stock || ''}
                                  onChange={e => updateSize(vi, si, { stock: Number(e.target.value) })}
                                  placeholder="0"
                                  className={inputCls()} />
                              </div>
                              {/* Remove */}
                              <div className="col-span-1 flex items-center justify-center pt-2">
                                {variant.sizes.length > 1 && (
                                  <button type="button" onClick={() => removeSize(vi, si)}
                                    className="text-gray-300 hover:text-red-500 transition-colors">
                                    <X size={13} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <button type="button" onClick={() => addSize(vi)}
                          className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
                          <Plus size={12} /> Add size
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add variant */}
              <button
                type="button"
                onClick={() => {
                  setForm(f => ({ ...f, variants: [...f.variants, emptyVariant()] }))
                  setOpenVariant(form.variants.length)
                }}
                className="w-full py-2.5 border border-dashed border-gray-300 text-[12px] text-gray-400 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 rounded-sm"
              >
                <Plus size={13} /> Add another variant
              </button>
            </div>
          </Section>

          {/* ── Preview card ── */}
          <Section title="Preview" defaultOpen={false}>
            <div className="mt-4 flex gap-4 flex-wrap">
              {/* Thumbnail */}
              <div className="w-28 h-32 bg-gray-100 rounded-sm overflow-hidden shrink-0 border border-gray-100">
                {form.variants[0]?.images[0]
                  ? <img src={form.variants[0].images[0]} alt="preview"
                    className="w-full h-full object-cover" />
                  : <div className="flex items-center justify-center h-full text-gray-300 text-[11px]">No image</div>}
              </div>
              <div className="flex flex-col gap-1.5 text-[12px]">
                <p className="text-[16px] font-medium text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {form.name || 'Product Name'}
                </p>
                <p className="text-gray-400">{form.brand || 'Brand'}</p>
                <p className="text-gray-600">{form.category} · {form.subcategory || 'Subcategory'}</p>
                <p className="text-gray-800 font-semibold">
                  ₹{form.variants[0]?.sizes[0]?.price > 0
                    ? form.variants[0].sizes[0].price.toLocaleString('en-IN')
                    : form.basePrice > 0 ? form.basePrice.toLocaleString('en-IN') : '—'}
                </p>
                <p className="text-gray-400">{form.variants.length} variant{form.variants.length !== 1 ? 's' : ''} · {form.variants.reduce((t, v) => t + v.sizes.reduce((s, sz) => s + sz.stock, 0), 0)} units</p>
                {form.tags && (
                  <div className="flex gap-1 flex-wrap mt-1">
                    {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* ── Bottom actions ── */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => navigate('/admin/products')}
              className="px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => { setForm(emptyForm()); setErrors({}) }}
                className="px-4 py-2 text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
                Reset form
              </button>
              <button onClick={handleSubmit}
                className="px-6 py-2.5 text-[12px] text-white bg-gray-900 hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium">
                {saved
                  ? <><Check size={13} /> Product Saved!</>
                  : <>Save Product</>}
              </button>
            </div>
          </div>

        </div>
    </MainLayout>
  )
}

export default AddProduct
