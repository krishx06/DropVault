import { Link, useLocation } from 'react-router-dom'

const SHOP_LINKS = [
  { label: 'Live Drops', to: '/drops?status=live' },
  { label: 'Upcoming', to: '/drops?status=upcoming' },
  { label: 'Ended', to: '/drops?status=ended' },
  { label: 'All Drops', to: '/drops' },
]

const SELLER_LINKS = [
  { label: 'Become a Seller', to: '/register' },
  { label: 'Seller Login', to: '/login' },
  { label: 'How It Works', scrollId: 'how-it-works' },
  { label: 'Verification', scrollId: 'sellers' },
]

const COMPANY_LINKS = ['About', 'FAQ', 'Terms', 'Privacy']

function scrollOrNull(scrollId: string | undefined, isHome: boolean) {
  if (!scrollId || !isHome) return undefined
  return () => document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
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
                {SHOP_LINKS.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-stone-400 hover:text-stone-950 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-950 mb-4">Sellers</p>
              <ul className="space-y-3">
                {SELLER_LINKS.map((item) => (
                  <li key={item.label}>
                    {'to' in item ? (
                      <Link to={item.to} className="text-sm text-stone-400 hover:text-stone-950 transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={scrollOrNull(item.scrollId, isHome)}
                        className="text-sm text-stone-400 hover:text-stone-950 transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-950 mb-4">Company</p>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((l) => (
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
  )
}
