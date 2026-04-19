import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getSellerOrders, confirmSellerOrder, type SellerOrder } from '../../services/seller.service'
import type { OrderStatus } from '../../types/order.types'

type Filter = 'ALL' | OrderStatus

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-stone-100 text-stone-400 border-stone-200',
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export default function SellerOrders() {
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('ALL')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await getSellerOrders()
      setOrders(res.data.data)
    } catch {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleConfirm(id: string) {
    setConfirmingId(id)
    try {
      const res = await confirmSellerOrder(id)
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: res.data.data.status } : o))
    } catch (err) {
      console.error(err)
    } finally {
      setConfirmingId(null)
    }
  }

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  const stats = {
    pending: orders.filter((o) => o.status === 'PENDING').length,
    confirmed: orders.filter((o) => o.status === 'CONFIRMED').length,
    revenue: orders
      .filter((o) => o.status === 'CONFIRMED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0),
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fbf9f9]">
      <header className="h-16 flex items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-stone-100">
        <h1 className="text-xl font-black tracking-tighter text-stone-950">Order Management</h1>
      </header>

      <div className="p-12 max-w-7xl w-full mx-auto space-y-10 flex-1">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Pending', value: stats.pending, accent: 'text-amber-700' },
            { label: 'Confirmed', value: stats.confirmed, accent: 'text-emerald-700' },
            { label: 'Confirmed Revenue', value: `$${stats.revenue.toLocaleString()}`, accent: 'text-stone-950' },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bg-white border border-stone-100 rounded-2xl p-6">
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">{label}</p>
              <p className={`text-3xl font-black tracking-tight ${accent}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 border-b border-stone-100 pb-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`relative px-5 py-3 text-xs uppercase tracking-widest font-bold transition-colors ${
                filter === f.value ? 'text-stone-950' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {f.label}
              {f.value === 'PENDING' && stats.pending > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-black">
                  {stats.pending}
                </span>
              )}
              {filter === f.value && (
                <motion.div layoutId="seller-order-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-950" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {['Customer', 'Drop', 'Qty / Total', 'Date', 'Status', ''].map((h) => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-stone-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loading && Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-sm text-stone-400">
                    {filter === 'ALL' ? 'No orders yet.' : `No ${filter.toLowerCase()} orders.`}
                  </td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <p className="text-sm font-semibold text-red-500 mb-3">{error}</p>
                    <button onClick={load} className="text-xs uppercase tracking-widest font-bold border border-stone-200 px-5 h-8 rounded hover:bg-stone-950 hover:text-white transition-all">
                      Retry
                    </button>
                  </td>
                </tr>
              )}

              {!loading && filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-stone-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-stone-950">{order.user.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                        {order.drop.product.imageUrl ? (
                          <img src={order.drop.product.imageUrl} alt={order.drop.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-stone-300 text-base">image</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-stone-800 truncate max-w-[160px]">
                        {order.drop.product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-stone-950">${Number(order.totalAmount).toLocaleString()}</p>
                    <p className="text-xs text-stone-400 mt-0.5">qty {order.quantity}</p>
                  </td>
                  <td className="px-6 py-5 text-xs text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded border ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleConfirm(order.id)}
                        disabled={confirmingId === order.id}
                        className="text-xs font-bold uppercase tracking-widest bg-stone-950 text-white px-4 h-8 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                      >
                        {confirmingId === order.id ? 'Confirming…' : 'Confirm'}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length > 0 && (
            <div className="p-5 border-t border-stone-50 flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                {filtered.length} order{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <div className="h-3 bg-stone-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}
