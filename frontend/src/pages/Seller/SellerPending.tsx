import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

export default function SellerPending() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col">
      <header className="h-14 border-b border-stone-100 flex items-center justify-between px-6">
        <div className="flex items-center gap-0.5">
          <span className="text-xl font-black tracking-tighter text-stone-950">Drop</span>
          <span className="text-xl font-black tracking-tighter text-amber-700">Vault</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[11px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-950 transition-colors"
        >
          Sign Out
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-amber-600 text-3xl">hourglass_top</span>
          </div>

          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-400 mb-3">
            Account Under Review
          </p>
          <h1 className="text-4xl font-black tracking-tighter text-stone-950 mb-4 leading-tight">
            Pending Approval
          </h1>
          <p className="text-stone-500 leading-relaxed mb-10">
            Your seller application is being reviewed by our team. You'll get access to the seller dashboard once approved — typically within 24–48 hours.
          </p>

          <div className="space-y-3 text-left bg-white border border-stone-100 rounded-2xl p-6 mb-8">
            {[
              { icon: 'check_circle', label: 'Account created', done: true },
              { icon: 'pending', label: 'Identity & documents verified', done: false },
              { icon: 'lock', label: 'Seller dashboard unlocked', done: false },
            ].map(({ icon, label, done }) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-xl ${done ? 'text-emerald-500' : 'text-stone-300'}`}
                  style={done ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span className={`text-sm font-semibold ${done ? 'text-stone-800' : 'text-stone-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-stone-400">
            Questions?{' '}
            <a href="mailto:support@dropvault.com" className="text-amber-700 font-semibold hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
