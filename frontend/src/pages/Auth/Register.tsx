import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register } from '../../services/auth.service'
import { useAuthStore } from '../../store/auth.store'

export default function Register() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' as 'CUSTOMER' | 'SELLER' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await register(form.name, form.email, form.password, form.role)
      const { token, user } = res.data.data
      loginStore(token, user)
      const { role } = user
      if (role === 'SELLER') navigate('/seller')
      else navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Amber top bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-linear-to-r from-amber-800 to-amber-500 z-50" />

      {/* Left panel */}
      <section className="hidden lg:flex flex-col justify-between w-1/2 bg-stone-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none select-none">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_#92400e_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-white">DropVault</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
            Drops
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-md"
        >
          <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">
            The Curated<br />Vault.
          </h2>
          <p className="mt-6 text-stone-400 text-lg font-light leading-relaxed">
            Access limited-release drops, verified acquisitions, and exclusive archival pieces.
          </p>
        </motion.div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-amber-700" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-700">ESTABLISHED 2024</span>
          </div>
          <p className="text-[10px] uppercase font-medium tracking-widest text-stone-500">
            © 2024 DROPVAULT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </section>

      {/* Right panel */}
      <section className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center py-8 px-6 md:px-12 lg:px-16 relative overflow-y-auto">
        {/* Mobile branding */}
        <div className="lg:hidden absolute top-8 left-8">
          <span className="text-xl font-black tracking-tighter text-stone-950">DropVault</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-700 mb-2 block">
              REGISTRATION
            </span>
            <h1 className="text-3xl font-black text-stone-950 tracking-tighter">Join the Vault</h1>
            <p className="mt-2 text-stone-500 text-sm font-medium">
              Create your credentials to access upcoming drops.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                I am joining as
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['CUSTOMER', 'SELLER'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`h-11 rounded-md text-xs font-bold uppercase tracking-widest border transition-all ${
                      form.role === r
                        ? 'bg-stone-950 text-white border-stone-950'
                        : 'bg-stone-100 text-stone-500 border-transparent hover:border-stone-300'
                    }`}
                  >
                    {r === 'CUSTOMER' ? 'Customer' : 'Seller'}
                  </button>
                ))}
              </div>
              {form.role === 'SELLER' && (
                <p className="text-[10px] text-amber-700 font-medium mt-1">
                  Seller accounts require admin approval before going live.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Alexander Walker"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full h-11 px-4 bg-stone-100 border border-transparent rounded-md text-sm text-stone-900 font-medium placeholder:text-stone-400 outline-none focus:border-amber-700 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@dropvault.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full h-11 px-4 bg-stone-100 border border-transparent rounded-md text-sm text-stone-900 font-medium placeholder:text-stone-400 outline-none focus:border-amber-700 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                Secure Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full h-11 px-4 bg-stone-100 border border-transparent rounded-md text-sm text-stone-900 font-medium placeholder:text-stone-400 outline-none focus:border-amber-700 transition-colors"
              />
              {form.password.length > 0 && form.password.length < 8 && (
                <p className="text-[10px] text-amber-700 font-medium">{8 - form.password.length} more character{8 - form.password.length !== 1 ? 's' : ''} needed</p>
              )}
            </div>

            {error && (
              <p className="text-xs font-medium text-red-600">{error}</p>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-stone-950 text-white rounded-md font-bold text-xs uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-stone-500 text-sm">
                Already a member?{' '}
                <Link
                  to="/login"
                  className="text-stone-950 font-bold underline underline-offset-4 decoration-amber-700/30 hover:decoration-amber-700 transition-all"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 flex items-center gap-4 w-full">
            <div className="h-px flex-1 bg-stone-100" />
            <span className="text-[10px] font-bold tracking-widest text-stone-300 uppercase">Secure & Verified</span>
            <div className="h-px flex-1 bg-stone-100" />
          </div>
        </motion.div>
      </section>
    </div>
  )
}
