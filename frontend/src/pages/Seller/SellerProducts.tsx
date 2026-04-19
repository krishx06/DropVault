import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getMyProducts, createProduct, updateProduct } from '../../services/product.service'
import type { Product, ProductStatus } from '../../types/product.types'

const STATUS_CONFIG: Record<ProductStatus, { dot: string; label: string; text: string }> = {
  DRAFT:    { dot: 'bg-stone-300',   label: 'Draft', text: 'text-stone-500' },
  ACTIVE:   { dot: 'bg-emerald-500', label: 'Active', text: 'text-emerald-700' },
  ARCHIVED: { dot: 'bg-stone-400',   label: 'Archived', text: 'text-stone-500' },
}

interface FormState {
  name: string
  description: string
  price: string
  imageUrl: string
}

const EMPTY_FORM: FormState = { name: '', description: '', price: '', imageUrl: '' }

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await getMyProducts()
      setProducts(res.data.data.map((p) => ({
        ...p,
        status: p.status?.toUpperCase() as typeof p.status,
      })))
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setPanelOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      imageUrl: p.imageUrl ?? '',
    })
    setSaveError('')
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
    setEditing(null)
    setSaveError('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return
    setSaving(true)
    setSaveError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        imageUrl: form.imageUrl.trim() || undefined,
      }
      const normalize = (p: Product) => ({ ...p, status: p.status?.toUpperCase() as typeof p.status })
      if (editing) {
        const res = await updateProduct(editing.id, payload)
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? normalize(res.data.data) : p)))
      } else {
        const res = await createProduct(payload)
        setProducts((prev) => [normalize(res.data.data), ...prev])
      }
      closePanel()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setSaveError(msg ?? 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const approved = products.filter((p) => p.isApproved).length
  const pending = products.filter((p) => !p.isApproved).length

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fbf9f9]">
      <header className="h-20 flex items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-stone-100">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-stone-950">Product Inventory</h2>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Manage your exclusive archive</p>
        </div>
        <button
          onClick={openCreate}
          className="h-11 px-8 bg-stone-950 text-white rounded-lg font-bold text-sm tracking-wide flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Product
        </button>
      </header>

      <div className="p-12 space-y-8 flex-1">
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 bg-stone-100/60 rounded-xl p-8 flex flex-col justify-between min-h-[160px]">
            <span className="text-[10px] uppercase tracking-widest text-stone-500">Live Status</span>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black tracking-tighter text-stone-950">
                  {loading ? '—' : `${approved} Approved`}
                </span>
                {approved > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Active
                  </div>
                )}
              </div>
              <p className="text-sm text-stone-500 max-w-[200px] text-right">
                Products approved by admin are eligible for drops.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 bg-amber-50 rounded-xl p-8 flex flex-col justify-between min-h-[160px]">
            <span className="text-[10px] uppercase tracking-widest text-amber-700">Pending Review</span>
            <div className="text-4xl font-black tracking-tighter text-amber-900">
              {loading ? '—' : String(pending).padStart(2, '0')} Items
            </div>
            <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">
              Awaiting admin approval
            </p>
          </div>
        </section>

        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50">
                  {['Product', 'Status', 'Price', ''].map((h) => (
                    <th key={h} className="px-8 py-5 text-[10px] uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100 last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {loading && Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)}

                {!loading && !error && products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-sm font-semibold text-stone-400 mb-1">No products yet.</p>
                      <p className="text-xs text-stone-300">Create your first product to start scheduling drops.</p>
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <p className="text-sm font-semibold text-red-500 mb-3">{error}</p>
                      <button onClick={load} className="text-xs uppercase tracking-widest font-bold border border-stone-200 px-5 h-9 rounded hover:bg-stone-950 hover:text-white transition-all">
                        Retry
                      </button>
                    </td>
                  </tr>
                )}

                {!loading && !error && products.map((p) => (
                  <ProductRow key={p.id} product={p} onEdit={openEdit} />
                ))}
              </tbody>
            </table>
          </div>

          {!loading && products.length > 0 && (
            <div className="px-8 py-5 bg-stone-50/30 border-t border-stone-50">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                {products.length} product{products.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-amber-700 mb-1">
                    {editing ? 'Edit Product' : 'New Product'}
                  </p>
                  <h3 className="text-xl font-black tracking-tight text-stone-950">
                    {editing ? editing.name : 'Create a Product'}
                  </h3>
                </div>
                <button onClick={closePanel} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors">
                  <span className="material-symbols-outlined text-stone-500">close</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Enter product title"
                        required
                        className="w-full border-b-2 border-stone-200 focus:border-amber-600 bg-transparent py-2 text-lg font-bold tracking-tight text-stone-950 placeholder:text-stone-300 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                        Price (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-stone-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                          placeholder="0.00"
                          required
                          className="w-full border-b-2 border-stone-200 focus:border-amber-600 bg-transparent pl-5 py-2 text-lg font-bold tracking-tight text-stone-950 placeholder:text-stone-300 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Describe the product..."
                        rows={5}
                        className="w-full border border-stone-200 focus:border-amber-600 bg-stone-50 rounded-lg px-4 py-3 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://..."
                        className="w-full border border-stone-200 focus:border-amber-600 bg-stone-50 rounded-lg px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      {form.imageUrl ? (
                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-stone-300 text-4xl">image</span>
                          <span className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="p-5 bg-stone-50 rounded-xl space-y-2">
                    {[
                      { label: 'Status', value: editing.status },
                      { label: 'Created', value: new Date(editing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-stone-400">{label}</span>
                        <span className="text-stone-950">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {saveError && (
                  <p className="text-xs font-semibold text-red-500">{saveError}</p>
                )}
              </form>

              <div className="px-8 py-6 border-t border-stone-100 space-y-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !form.name.trim() || !form.price}
                  className="w-full h-12 bg-stone-950 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:bg-stone-200 disabled:text-stone-400 disabled:translate-y-0 disabled:shadow-none"
                >
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
                  {!saving && <span className="material-symbols-outlined text-sm">check_circle</span>}
                </button>
                <button
                  type="button"
                  onClick={closePanel}
                  className="w-full h-11 border-2 border-stone-100 text-stone-400 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductRow({ product, onEdit }: { product: Product; onEdit: (p: Product) => void }) {
  const approval = product.isApproved
    ? { dot: 'bg-emerald-500', label: 'Approved', text: 'text-emerald-700' }
    : { dot: 'bg-amber-500', label: 'Pending Review', text: 'text-amber-700' }
  const statusKey = (product.status?.toUpperCase() as ProductStatus) ?? 'DRAFT'
  const base = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG['DRAFT']
  const { dot, label, text } = product.isApproved !== undefined ? approval : base
  return (
    <tr className="hover:bg-stone-50/50 transition-colors group">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-stone-100 rounded-lg overflow-hidden shrink-0">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-stone-300 text-xl">image</span>
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-sm text-stone-900">{product.name}</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-tight mt-0.5 line-clamp-1 max-w-[220px]">
              {product.description || '—'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span className={`text-[11px] font-bold uppercase tracking-wider ${text}`}>{label}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className="font-bold text-stone-900">${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </td>
      <td className="px-8 py-6 text-right">
        <button
          onClick={() => onEdit(product)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined text-stone-400 hover:text-stone-950 transition-colors">edit</span>
        </button>
      </td>
    </tr>
  )
}

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-stone-100 rounded-lg" />
          <div className="space-y-2">
            <div className="h-3 w-36 bg-stone-100 rounded" />
            <div className="h-2 w-24 bg-stone-100 rounded" />
          </div>
        </div>
      </td>
      <td className="px-8 py-6"><div className="h-3 w-20 bg-stone-100 rounded" /></td>
      <td className="px-8 py-6"><div className="h-3 w-16 bg-stone-100 rounded" /></td>
      <td className="px-8 py-6" />
    </tr>
  )
}
