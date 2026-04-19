import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/auth.store'
import api from '../../services/api'
import type { User } from '../../types/user.types'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

export default function Profile() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  if (!user) return null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      const res = await api.patch<{ success: boolean; data: User }>('/users/profile', { name: name.trim() })
      setUser(res.data.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setSaveError(msg ?? 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">Account</p>
          <h1 className="text-5xl font-black tracking-tighter text-stone-950">Profile</h1>
        </div>

        <div className="bg-white border border-stone-100 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-stone-100">
            <div className="w-14 h-14 rounded-full bg-stone-950 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-stone-950">{user.name}</p>
              <p className="text-sm text-stone-400">{user.email}</p>
              <span className="inline-block mt-1.5 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded">
                {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-11 border border-stone-200 rounded-lg px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full h-11 border border-stone-100 rounded-lg px-4 text-sm text-stone-400 bg-stone-50 cursor-default"
              />
              <p className="mt-1.5 text-[10px] text-stone-400">Email cannot be changed.</p>
            </div>

            {saveError && (
              <p className="text-xs font-semibold text-red-500">{saveError}</p>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving || name.trim() === user.name}
                className="h-11 px-8 bg-stone-950 text-white text-xs uppercase tracking-widest font-bold rounded-lg hover:-translate-y-px hover:shadow-md transition-all disabled:bg-stone-200 disabled:text-stone-400 disabled:translate-y-0 disabled:shadow-none"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>

              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold text-emerald-600"
                  >
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        <div className="bg-white border border-stone-100 rounded-2xl p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-stone-950 mb-6">Danger Zone</h2>
          <button
            onClick={logout}
            className="h-11 px-8 border border-red-200 text-red-500 text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
          >
            Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
