import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProducts } from '../../services/product.service'
import { createDrop } from '../../services/seller.service'
import type { Product } from '../../types/product.types'

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const now = new Date()
const defaultStart = new Date(now.getTime() + 60 * 60 * 1000)
const defaultEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000)

export default function SellerDropNew() {
  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState(toLocalDatetimeValue(defaultStart))
  const [endTime, setEndTime] = useState(toLocalDatetimeValue(defaultEnd))
  const [stock, setStock] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    getMyProducts()
      .then((res) => {
        const approved = res.data.data.filter((p) => p.isApproved)
        setProducts(approved)
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false))
  }, [])

  function toggleProduct(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function validate() {
    if (selectedIds.size === 0) return 'Select at least one product.'
    if (!stock || Number(stock) < 1) return 'Stock must be at least 1.'
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (start <= new Date()) return 'Start time must be in the future.'
    if (end <= start) return 'End time must be after start time.'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setValidationError(err); return }
    setValidationError('')
    setSaving(true)
    setError('')
    try {
      await Promise.all(
        Array.from(selectedIds).map((productId) =>
          createDrop({
            productId,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            stock: Number(stock),
          })
        )
      )
      navigate('/seller/drops')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Failed to schedule drop.')
    } finally {
      setSaving(false)
    }
  }

  const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime()
  const durationHours = durationMs > 0 ? Math.round(durationMs / 3600000) : 0
  const selectedProducts = products.filter((p) => selectedIds.has(p.id))

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fbf9f9]">
      <header className="h-16 px-8 flex items-center justify-between border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => navigate('/seller/drops')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-950 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="text-xs uppercase tracking-widest font-bold">Back to Drops</span>
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12 w-full">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-700 font-bold mb-3">Drop Scheduling</p>
          <h1 className="text-5xl font-black tracking-tighter text-stone-950">New Drop</h1>
        </div>

        {loadingProducts && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-950 rounded-full animate-spin" />
          </div>
        )}

        {!loadingProducts && products.length === 0 && (
          <div className="py-24 text-center bg-white border border-stone-100 rounded-2xl">
            <span className="material-symbols-outlined text-stone-300 text-5xl mb-4 block">inventory_2</span>
            <h3 className="text-lg font-black tracking-tight text-stone-950 mb-2">No approved products</h3>
            <p className="text-sm text-stone-400 mb-6 max-w-xs mx-auto">
              You need at least one admin-approved product before scheduling a drop.
            </p>
            <button
              onClick={() => navigate('/seller/products')}
              className="text-xs uppercase tracking-widest font-bold bg-stone-950 text-white px-6 h-10 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Go to Products
            </button>
          </div>
        )}

        {!loadingProducts && products.length > 0 && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">
                  Products <span className="text-stone-300 normal-case tracking-normal font-normal">(select one or more)</span>
                </label>
                <div className="space-y-2">
                  {products.map((p) => {
                    const checked = selectedIds.has(p.id)
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          checked
                            ? 'border-stone-950 bg-white'
                            : 'border-stone-100 bg-white hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProduct(p.id)}
                          className="sr-only"
                        />
                        <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-stone-300 text-lg">image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-stone-950 truncate">{p.name}</p>
                          <p className="text-xs text-stone-400">${Number(p.price).toLocaleString()}</p>
                        </div>
                        {checked && (
                          <span className="material-symbols-outlined text-stone-950 text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full border-b-2 border-stone-200 focus:border-amber-600 bg-transparent py-2 text-sm font-semibold text-stone-950 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full border-b-2 border-stone-200 focus:border-amber-600 bg-transparent py-2 text-sm font-semibold text-stone-950 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="e.g. 100"
                  required
                  className="w-full border-b-2 border-stone-200 focus:border-amber-600 bg-transparent py-2 text-2xl font-black tracking-tight text-stone-950 placeholder:text-stone-300 focus:outline-none transition-colors"
                />
                <p className="mt-1.5 text-xs text-stone-400">Units available for purchase during the drop window.</p>
              </div>

              {durationHours > 0 && stock && selectedProducts.length > 0 && (
                <div className="p-6 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Drop Summary</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Products', value: `${selectedProducts.length} product${selectedProducts.length !== 1 ? 's' : ''}` },
                      { label: 'Duration', value: `${durationHours} hour${durationHours !== 1 ? 's' : ''}` },
                      { label: 'Stock per drop', value: `${Number(stock).toLocaleString()} units` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-stone-500">{label}</span>
                        <span className="font-bold text-stone-950">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(validationError || error) && (
                <p className="text-xs font-semibold text-red-500">{validationError || error}</p>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">
                  Selected ({selectedProducts.length})
                </p>
                {selectedProducts.length === 0 ? (
                  <div className="aspect-square rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-stone-300 text-4xl">check_box_outline_blank</span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">None selected</span>
                  </div>
                ) : selectedProducts.length === 1 ? (
                  <>
                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      {selectedProducts[0].imageUrl ? (
                        <img src={selectedProducts[0].imageUrl} alt={selectedProducts[0].name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-stone-300 text-4xl">image</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="font-black tracking-tight text-stone-950">{selectedProducts[0].name}</p>
                      <p className="text-sm text-stone-400 line-clamp-2">{selectedProducts[0].description}</p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-stone-300 text-base">image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-stone-950 truncate">{p.name}</p>
                          <p className="text-xs text-stone-400">${Number(p.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border border-stone-100 rounded-2xl space-y-3 shadow-sm">
                <button
                  type="submit"
                  disabled={saving || selectedIds.size === 0 || !stock}
                  className="w-full h-14 bg-stone-950 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:bg-stone-200 disabled:text-stone-400 disabled:translate-y-0 disabled:shadow-none"
                >
                  {saving ? 'Scheduling…' : `Schedule ${selectedIds.size > 1 ? `${selectedIds.size} Drops` : 'Drop'}`}
                  {!saving && <span className="material-symbols-outlined text-sm">bolt</span>}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/seller/drops')}
                  className="w-full h-11 border-2 border-stone-100 text-stone-400 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
