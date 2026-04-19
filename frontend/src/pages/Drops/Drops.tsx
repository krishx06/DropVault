import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getDrops } from '../../services/drop.service'
import type { Drop, DropStatus } from '../../types/drop.types'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

type FilterTab = 'ALL' | DropStatus

const TABS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Ended', value: 'ENDED' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Drops() {
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = (searchParams.get('status')?.toUpperCase() as FilterTab) ?? 'ALL'
  const [activeTab, setActiveTab] = useState<FilterTab>(tabParam)
  const [drops, setDrops] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setActiveTab(tabParam)
  }, [tabParam])

  useEffect(() => {
    async function fetchDrops() {
      setLoading(true)
      setError('')
      try {
        const status = activeTab === 'ALL' ? undefined : (activeTab as DropStatus)
        const res = await getDrops(status)
        setDrops(res.data.data)
      } catch {
        setError('Failed to load drops. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchDrops()
  }, [activeTab])

  function handleTabChange(tab: FilterTab) {
    setActiveTab(tab)
    if (tab === 'ALL') {
      setSearchParams({})
    } else {
      setSearchParams({ status: tab.toLowerCase() })
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">Browse</p>
          <h1 className="text-5xl font-black tracking-tighter text-stone-950">All Drops</h1>
        </div>

        <div className="flex items-center gap-1 mb-10 border-b border-stone-100 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`relative px-5 py-3 text-xs uppercase tracking-widest font-bold transition-colors ${
                activeTab === tab.value
                  ? 'text-stone-950'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {tab.label}
              {tab.value === 'LIVE' && (
                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse-dot" />
              )}
              {activeTab === tab.value && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-950"
                />
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <DropCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="py-24 text-center">
            <p className="text-sm font-semibold text-red-500 mb-4">{error}</p>
            <button
              onClick={() => handleTabChange(activeTab)}
              className="text-xs uppercase tracking-widest font-bold text-stone-950 border border-stone-200 px-6 h-9 rounded hover:bg-stone-950 hover:text-white transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && drops.length === 0 && (
          <EmptyState tab={activeTab} />
        )}

        {!loading && !error && drops.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {drops.map((drop) => (
                <motion.div key={drop.id} variants={itemVariants}>
                  <DropCard drop={drop} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  )
}

function DropCard({ drop }: { drop: Drop }) {
  const slotsLeft = drop.stock - drop.sold
  const soldOutPct = Math.round((drop.sold / drop.stock) * 100)
  const isEnded = drop.status === 'ENDED' || drop.status === 'SOLD_OUT'

  return (
    <Link to={`/drops/${drop.id}`}>
      <div className="group border border-stone-100 bg-white rounded-xl overflow-hidden hover:border-stone-300 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
        <div className="relative h-52 bg-stone-900 overflow-hidden">
          {drop.product.imageUrl ? (
            <img
              src={drop.product.imageUrl}
              alt={drop.product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${isEnded ? 'grayscale opacity-60' : 'group-hover:scale-105'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-stone-600 text-xs uppercase tracking-widest">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <StatusBadge status={drop.status} />
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
            <span className="text-[9px] uppercase tracking-widest font-bold text-white/70">
              {isEnded ? `${soldOutPct}% sold` : `${slotsLeft} left`}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1 mb-5">
            <h3 className="text-lg font-black tracking-tight text-stone-950 mb-1">
              {drop.product.name}
            </h3>
            <p className="text-sm text-stone-500 leading-snug line-clamp-2">
              {drop.product.description}
            </p>
          </div>

          {!isEnded && (
            <div className="mb-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-400 mb-1.5">
                <span>Vault progress</span>
                <span>{slotsLeft} of {drop.stock} left</span>
              </div>
              <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all"
                  style={{ width: `${soldOutPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Price</p>
              <p className="text-2xl font-black tracking-tight text-stone-950">
                ${drop.product.price.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                {drop.status === 'UPCOMING' ? 'Starts' : drop.status === 'LIVE' ? 'Ends' : 'Ended'}
              </p>
              <p className="text-xs font-semibold text-stone-600">
                {new Date(drop.status === 'UPCOMING' ? drop.startTime : drop.endTime).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <button
            className={`mt-5 w-full h-10 font-bold text-xs uppercase tracking-widest rounded-lg transition-all ${
              isEnded
                ? 'bg-stone-100 text-stone-400 cursor-default'
                : 'bg-stone-950 text-white hover:-translate-y-px hover:shadow-md group-hover:bg-amber-700'
            }`}
          >
            {drop.status === 'LIVE' ? 'Enter Drop' : drop.status === 'UPCOMING' ? 'Notify Me' : 'Ended'}
          </button>
        </div>
      </div>
    </Link>
  )
}

function StatusBadge({ status }: { status: Drop['status'] }) {
  const configs = {
    LIVE: { label: 'Live Now', dot: true, color: 'text-white' },
    UPCOMING: { label: 'Dropping Soon', dot: false, color: 'text-white' },
    ENDED: { label: 'Ended', dot: false, color: 'text-white/60' },
    SOLD_OUT: { label: 'Sold Out', dot: false, color: 'text-white/60' },
  }
  const { label, dot, color } = configs[status]

  return (
    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
      {dot && <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />}
      <span className={`text-[9px] uppercase tracking-widest font-bold ${color}`}>{label}</span>
    </div>
  )
}

function DropCardSkeleton() {
  return (
    <div className="border border-stone-100 bg-white rounded-xl overflow-hidden animate-pulse">
      <div className="h-52 bg-stone-100" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-full" />
        <div className="h-3 bg-stone-100 rounded w-2/3" />
        <div className="h-8 bg-stone-100 rounded mt-4" />
      </div>
    </div>
  )
}

function EmptyState({ tab }: { tab: FilterTab }) {
  const messages: Record<FilterTab, { heading: string; sub: string }> = {
    ALL: { heading: 'No drops yet.', sub: 'Check back soon — the vault is being stocked.' },
    LIVE: { heading: 'Nothing live right now.', sub: 'Follow the vault to get notified when a drop goes live.' },
    UPCOMING: { heading: 'No upcoming drops.', sub: "We're curating the next batch. Stay tuned." },
    ENDED: { heading: 'No past drops.', sub: "The archive will fill as drops end." },
    SOLD_OUT: { heading: 'Nothing sold out yet.', sub: '' },
  }
  const { heading, sub } = messages[tab]

  return (
    <div className="py-32 text-center">
      <div className="inline-block w-12 h-12 border-2 border-stone-200 rounded-full mb-6" />
      <h2 className="text-xl font-black tracking-tight text-stone-950 mb-2">{heading}</h2>
      {sub && <p className="text-sm text-stone-400 max-w-xs mx-auto">{sub}</p>}
    </div>
  )
}
