import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyOrders, cancelOrder } from '../../services/order.service'
import type { Order, OrderStatus } from '../../types/order.types'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const CANCEL_WINDOW_MS = 60_000

function useCancelSecondsLeft(createdAt: string) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Date.now() - new Date(createdAt).getTime()
    return Math.max(0, Math.ceil((CANCEL_WINDOW_MS - elapsed) / 1000))
  })

  useEffect(() => {
    if (secondsLeft === 0) return
    const id = setInterval(() => {
      const elapsed = Date.now() - new Date(createdAt).getTime()
      const left = Math.max(0, Math.ceil((CANCEL_WINDOW_MS - elapsed) / 1000))
      setSecondsLeft(left)
      if (left === 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [createdAt, secondsLeft])

  return secondsLeft
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-stone-100 text-stone-500 border-stone-200',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await getMyOrders()
      setOrders(res.data.data)
    } catch {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCancel(id: string) {
    setCancellingId(id)
    setCancelError('')
    try {
      const res = await cancelOrder(id)
      setOrders((prev) => prev.map((o) => (o.id === id ? res.data.data : o)))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setCancelError(msg ?? 'Could not cancel order.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">Account</p>
          <h1 className="text-5xl font-black tracking-tighter text-stone-950">My Orders</h1>
        </div>

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        )}

        {error && !loading && (
          <div className="py-24 text-center">
            <p className="text-sm font-semibold text-red-500 mb-4">{error}</p>
            <button onClick={load} className="text-xs uppercase tracking-widest font-bold border border-stone-200 px-6 h-9 rounded hover:bg-stone-950 hover:text-white transition-all">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="py-32 text-center">
            <div className="inline-block w-12 h-12 border-2 border-stone-200 rounded-full mb-6" />
            <h2 className="text-xl font-black tracking-tight text-stone-950 mb-2">No orders yet.</h2>
            <p className="text-sm text-stone-400 mb-6">You haven't placed any orders from the vault.</p>
            <Link
              to="/drops?status=live"
              className="inline-block text-xs uppercase tracking-widest font-bold bg-stone-950 text-white px-6 h-10 rounded-lg leading-10 hover:bg-amber-700 transition-colors"
            >
              Browse Live Drops
            </Link>
          </div>
        )}

        {cancelError && (
          <p className="mb-4 text-xs font-semibold text-red-500 text-center">{cancelError}</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <AnimatePresence>
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <OrderRow
                    order={order}
                    cancelling={cancellingId === order.id}
                    onCancel={handleCancel}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
      <Footer />
    </div>
  )
}

function OrderRow({
  order,
  cancelling,
  onCancel,
}: {
  order: Order
  cancelling: boolean
  onCancel: (id: string) => void
}) {
  const drop = order.drop
  const isEnded = drop?.status === 'ENDED' || drop?.status === 'SOLD_OUT'
  const cancelSecondsLeft = useCancelSecondsLeft(order.createdAt)
  const canCancel = order.status === 'PENDING' && cancelSecondsLeft > 0

  return (
    <div className="bg-white border border-stone-100 rounded-xl overflow-hidden hover:border-stone-200 transition-colors">
      <div className="flex gap-0 items-stretch">
        {drop?.product.imageUrl ? (
          <div className="w-28 shrink-0 bg-stone-900">
            <img
              src={drop.product.imageUrl}
              alt={drop.product.name}
              className={`w-full h-full object-cover ${isEnded ? 'grayscale opacity-60' : ''}`}
            />
          </div>
        ) : (
          <div className="w-28 shrink-0 bg-stone-100 flex items-center justify-center">
            <span className="text-stone-400 text-xs">No img</span>
          </div>
        )}

        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                to={drop ? `/drops/${drop.id}` : '#'}
                className="text-base font-black tracking-tight text-stone-950 hover:text-amber-700 transition-colors truncate block"
              >
                {drop?.product.name ?? 'Unknown Product'}
              </Link>
              <p className="text-xs text-stone-400 mt-0.5">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <span className={`shrink-0 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-stone-400">
                Qty <span className="text-stone-950 font-bold">{order.quantity}</span>
                <span className="mx-2 text-stone-200">·</span>
                Total <span className="text-stone-950 font-bold">${order.totalAmount.toLocaleString()}</span>
              </p>
              <p className="text-[10px] text-stone-400">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>

            {canCancel && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] tabular-nums font-semibold text-stone-400">
                  {cancelSecondsLeft}s
                </span>
                <button
                  onClick={() => onCancel(order.id)}
                  disabled={cancelling}
                  className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling…' : 'Cancel'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderSkeleton() {
  return (
    <div className="bg-white border border-stone-100 rounded-xl overflow-hidden animate-pulse flex h-28">
      <div className="w-28 bg-stone-100 shrink-0" />
      <div className="flex-1 p-5 space-y-3">
        <div className="h-4 w-2/3 bg-stone-100 rounded" />
        <div className="h-3 w-1/3 bg-stone-100 rounded" />
        <div className="h-3 w-1/2 bg-stone-100 rounded mt-auto" />
      </div>
    </div>
  )
}
