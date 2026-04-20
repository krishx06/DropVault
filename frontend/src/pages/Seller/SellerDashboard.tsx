import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMyDrops, getSellerOrders, type SellerOrder } from '../../services/seller.service'
import { getMyProducts } from '../../services/product.service'
import type { Drop, DropStatus } from '../../types/drop.types'
import type { Product } from '../../types/product.types'

function normalize(d: Drop): Drop {
  return { ...d, status: d.status?.toUpperCase() as DropStatus }
}

function useCountdown(target: string | null) {
  const [diff, setDiff] = useState(() =>
    target ? Math.max(0, new Date(target).getTime() - Date.now()) : 0
  )
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setDiff(Math.max(0, new Date(target).getTime() - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])
  const s = Math.floor(diff / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return { h, m, sec, done: diff === 0 }
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-stone-100 text-stone-400 border-stone-200',
}

export default function SellerDashboard() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyDrops(), getMyProducts(), getSellerOrders()])
      .then(([dropsRes, productsRes, ordersRes]) => {
        setDrops(dropsRes.data.data.map(normalize))
        setProducts(productsRes.data.data)
        setOrders(ordersRes.data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const liveDrops = drops.filter((d) => d.status === 'LIVE')
  const upcomingDrops = drops.filter((d) => d.status === 'UPCOMING')
  const endedDrops = drops.filter((d) => d.status === 'ENDED' || d.status === 'SOLD_OUT')
  const approvedProducts = products.filter((p) => p.isApproved)
  const pendingOrders = orders.filter((o) => o.status === 'PENDING')
  const revenue = orders
    .filter((o) => o.status === 'CONFIRMED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0)

  const liveDrop = liveDrops[0] ?? null
  const recentOrders = orders.slice(0, 5)

  if (loading) return <DashboardSkeleton />

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fbf9f9]">
      <header className="h-16 flex items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-stone-100">
        <h1 className="text-xl font-black tracking-tighter text-stone-950">Overview</h1>
        <Link
          to="/seller/drops/new"
          className="h-9 px-5 bg-stone-950 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">bolt</span>
          New Drop
        </Link>
      </header>

      <div className="p-12 max-w-7xl w-full mx-auto space-y-10 flex-1">

        {/* Stats bento */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: 'Confirmed Revenue',
              value: `$${revenue.toLocaleString()}`,
              sub: `${orders.filter((o) => o.status === 'CONFIRMED').length} orders`,
              accent: 'text-stone-950',
              icon: 'payments',
            },
            {
              label: 'Pending Orders',
              value: pendingOrders.length,
              sub: 'awaiting confirmation',
              accent: pendingOrders.length > 0 ? 'text-amber-700' : 'text-stone-950',
              icon: 'inbox',
            },
            {
              label: 'Active Drops',
              value: liveDrops.length + upcomingDrops.length,
              sub: `${liveDrops.length} live · ${upcomingDrops.length} upcoming`,
              accent: liveDrops.length > 0 ? 'text-amber-700' : 'text-stone-950',
              icon: 'bolt',
            },
            {
              label: 'Products',
              value: approvedProducts.length,
              sub: `${products.filter((p) => !p.isApproved).length} pending approval`,
              accent: 'text-stone-950',
              icon: 'inventory_2',
            },
          ].map(({ label, value, sub, accent, icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="bg-white border border-stone-100 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">{label}</p>
                <span className="material-symbols-outlined text-stone-200 text-xl">{icon}</span>
              </div>
              <p className={`text-3xl font-black tracking-tight mb-1 ${accent}`}>{value}</p>
              <p className="text-xs text-stone-400">{sub}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-12 gap-6">

          {/* Live drop spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Live Right Now</p>
              {liveDrops.length > 1 && (
                <Link to="/seller/drops" className="text-[10px] uppercase tracking-widest font-bold text-amber-700 hover:underline">
                  View all {liveDrops.length} →
                </Link>
              )}
            </div>

            {liveDrop ? (
              <LiveDropCard drop={liveDrop} />
            ) : upcomingDrops[0] ? (
              <UpcomingDropCard drop={upcomingDrops[0]} />
            ) : (
              <div className="bg-white border border-stone-100 rounded-2xl p-10 text-center">
                <span className="material-symbols-outlined text-stone-200 text-5xl mb-3 block">bolt</span>
                <p className="text-sm font-bold text-stone-950 mb-1">No active drops</p>
                <p className="text-xs text-stone-400 mb-5">Schedule a drop to start selling.</p>
                <Link
                  to="/seller/drops/new"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold bg-stone-950 text-white px-5 h-9 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Schedule Drop
                </Link>
              </div>
            )}
          </motion.div>

          {/* Drop breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="col-span-12 lg:col-span-5 space-y-4"
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Drop Breakdown</p>
            <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
              {[
                { label: 'Live', count: liveDrops.length, color: 'bg-amber-500', pulse: true },
                { label: 'Upcoming', count: upcomingDrops.length, color: 'bg-stone-400', pulse: false },
                { label: 'Ended / Sold Out', count: endedDrops.length, color: 'bg-stone-200', pulse: false },
              ].map(({ label, count, color, pulse }, i) => (
                <div key={label} className={`flex items-center justify-between px-6 py-4 ${i !== 2 ? 'border-b border-stone-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-semibold text-stone-700">{label}</span>
                  </div>
                  <span className="text-sm font-black text-stone-950">{count}</span>
                </div>
              ))}
              <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Total</span>
                <span className="text-sm font-black text-stone-950">{drops.length}</span>
              </div>
            </div>

            <Link
              to="/seller/drops"
              className="flex items-center justify-between w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 hover:border-stone-300 hover:shadow-sm transition-all group"
            >
              <span className="text-sm font-bold text-stone-950">Manage Drops</span>
              <span className="material-symbols-outlined text-stone-400 group-hover:text-stone-950 transition-colors text-xl">arrow_forward</span>
            </Link>

            <Link
              to="/seller/products"
              className="flex items-center justify-between w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 hover:border-stone-300 hover:shadow-sm transition-all group"
            >
              <div>
                <span className="text-sm font-bold text-stone-950">Products</span>
                {products.filter((p) => !p.isApproved).length > 0 && (
                  <span className="ml-2 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {products.filter((p) => !p.isApproved).length} pending
                  </span>
                )}
              </div>
              <span className="material-symbols-outlined text-stone-400 group-hover:text-stone-950 transition-colors text-xl">arrow_forward</span>
            </Link>
          </motion.div>
        </div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Recent Orders</p>
            <Link to="/seller/orders" className="text-[10px] uppercase tracking-widest font-bold text-amber-700 hover:underline">
              View all →
            </Link>
          </div>

          <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-stone-400">No orders yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {['Customer', 'Product', 'Total', 'Date', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-stone-950">{order.user.name}</p>
                        <p className="text-xs text-stone-400">{order.user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                            {order.drop.product.imageUrl ? (
                              <img src={order.drop.product.imageUrl} alt={order.drop.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-stone-300 text-sm">image</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-stone-700 truncate max-w-[140px]">{order.drop.product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-stone-950">
                        ${Number(order.totalAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded border ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function LiveDropCard({ drop }: { drop: Drop }) {
  const soldPct = Math.round((drop.sold / drop.stock) * 100)
  const slotsLeft = drop.stock - drop.sold
  const countdown = useCountdown(drop.endTime)

  return (
    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row min-h-[220px]">
        <div className="sm:w-2/5 bg-stone-900 overflow-hidden relative">
          {drop.product.imageUrl ? (
            <img src={drop.product.imageUrl} alt={drop.product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full min-h-[180px] flex items-center justify-center">
              <span className="material-symbols-outlined text-stone-600 text-4xl">image</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
            <span className="animate-pulse inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-white">Live Now</span>
          </div>
        </div>
        <div className="sm:w-3/5 p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black tracking-tight text-stone-950 mb-1">{drop.product.name}</h3>
            <p className="text-sm text-stone-400 line-clamp-2 mb-5">{drop.product.description}</p>

            <div className="mb-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-400 mb-1.5">
                <span>Vault progress</span>
                <span>{slotsLeft} of {drop.stock} left</span>
              </div>
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full transition-all" style={{ width: `${soldPct}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Ends in</p>
              <div className="flex items-end gap-1 tabular-nums">
                {countdown.done ? (
                  <span className="text-lg font-black text-amber-700">Closing…</span>
                ) : (
                  <>
                    <span className="text-2xl font-black tracking-tighter text-stone-950">{String(countdown.h).padStart(2,'0')}</span>
                    <span className="text-stone-400 font-bold mb-0.5">h</span>
                    <span className="text-2xl font-black tracking-tighter text-stone-950">{String(countdown.m).padStart(2,'0')}</span>
                    <span className="text-stone-400 font-bold mb-0.5">m</span>
                    <span className="text-2xl font-black tracking-tighter text-stone-950">{String(countdown.sec).padStart(2,'0')}</span>
                    <span className="text-stone-400 font-bold mb-0.5">s</span>
                  </>
                )}
              </div>
            </div>
            <Link
              to="/seller/drops"
              className="text-xs uppercase tracking-widest font-bold text-stone-950 border-b-2 border-stone-950 pb-0.5 hover:text-amber-700 hover:border-amber-700 transition-colors"
            >
              Manage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function UpcomingDropCard({ drop }: { drop: Drop }) {
  const countdown = useCountdown(drop.startTime)

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-7">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-2 h-2 rounded-full bg-stone-400" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Next Drop</span>
      </div>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-black tracking-tight text-stone-950 mb-1">{drop.product.name}</h3>
          <p className="text-sm text-stone-400 line-clamp-2 mb-6">{drop.product.description}</p>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Starts in</p>
            <div className="flex items-end gap-1 tabular-nums">
              {countdown.done ? (
                <span className="text-lg font-black text-amber-700">Starting…</span>
              ) : (
                <>
                  <span className="text-3xl font-black tracking-tighter text-stone-950">{String(countdown.h).padStart(2,'0')}</span>
                  <span className="text-stone-400 font-bold mb-0.5 text-sm">h</span>
                  <span className="text-3xl font-black tracking-tighter text-stone-950">{String(countdown.m).padStart(2,'0')}</span>
                  <span className="text-stone-400 font-bold mb-0.5 text-sm">m</span>
                  <span className="text-3xl font-black tracking-tighter text-stone-950">{String(countdown.sec).padStart(2,'0')}</span>
                  <span className="text-stone-400 font-bold mb-0.5 text-sm">s</span>
                </>
              )}
            </div>
          </div>
        </div>
        {drop.product.imageUrl && (
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0">
            <img src={drop.product.imageUrl} alt={drop.product.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fbf9f9]">
      <div className="h-16 bg-white border-b border-stone-100" />
      <div className="p-12 max-w-7xl w-full mx-auto space-y-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-stone-100 rounded-2xl p-6 animate-pulse">
              <div className="h-3 w-24 bg-stone-100 rounded mb-4" />
              <div className="h-8 w-20 bg-stone-100 rounded mb-2" />
              <div className="h-2 w-32 bg-stone-100 rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 bg-white border border-stone-100 rounded-2xl h-56 animate-pulse" />
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <div className="bg-white border border-stone-100 rounded-2xl h-40 animate-pulse" />
            <div className="bg-white border border-stone-100 rounded-2xl h-12 animate-pulse" />
            <div className="bg-white border border-stone-100 rounded-2xl h-12 animate-pulse" />
          </div>
        </div>
        <div className="bg-white border border-stone-100 rounded-2xl h-48 animate-pulse" />
      </div>
    </div>
  )
}
