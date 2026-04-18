import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../../services/auth.service'
import { useAuthStore } from '../../store/auth.store'

export default function Login() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form.email, form.password)
      const { token, user } = res.data.data
      loginStore(token, user)
      const { role } = user
      if (role === 'ADMIN') navigate('/admin')
      else if (role === 'SELLER') navigate('/seller')
      else navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Amber top bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-linear-to-r from-amber-800 to-amber-500 z-50" />

      {/* Left panel */}
      <section className="hidden lg:flex flex-col justify-between w-1/2 bg-stone-950 p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_left,_#92400e_0%,_transparent_60%)]" />
        </div>

        <div className="relative z-10">
          <span className="text-3xl font-black tracking-tighter text-white">Drop</span>
          <span className="text-3xl font-black tracking-tighter text-amber-700">Vault</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-lg"
        >
          <h1 className="text-white text-5xl font-black leading-[1.1] tracking-tighter mb-8 italic">
            "Luxury is not about having more. It's about having what others cannot find."
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-amber-700" />
            <span className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-medium">
              The DropVault Curation Standard
            </span>
          </div>
        </motion.div>

        <div className="relative z-10">
          <p className="text-stone-500 text-[10px] uppercase tracking-widest">
            © 2024 DROPVAULT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </section>

      {/* Right panel */}
      <section className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 md:p-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-1 mb-12 justify-center">
            <span className="text-2xl font-black tracking-tighter text-stone-950">Drop</span>
            <span className="text-2xl font-black tracking-tighter text-amber-700">Vault</span>
          </div>

          <header className="mb-10">
            <h2 className="text-3xl font-black text-stone-950 tracking-tight mb-2">Sign In</h2>
            <p className="text-stone-500 text-sm">Enter your credentials to access your private collection.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@dropvault.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full h-11 px-4 bg-stone-100 border border-transparent rounded-md text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full h-11 px-4 bg-stone-100 border border-transparent rounded-md text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-700 transition-colors"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-xs font-semibold text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest rounded-md hover:-translate-y-px hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              New to the vault?{' '}
              <Link to="/register" className="text-amber-700 font-bold hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </footer>
        </motion.div>
      </section>
    </div>
  )
}
