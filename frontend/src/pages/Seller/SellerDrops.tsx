import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMyDrops } from '../../services/seller.service'
import type { Drop, DropStatus } from '../../types/drop.types'

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
  return {
    label: `${String(Math.floor(s / 3600)).padStart(2, '0')}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`,
    done: diff === 0,
  }
}

export default function SellerDrops() {
  const navigate = useNavigate()
  const [drops, setDrops] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await getMyDrops()
      setDrops(res.data.data.map(normalize))
    } catch {
      setError('Failed to load drops.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const now = Date.now()
  const scheduled = drops.filter(
    (d) => d.status === 'LIVE' || d.status === 'UPCOMING' ||
      (d.status === 'SOLD_OUT' && new Date(d.endTime).getTime() > now)
  )
  const past = drops.filter(
    (d) => d.status === 'ENDED' ||
      (d.status === 'SOLD_OUT' && new Date(d.endTime).getTime() <= now)
  )

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#fbf9f9]">
      <header className="h-16 flex items-center justify-between px-12 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-stone-100">
        <h1 className="text-xl font-black tracking-tighter text-stone-950">Drops Management</h1>
        <button
          onClick={() => navigate('/seller/drops/new')}
          className="h-10 px-6 bg-stone-950 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95"
        >
          + New Drop
        </button>
      </header>

      <div className="p-12 max-w-7xl w-full mx-auto space-y-16 flex-1">
        {error && (
          <div className="py-24 text-center">
            <p className="text-sm font-semibold text-red-500 mb-4">{error}</p>
            <button onClick={load} className="text-xs uppercase tracking-widest font-bold border border-stone-200 px-6 h-9 rounded hover:bg-stone-950 hover:text-white transition-all">
              Retry
            </button>
          </div>
        )}

        {!error && (
          <>
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">Priority Queue</span>
                  <h2 className="text-3xl font-black tracking-tighter mt-1 text-stone-950">Scheduled Drops</h2>
                </div>
              </div>

              {loading && (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-8 h-64 bg-stone-100 rounded-xl animate-pulse" />
                  <div className="col-span-12 md:col-span-4 h-64 bg-stone-100 rounded-xl animate-pulse" />
                </div>
              )}

              {!loading && scheduled.length === 0 && (
                <div className="py-16 text-center bg-white border border-stone-100 rounded-xl">
                  <div className="inline-block w-10 h-10 border-2 border-stone-200 rounded-full mb-4" />
                  <p className="text-sm font-bold text-stone-950 mb-1">No active or upcoming drops.</p>
                  <p className="text-xs text-stone-400 mb-6">Schedule a drop to start selling.</p>
                  <button
                    onClick={() => navigate('/seller/drops/new')}
                    className="text-xs uppercase tracking-widest font-bold bg-stone-950 text-white px-6 h-9 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Create Drop
                  </button>
                </div>
              )}

              {!loading && scheduled.length > 0 && (
                <div className="grid grid-cols-12 gap-6">
                  <DropFeatureCard drop={scheduled[0]} />
                  {scheduled[1] && <DropSideCard drop={scheduled[1]} />}
                  {scheduled.slice(2).map((d) => (
                    <div key={d.id} className="col-span-12 md:col-span-4">
                      <DropSideCard drop={d} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Archive</span>
                <h2 className="text-3xl font-black tracking-tighter mt-1 text-stone-950">Past Drops</h2>
              </div>

              <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      {['Product Drop', 'Date', 'Performance', 'Status', 'Revenue', ''].map((h) => (
                        <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-stone-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {loading && Array.from({ length: 3 }).map((_, i) => <PastRowSkeleton key={i} />)}

                    {!loading && past.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-8 py-16 text-center text-sm text-stone-400">
                          No past drops yet. The archive will fill as drops end.
                        </td>
                      </tr>
                    )}

                    {!loading && past.map((d, i) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-stone-50/50 transition-colors group"
                      >
                        <PastDropRow drop={d} onEdit={() => navigate(`/seller/drops/${d.id}/edit`)} />
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {!loading && past.length > 0 && (
                  <div className="p-6 border-t border-stone-50 flex justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      {past.length} completed drop{past.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      <button
        onClick={() => navigate('/seller/drops/new')}
        className="fixed bottom-10 right-10 bg-amber-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50"
        title="New Drop"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>
    </div>
  )
}

function DropFeatureCard({ drop }: { drop: Drop }) {
  const isLive = drop.status === 'LIVE'
  const isSoldOutActive = drop.status === 'SOLD_OUT'
  const target = isLive || isSoldOutActive ? drop.endTime : drop.startTime
  const countdown = useCountdown(target)
  const soldPct = Math.round((drop.sold / drop.stock) * 100)

  return (
    <div className="col-span-12 md:col-span-8 bg-stone-100 rounded-xl overflow-hidden group border border-stone-200 hover:shadow-xl transition-all">
      <div className="flex flex-col md:flex-row h-full min-h-[260px]">
        <div className="md:w-3/5 overflow-hidden bg-stone-900">
          {drop.product.imageUrl ? (
            <img
              src={drop.product.imageUrl}
              alt={drop.product.name}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOutActive ? 'grayscale opacity-70' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[200px]">
              <span className="material-symbols-outlined text-stone-600 text-4xl">image</span>
            </div>
          )}
        </div>
        <div className="md:w-2/5 p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-amber-600 animate-pulse' : isSoldOutActive ? 'bg-stone-300' : 'bg-stone-400'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isLive ? 'text-amber-700' : isSoldOutActive ? 'text-stone-400' : 'text-stone-500'}`}>
                {isSoldOutActive ? `All reserved — window closes ${countdown.label}` : isLive ? `Ends in ${countdown.label}` : `Live in ${countdown.label}`}
              </span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-stone-950 mb-2">{drop.product.name}</h3>
            <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-6">
              {drop.product.description}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Inventory Reserved</span>
                <span className="text-sm font-bold text-stone-950">{drop.stock} Units</span>
              </div>
              <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-800 to-amber-500 transition-all"
                  style={{ width: `${soldPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                <span>{soldPct}% sold</span>
                <span>{drop.stock - drop.sold} remaining</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs font-bold text-stone-950 border-b-2 border-stone-900 pb-0.5 w-max">
            ${Number(drop.product.price).toLocaleString()} per unit
          </p>
        </div>
      </div>
    </div>
  )
}

function DropSideCard({ drop }: { drop: Drop }) {
  const isLive = drop.status === 'LIVE'
  const isSoldOutActive = drop.status === 'SOLD_OUT'
  const target = isLive || isSoldOutActive ? drop.endTime : drop.startTime
  const countdown = useCountdown(target)

  return (
    <div className="col-span-12 md:col-span-4 bg-white rounded-xl p-8 border border-stone-100 flex flex-col justify-between group hover:shadow-xl transition-all cursor-pointer">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          {isSoldOutActive ? `All reserved — closes ${countdown.label}` : isLive ? `Live — ends ${countdown.label}` : `Starts ${countdown.label}`}
        </span>
        <h3 className="text-lg font-black tracking-tight mt-2 mb-4 text-stone-950">{drop.product.name}</h3>
        <div className="aspect-square bg-stone-50 rounded-lg overflow-hidden mb-4">
          {drop.product.imageUrl ? (
            <img
              src={drop.product.imageUrl}
              alt={drop.product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-stone-300 text-3xl">image</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-amber-700">
          ${Number(drop.product.price).toLocaleString()} · {drop.stock} units
        </span>
        <span className="material-symbols-outlined text-stone-400 group-hover:text-stone-950 transition-colors">arrow_forward_ios</span>
      </div>
    </div>
  )
}

function PastDropRow({ drop, onEdit }: { drop: Drop; onEdit: () => void }) {
  const soldPct = Math.round((drop.sold / drop.stock) * 100)
  const revenue = Number(drop.product.price) * drop.sold
  const isSoldOut = drop.status === 'SOLD_OUT'

  return (
    <>
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
            {drop.product.imageUrl ? (
              <img src={drop.product.imageUrl} alt={drop.product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-stone-300 text-lg">image</span>
              </div>
            )}
          </div>
          <span className="font-bold text-sm tracking-tight text-stone-950">{drop.product.name}</span>
        </div>
      </td>
      <td className="px-8 py-6 text-sm text-stone-500">
        {new Date(drop.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="px-8 py-6">
        <div className="w-32">
          <div className="flex justify-between text-[10px] font-bold mb-1 text-stone-400">
            <span>{isSoldOut ? 'SOLD OUT' : `${soldPct}% sold`}</span>
            <span>{soldPct}%</span>
          </div>
          <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-stone-900 rounded-full" style={{ width: `${soldPct}%` }} />
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
          isSoldOut ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
        }`}>
          {isSoldOut ? 'Sold Out' : 'Ended'}
        </span>
      </td>
      <td className="px-8 py-6 font-bold text-sm text-stone-950">
        ${revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
      </td>
      <td className="px-8 py-6 text-right">
        <button
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined text-stone-400 hover:text-stone-950 transition-colors">more_horiz</span>
        </button>
      </td>
    </>
  )
}

function PastRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-100 rounded-lg" />
          <div className="h-3 w-32 bg-stone-100 rounded" />
        </div>
      </td>
      <td className="px-8 py-6"><div className="h-3 w-20 bg-stone-100 rounded" /></td>
      <td className="px-8 py-6"><div className="h-3 w-28 bg-stone-100 rounded" /></td>
      <td className="px-8 py-6"><div className="h-5 w-16 bg-stone-100 rounded-full" /></td>
      <td className="px-8 py-6"><div className="h-3 w-16 bg-stone-100 rounded" /></td>
      <td className="px-8 py-6" />
    </tr>
  )
}
