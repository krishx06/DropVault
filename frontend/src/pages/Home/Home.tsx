import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getDrops } from '../../services/drop.service'
import { getPublicSellers, type PublicSeller } from '../../services/seller.service'
import type { Drop } from '../../types/drop.types'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'


const FEATURED = {
  label: "The Curator's Choice",
  title: 'The Nomad Overcoat',
  quote: '"A study in sculptural minimalism. Architectural structure meets fluid textile movement."',
  body: 'Crafted from reclaimed Italian wool. Limited to 25 hand-numbered editions globally.',
  price: '$890',
  left: 4,
  total: 25,
  image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
}




const STATS = [
  { value: '2,400+', label: 'Items curated' },
  { value: '140+', label: 'Verified sellers' },
  { value: '18 min', label: 'Avg drop sell-through' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Home() {
  const [activeDrops, setActiveDrops] = useState<Drop[]>([])
  const [dropsLoading, setDropsLoading] = useState(true)
  const [dropsArePast, setDropsArePast] = useState(false)
  const [soldOutDrops, setSoldOutDrops] = useState<Drop[]>([])
  const [sellers, setSellers] = useState<PublicSeller[]>([])

  useEffect(() => {
    async function fetchActive() {
      try {
        const [liveRes, upcomingRes] = await Promise.all([
          getDrops('LIVE'),
          getDrops('UPCOMING'),
        ])
        const active = [...liveRes.data.data, ...upcomingRes.data.data]
        if (active.length > 0) {
          setActiveDrops(active.slice(0, 3))
        } else {
          const [endedRes, soldOutRes] = await Promise.all([
            getDrops('ENDED'),
            getDrops('SOLD_OUT'),
          ])
          setActiveDrops([...endedRes.data.data, ...soldOutRes.data.data].slice(0, 3))
          setDropsArePast(true)
        }
      } catch { /* fail silently */ } finally {
        setDropsLoading(false)
      }
    }
    fetchActive()

    async function fetchSoldOut() {
      try {
        const [soldOutRes, endedRes] = await Promise.all([getDrops('SOLD_OUT'), getDrops('ENDED')])
        setSoldOutDrops([...soldOutRes.data.data, ...endedRes.data.data].slice(0, 4))
      } catch { /* fail silently */ }
    }
    fetchSoldOut()

    async function fetchSellers() {
      try {
        const res = await getPublicSellers()
        setSellers(res.data.data)
      } catch { /* fail silently */ }
    }
    fetchSellers()
  }, [])

  return (
    <div className="min-h-screen bg-[#fbf9f9]">
      <Navbar />

      <main>

        <section className="max-w-6xl mx-auto px-6 pt-13 pb-24">
          <div className="flex flex-col lg:flex-row lg:items-center gap-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="animate-pulse-dot inline-block w-2 h-2 rounded-full bg-amber-600" />
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-700">
                  Drops are live
                </span>
              </div>

              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-stone-950 leading-[0.93] mb-8">
                The vault
                <br />
                <span className="italic text-stone-400">is open.</span>
              </h1>

              <p className="text-stone-500 text-xl max-w-lg leading-relaxed mb-12">
                Time-limited access to rare, curated pieces from verified independent sellers.
                Miss a drop, miss it forever.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/drops?status=live"
                  className="h-13 px-9 bg-stone-950 text-white font-bold text-sm uppercase tracking-widest rounded hover:-translate-y-px hover:shadow-lg transition-all inline-flex items-center"
                >
                  Browse Live Drops
                </Link>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-13 px-9 border border-stone-200 text-stone-950 font-bold text-sm uppercase tracking-widest rounded hover:border-stone-400 transition-all"
                >
                  How It Works
                </button>
              </div>
            </motion.div>

            <HeroVisual />
          </div>
        </section>



        <section id="active-drops" className="max-w-6xl mx-auto px-6 py-18">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">
                {dropsArePast ? 'Recently Ended' : 'Current & Upcoming'}
              </p>
              <h2 className="text-4xl font-black tracking-tighter text-stone-950">
                {dropsArePast ? 'Past Drops' : 'Active Drops'}
              </h2>
            </div>
            <Link to="/drops" className="text-xs uppercase tracking-widest font-bold text-amber-700 hover:underline underline-offset-4 hidden sm:block">
              View All →
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {dropsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-stone-100 bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-stone-100" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-stone-100 rounded w-3/4" />
                      <div className="h-3 bg-stone-100 rounded w-full" />
                      <div className="h-10 bg-stone-100 rounded mt-4" />
                    </div>
                  </div>
                ))
              : activeDrops.map((drop) => (
                  <motion.div key={drop.id} variants={itemVariants}>
                    <DropCard drop={drop} />
                  </motion.div>
                ))
            }
          </motion.div>
        </section>

        <Divider />


        <section className="max-w-6xl mx-auto px-6 py-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-stone-100"
          >
            <div className="relative h-96 lg:h-auto bg-stone-900 overflow-hidden">
              <img
                src={FEATURED.image}
                alt={FEATURED.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/20" />
            </div>

            <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-700 mb-5">
                {FEATURED.label}
              </p>
              <h2 className="text-5xl font-black tracking-tighter text-stone-950 leading-[0.95] mb-6">
                {FEATURED.title}
              </h2>
              <p className="text-stone-400 text-base italic leading-relaxed mb-4">
                {FEATURED.quote}
              </p>
              <p className="text-stone-500 text-sm leading-relaxed mb-10">
                {FEATURED.body}
              </p>

              <div className="flex items-end justify-between mb-6 pb-6 border-b border-stone-100">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Edition Status</p>
                  <p className="text-3xl font-black tracking-tighter text-stone-950">
                    {String(FEATURED.left).padStart(2, '0')} / {FEATURED.total} Left
                  </p>
                </div>
                <p className="text-3xl font-black tracking-tighter text-stone-950">{FEATURED.price}</p>
              </div>

              <button className="h-12 bg-amber-700 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-amber-600 hover:-translate-y-px hover:shadow-lg transition-all">
                Acquire Now
              </button>
            </div>
          </motion.div>
        </section>


        <section className="bg-stone-950 py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,#92400e_0%,transparent_60%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-6 relative z-10"
          >
            <div className="max-w-3xl mb-14">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-[1.05] italic mb-6">
                "Curation is the new scarcity."
              </h2>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-amber-700" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-stone-400">
                  The DropVault Standard
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 border-t border-stone-800 pt-12">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-black tracking-tighter text-white mb-1">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>


        <section className="max-w-6xl mx-auto px-6 py-18">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">
                Social proof
              </p>
              <h2 className="text-4xl font-black tracking-tighter text-stone-950">Recently Sold Out</h2>
            </div>
            <span className="hidden sm:block text-xs uppercase tracking-widest font-bold text-stone-300">
              Don't sleep on the next one
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {soldOutDrops.map((drop) => {
              const gmv = drop.sold * drop.product.price
              return (
                <motion.div
                  key={drop.id}
                  variants={itemVariants}
                  className="border border-stone-100 bg-white rounded-xl overflow-hidden"
                >
                  <Link to={`/drops/${drop.id}`}>
                    <div className="relative h-40 bg-stone-900 overflow-hidden">
                      {drop.product.imageUrl ? (
                        <img
                          src={drop.product.imageUrl}
                          alt={drop.product.name}
                          className="w-full h-full object-cover opacity-60 grayscale"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-stone-600 text-xs uppercase tracking-widest">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-white/60">
                          {drop.status === 'SOLD_OUT' ? 'Sold Out' : 'Ended'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-white/60">
                          {drop.sold} units
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-black tracking-tight text-stone-950 mb-4 line-clamp-1">
                        {drop.product.name}
                      </h3>
                      <div className="flex items-end justify-between border-t border-stone-50 pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Units sold</p>
                          <p className="text-base font-black text-amber-700">{drop.sold}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Total GMV</p>
                          <p className="text-base font-black text-stone-950">${gmv.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        <Divider />


        <section id="sellers" className="max-w-6xl mx-auto px-6 py-18">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">
                Verified Curators
              </p>
              <h2 className="text-4xl font-black tracking-tighter text-stone-950">Seller Spotlight</h2>
            </div>
            <button className="text-xs uppercase tracking-widest font-bold text-amber-700 hover:underline underline-offset-4 hidden sm:block">
              All Sellers →
            </button>
          </div>

          {sellers.length === 0 ? (
            <p className="text-sm text-stone-400">No approved sellers yet.</p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {sellers.map((seller) => {
                const initials = seller.user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <motion.div
                    key={seller.id}
                    variants={itemVariants}
                    className="group border border-stone-100 bg-white rounded-lg p-7 hover:border-stone-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-7">
                      <div className="w-13 h-13 rounded-full bg-stone-950 flex items-center justify-center shrink-0">
                        <span className="text-sm font-black tracking-tighter text-amber-500">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black tracking-tight text-stone-950 truncate">{seller.user.name}</h3>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                          Verified
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-stone-50 pt-5">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Products</p>
                      <p className="text-2xl font-black tracking-tight text-stone-950">{seller._count.products}</p>
                    </div>

                    <Link
                      to="/drops"
                      className="mt-6 w-full h-10 border border-stone-100 text-stone-950 font-bold text-xs uppercase tracking-widest rounded hover:bg-stone-950 hover:text-white hover:border-stone-950 transition-all flex items-center justify-center"
                    >
                      View Drops
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </section>


        <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-18">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">Process</p>
            <h2 className="text-4xl font-black tracking-tighter text-stone-950">How drops work</h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100"
          >
            {[
              {
                step: '01',
                title: 'Browse the vault',
                body: 'Explore curated drops from verified sellers. Each piece is reviewed before listing.',
              },
              {
                step: '02',
                title: 'Claim your slot',
                body: 'When a drop goes live, act fast. Slots are limited and items move in minutes, not hours.',
              },
              {
                step: '03',
                title: "It's yours",
                body: 'Secure checkout. Direct from seller. Tracked from vault to your hands.',
              },
            ].map((s) => (
              <motion.div key={s.step} variants={itemVariants} className="bg-[#fbf9f9] p-10">
                <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-5">{s.step}</p>
                <h3 className="text-xl font-black tracking-tight text-stone-950 mb-3">{s.title}</h3>
                <p className="text-base text-stone-500 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <Divider />


        <section className="max-w-6xl mx-auto px-6 py-18">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-stone-950 rounded-2xl p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_left,#92400e_0%,transparent_55%)]" />
            </div>

            <div className="relative z-10 max-w-xl">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-600 mb-4">
                Drop alerts
              </p>
              <h2 className="text-5xl font-black tracking-tighter text-white leading-tight mb-4">
                Never miss a drop.
              </h2>
              <p className="text-stone-400 text-base leading-relaxed mb-8">
                Get notified the moment a new drop goes live. No noise — only drops that match
                what you actually want.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="you@dropvault.com"
                  className="flex-1 h-12 px-5 bg-stone-800 border border-stone-700 rounded text-sm text-white placeholder:text-stone-500 outline-none focus:border-amber-700 transition-colors"
                />
                <button className="h-12 px-8 bg-amber-700 text-white font-bold text-xs uppercase tracking-widest rounded hover:bg-amber-600 hover:-translate-y-px hover:shadow-lg transition-all whitespace-nowrap">
                  Notify Me
                </button>
              </div>

              <p className="text-stone-600 text-xs uppercase tracking-widest mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            <div className="absolute right-12 bottom-12 hidden md:flex flex-col gap-2.5 text-right">
              {['Maison Noir dropped 2h ago', 'Archive Vol. 7 drops tomorrow', 'Monochrome Edit — 24 slots left'].map(
                (line) => (
                  <span key={line} className="text-xs text-stone-600 uppercase tracking-wider">
                    {line}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="h-px bg-stone-100" />
    </div>
  )
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="hidden lg:flex flex-1 items-center justify-center relative min-h-105"
    >
      {/* Ambient orbs */}
      <div className="absolute top-8 right-8 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-48 h-48 bg-stone-300/30 rounded-full blur-2xl pointer-events-none" />

      {/* Back card */}
      <motion.div
        animate={{ y: [10, -6, 10], rotate: [-2, -4, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 right-4 w-52 bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-xl"
        style={{ perspective: 800, rotateY: -10, rotateX: 4 }}
      >
        <div className="h-32 bg-stone-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
            alt="Archive Selects"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="p-4">
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Dropping Soon</p>
          <p className="text-sm font-black tracking-tight text-stone-950">Archive Selects Vol. 7</p>
          <p className="text-base font-black text-stone-950 mt-2">From $180</p>
        </div>
      </motion.div>

      {/* Third card (bottom-left) */}
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [3, 5, 3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-4 left-4 w-44 bg-stone-950 border border-stone-800 rounded-2xl p-4 shadow-xl"
        style={{ perspective: 800, rotateY: 8, rotateX: -4 }}
      >
        <p className="text-[9px] uppercase tracking-widest text-amber-600 mb-2">Next drop</p>
        <p className="text-sm font-black text-white leading-tight">Monochrome Edit</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">In 3 days</span>
        </div>
      </motion.div>

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="relative z-10 w-64 bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-2xl"
        style={{ perspective: 800, rotateY: 4, rotateX: -2 }}
      >
        <div className="h-44 bg-stone-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
            alt="Maison Noir SS25"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
            <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-white">Live Now</span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-black tracking-tight text-stone-950 mb-0.5">Maison Noir SS25</p>
          <p className="text-[11px] text-stone-400 mb-4">Structured silhouettes. Zero compromise.</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black tracking-tight text-stone-950">$420</p>
            <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">3 slots left</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DropCard({ drop }: { drop: Drop }) {
  const isLive = drop.status === 'LIVE'
  const slotsLeft = drop.stock - drop.sold
  const timeTarget = isLive ? drop.endTime : drop.startTime

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])

  const timeLabel = (() => {
    const diff = new Date(timeTarget).getTime() - now
    if (diff <= 0) return isLive ? 'Ending now' : 'Starting now'
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    if (h < 24) return `${h}h ${m}m ${isLive ? 'left' : ''}`
    const d = Math.floor(h / 24)
    return `In ${d} day${d !== 1 ? 's' : ''}`
  })()

  return (
    <Link to={`/drops/${drop.id}`}>
      <div className="group border border-stone-100 bg-white rounded-xl overflow-hidden hover:border-stone-300 hover:shadow-lg transition-all cursor-pointer">
        <div className="relative h-56 bg-stone-900 overflow-hidden">
          {drop.product.imageUrl ? (
            <img
              src={drop.product.imageUrl}
              alt={drop.product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-stone-600 text-xs uppercase tracking-widest">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
            {isLive && <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />}
            <span className="text-[9px] uppercase tracking-widest font-bold text-white">
              {isLive ? 'Live Now' : 'Dropping Soon'}
            </span>
          </div>
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
            <span className="text-[9px] uppercase tracking-widest font-bold text-white/70">{slotsLeft} left</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <h3 className="text-xl font-black tracking-tight text-stone-950 mb-1">{drop.product.name}</h3>
            <p className="text-sm text-stone-500 leading-snug line-clamp-2">{drop.product.description}</p>
          </div>

          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">From</p>
              <p className="text-2xl font-black tracking-tight text-stone-950">${drop.product.price.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">{isLive ? 'Ends' : 'Starts'}</p>
              <p className="text-sm font-semibold text-stone-600">{timeLabel}</p>
            </div>
          </div>

          <button className="w-full h-10 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:-translate-y-px hover:shadow-md transition-all group-hover:bg-amber-700">
            {isLive ? 'Enter Drop' : 'Notify Me'}
          </button>
        </div>
      </div>
    </Link>
  )
}
