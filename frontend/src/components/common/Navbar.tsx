import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

const NAV_ITEMS = [
  { label: 'Drops', scrollId: 'active-drops', route: '/drops' },
  { label: 'Sellers', scrollId: 'sellers', route: '/' },
  { label: 'How It Works', scrollId: 'how-it-works', route: '/' },
]

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  function handleNavClick(item: (typeof NAV_ITEMS)[0]) {
    if (isHome) {
      document.getElementById(item.scrollId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(item.route)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-0.75 bg-linear-to-r from-amber-800 to-amber-500 z-50" />
      <header className="sticky top-0.75 z-40 bg-[#fbf9f9]/90 backdrop-blur-sm border-b border-stone-100">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0.5">
            <span className="text-xl font-black tracking-tighter text-stone-950">Drop</span>
            <span className="text-xl font-black tracking-tighter text-amber-700">Vault</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${
                  pathname === item.route && item.route !== '/'
                    ? 'text-stone-950'
                    : 'text-stone-500 hover:text-stone-950'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user && user.role === 'CUSTOMER' && (
              <>
                <Link
                  to="/orders"
                  className={`hidden sm:block text-[11px] uppercase tracking-widest font-semibold transition-colors ${
                    pathname === '/orders' ? 'text-stone-950' : 'text-stone-500 hover:text-stone-950'
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className={`hidden sm:block text-[11px] uppercase tracking-widest font-semibold transition-colors ${
                    pathname === '/profile' ? 'text-stone-950' : 'text-stone-500 hover:text-stone-950'
                  }`}
                >
                  {user.name.split(' ')[0]}
                </Link>
              </>
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
    </>
  )
}
