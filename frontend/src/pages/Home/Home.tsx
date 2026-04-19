import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

const MOCK_DROPS = [
  {
    id: '1',
    label: 'LIVE NOW',
    live: true,
    title: 'Maison Noir SS25',
    subtitle: 'Structured silhouettes. Zero compromise.',
    price: '$420',
    ends: '2h 14m left',
    slots: 3,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    label: 'DROPPING SOON',
    live: false,
    title: 'Archive Selects Vol. 7',
    subtitle: 'Sourced from private European estates.',
    price: 'From $180',
    ends: 'Tomorrow, 12:00 PM',
    slots: 12,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    label: 'DROPPING SOON',
    live: false,
    title: 'Monochrome Edit',
    subtitle: 'A study in restraint and intention.',
    price: 'From $95',
    ends: 'In 3 days',
    slots: 24,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80',
  },
]

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

const PAST_DROPS = [
  {
    id: 'p1',
    title: 'Atelier Blanc FW24',
    units: 18,
    soldIn: '9 min',
    total: '$12,400',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2',
    title: 'The Leather Edit',
    units: 6,
    soldIn: '4 min',
    total: '$8,200',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3',
    title: 'Indigo Archive',
    units: 32,
    soldIn: '22 min',
    total: '$5,760',
    image: 'https://images.unsplash.com/photo-1552346154-21d32dc2e58a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4',
    title: 'Chrome Objects Vol. 2',
    units: 10,
    soldIn: '7 min',
    total: '$9,900',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80',
  },
]

const CATEGORIES = [
  { label: 'Outerwear', count: 34 },
  { label: 'Footwear', count: 61 },
  { label: 'Accessories', count: 88 },
  { label: 'Tailoring', count: 27 },
  { label: 'Knitwear', count: 43 },
  { label: 'Denim', count: 19 },
  { label: 'Objects', count: 15 },
  { label: 'Vintage', count: 52 },
]

const SELLERS = [
  {
    id: 's1',
    initials: 'MN',
    name: 'Maison Noir',
    location: 'Paris, FR',
    drops: 12,
    rating: '4.97',
    tag: 'Top Seller',
  },
  {
    id: 's2',
    initials: 'AK',
    name: 'Archiv Keller',
    location: 'Berlin, DE',
    drops: 8,
    rating: '4.93',
    tag: 'Verified',
  },
  {
    id: 's3',
    initials: 'SH',
    name: 'Studio Holt',
    location: 'London, UK',
    drops: 21,
    rating: '5.00',
    tag: 'Elite',
  },
]

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
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9]">
      <div className="fixed top-0 left-0 w-full h-0.75 bg-linear-to-r from-amber-800 to-amber-500 z-50" />

      <header className="sticky top-0.75 z-40 bg-[#fbf9f9]/90 backdrop-blur-sm border-b border-stone-100">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0.5">
            <span className="text-xl font-black tracking-tighter text-stone-950">Drop</span>
            <span className="text-xl font-black tracking-tighter text-amber-700">Vault</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Drops', target: 'active-drops' },
              { label: 'Sellers', target: 'sellers' },
              { label: 'How It Works', target: 'how-it-works' },
            ].map(({ label, target }) => (
              <button
                key={label}
                onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[11px] uppercase tracking-widest font-semibold text-stone-500 hover:text-stone-950 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:block text-[11px] uppercase tracking-widest font-semibold text-stone-400">
                {user.name.split(' ')[0]}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-[11px] uppercase tracking-widest font-bold text-stone-950 border border-stone-200 px-4 h-8 rounded hover:bg-stone-950 hover:text-white transition-all"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </header>

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
                <button
                  onClick={() => document.getElementById('active-drops')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-13 px-9 bg-stone-950 text-white font-bold text-sm uppercase tracking-widest rounded hover:-translate-y-px hover:shadow-lg transition-all"
                >
                  Browse Live Drops
                </button>
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

        <Divider />


        <section id="categories" className="py-14">
          <div className="max-w-6xl mx-auto px-6 mb-8">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-1">Shop by</p>
            <h2 className="text-3xl font-black tracking-tighter text-stone-950">Categories</h2>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3"
            >
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.label}
                  variants={itemVariants}
                  className="group flex flex-col items-start gap-1.5 border border-stone-100 bg-white rounded-lg px-5 py-6 hover:border-amber-700 hover:bg-amber-700 transition-all"
                >
                  <span className="text-base font-black tracking-tight text-stone-950 group-hover:text-white transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-stone-400 group-hover:text-amber-200 transition-colors">
                    {cat.count} items
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        <Divider />


        <section id="active-drops" className="max-w-6xl mx-auto px-6 py-18">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">
                Current & Upcoming
              </p>
              <h2 className="text-4xl font-black tracking-tighter text-stone-950">Active Drops</h2>
            </div>
            <button className="text-xs uppercase tracking-widest font-bold text-amber-700 hover:underline underline-offset-4 hidden sm:block">
              View All →
            </button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {MOCK_DROPS.map((drop) => (
              <motion.div key={drop.id} variants={itemVariants}>
                <DropCard drop={drop} />
              </motion.div>
            ))}
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
            {PAST_DROPS.map((drop) => (
              <motion.div
                key={drop.id}
                variants={itemVariants}
                className="border border-stone-100 bg-white rounded-xl overflow-hidden"
              >
                <div className="relative h-40 bg-stone-900 overflow-hidden">
                  <img
                    src={drop.image}
                    alt={drop.title}
                    className="w-full h-full object-cover opacity-60 grayscale"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/60 line-through">
                      Sold Out
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/60">
                      {drop.units} units
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black tracking-tight text-stone-950 mb-4">{drop.title}</h3>
                  <div className="flex items-end justify-between border-t border-stone-50 pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Sold in</p>
                      <p className="text-base font-black text-amber-700">{drop.soldIn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Total GMV</p>
                      <p className="text-base font-black text-stone-950">{drop.total}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {SELLERS.map((seller) => (
              <motion.div
                key={seller.id}
                variants={itemVariants}
                className="group border border-stone-100 bg-white rounded-lg p-7 hover:border-stone-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-7">
                  <div className="w-13 h-13 rounded-full bg-stone-950 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black tracking-tighter text-amber-500">{seller.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-black tracking-tight text-stone-950 truncate">{seller.name}</h3>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {seller.tag}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">{seller.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-stone-50 pt-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Drops</p>
                    <p className="text-2xl font-black tracking-tight text-stone-950">{seller.drops}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Rating</p>
                    <p className="text-2xl font-black tracking-tight text-stone-950">{seller.rating}</p>
                  </div>
                </div>

                <button className="mt-6 w-full h-10 border border-stone-100 text-stone-950 font-bold text-xs uppercase tracking-widest rounded hover:bg-stone-950 hover:text-white hover:border-stone-950 transition-all">
                  View Drops
                </button>
              </motion.div>
            ))}
          </motion.div>
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

      <footer className="border-t border-stone-100 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-0.5 mb-4">
                <span className="text-2xl font-black tracking-tighter text-stone-950">Drop</span>
                <span className="text-2xl font-black tracking-tighter text-amber-700">Vault</span>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                Time-limited access to rare, curated pieces from verified independent sellers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-950 mb-4">Shop</p>
                <ul className="space-y-3">
                  {[
                    { label: 'Live Drops', target: 'active-drops' },
                    { label: 'Upcoming', target: 'active-drops' },
                    { label: 'Archive', target: null },
                    { label: 'Categories', target: 'categories' },
                  ].map(({ label, target }) => (
                    <li key={label}>
                      <button
                        onClick={() => target && document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-sm text-stone-400 hover:text-stone-950 transition-colors"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-950 mb-4">Sellers</p>
                <ul className="space-y-3">
                  {[
                    { label: 'Become a Seller', target: 'sellers' },
                    { label: 'Seller Login', target: null },
                    { label: 'How It Works', target: 'how-it-works' },
                    { label: 'Verification', target: 'sellers' },
                  ].map(({ label, target }) => (
                    <li key={label}>
                      <button
                        onClick={() => target && document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-sm text-stone-400 hover:text-stone-950 transition-colors"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-950 mb-4">Company</p>
                <ul className="space-y-3">
                  {['About', 'FAQ', 'Terms', 'Privacy'].map((l) => (
                    <li key={l}>
                      <button className="text-sm text-stone-400 hover:text-stone-950 transition-colors">{l}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 pt-8">
            <p className="text-xs uppercase tracking-widest text-stone-300">
              © 2024 DropVault. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Terms', 'Privacy', 'Cookies'].map((l) => (
                <button key={l} className="text-xs uppercase tracking-widest text-stone-300 hover:text-stone-950 transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
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
            src={MOCK_DROPS[1].image}
            alt={MOCK_DROPS[1].title}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="p-4">
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">{MOCK_DROPS[1].label}</p>
          <p className="text-sm font-black tracking-tight text-stone-950">{MOCK_DROPS[1].title}</p>
          <p className="text-base font-black text-stone-950 mt-2">{MOCK_DROPS[1].price}</p>
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
        <p className="text-sm font-black text-white leading-tight">{MOCK_DROPS[2].title}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">{MOCK_DROPS[2].ends}</span>
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
            src={MOCK_DROPS[0].image}
            alt={MOCK_DROPS[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
            <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[9px] uppercase tracking-widest font-bold text-white">Live Now</span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-black tracking-tight text-stone-950 mb-0.5">{MOCK_DROPS[0].title}</p>
          <p className="text-[11px] text-stone-400 mb-4">{MOCK_DROPS[0].subtitle}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black tracking-tight text-stone-950">{MOCK_DROPS[0].price}</p>
            <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">
              {MOCK_DROPS[0].slots} slots left
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DropCard({ drop }: { drop: (typeof MOCK_DROPS)[0] }) {
  return (
    <div className="group border border-stone-100 bg-white rounded-xl overflow-hidden hover:border-stone-300 hover:shadow-lg transition-all cursor-pointer">
      <div className="relative h-56 bg-stone-900 overflow-hidden">
        <img
          src={drop.image}
          alt={drop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
          {drop.live && <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />}
          <span className="text-[9px] uppercase tracking-widest font-bold text-white">{drop.label}</span>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
          <span className="text-[9px] uppercase tracking-widest font-bold text-white/70">{drop.slots} left</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5">
          <h3 className="text-xl font-black tracking-tight text-stone-950 mb-1">{drop.title}</h3>
          <p className="text-sm text-stone-500 leading-snug">{drop.subtitle}</p>
        </div>

        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">From</p>
            <p className="text-2xl font-black tracking-tight text-stone-950">{drop.price}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Ends</p>
            <p className="text-sm font-semibold text-stone-600">{drop.ends}</p>
          </div>
        </div>

        <button className="w-full h-10 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:-translate-y-px hover:shadow-md transition-all group-hover:bg-amber-700">
          {drop.live ? 'Enter Drop' : 'Notify Me'}
        </button>
      </div>
    </div>
  )
}
