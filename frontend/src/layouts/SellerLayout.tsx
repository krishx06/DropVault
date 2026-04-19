import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

const NAV_ITEMS = [
  { label: 'Overview', to: '/seller', icon: 'dashboard', end: true },
  { label: 'Products', to: '/seller/products', icon: 'inventory_2' },
  { label: 'Drops', to: '/seller/drops', icon: 'bolt' },
  { label: 'Orders', to: '/seller/orders', icon: 'local_shipping' },
]

export default function SellerLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#fbf9f9]">
      <aside className="flex flex-col h-screen sticky top-0 w-64 shrink-0 border-r border-stone-200 bg-stone-50 p-4">
        <div className="px-2 py-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-950 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-base">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-stone-900 tracking-tight truncate">{user?.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Seller</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-150 ${
                  isActive
                    ? 'text-amber-700 bg-white shadow-sm translate-x-0.5'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-stone-200 space-y-1">
          <NavLink
            to="/seller/drops/new"
            className="w-full flex items-center justify-center gap-2 bg-stone-950 text-white h-11 rounded-lg font-bold text-xs uppercase tracking-widest mb-3 hover:-translate-y-0.5 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Drop
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-stone-400 hover:text-stone-700 text-sm font-medium tracking-wide transition-colors rounded-lg hover:bg-stone-100"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}
