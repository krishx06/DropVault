import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Home from '../pages/Home/Home'
import Drops from '../pages/Drops/Drops'
import DropDetail from '../pages/DropDetail/DropDetail'
import Orders from '../pages/Orders/Orders'
import Profile from '../pages/Profile/Profile'
import SellerPending from '../pages/Seller/SellerPending'
import SellerLayout from '../layouts/SellerLayout'
import SellerProducts from '../pages/Seller/SellerProducts'
import SellerDrops from '../pages/Seller/SellerDrops'
import SellerDropNew from '../pages/Seller/SellerDropNew'
import SellerOrders from '../pages/Seller/SellerOrders'
import SellerDashboard from '../pages/Seller/SellerDashboard'
import { useAuthStore } from '../store/auth.store'
import { getSellerProfile } from '../services/seller.service'
import type { SellerStatus } from '../types/seller.types'

function HomeRedirect() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'SELLER') return <Navigate to="/seller" replace />
  return <Home />
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireSellerRole({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'SELLER') return <Navigate to="/" replace />
  return <>{children}</>
}

function RequireApprovedSeller({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const [status, setStatus] = useState<SellerStatus | 'loading'>('loading')

  useEffect(() => {
    if (!user || user.role !== 'SELLER') return
    getSellerProfile()
      .then((res) => setStatus(res.data.data.status))
      .catch(() => setStatus('PENDING'))
  }, [user])

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'SELLER') return <Navigate to="/" replace />
  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9]">
      <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-950 rounded-full animate-spin" />
    </div>
  )
  if (status === 'PENDING' || status === 'REJECTED') return <Navigate to="/seller/pending" replace />
  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/drops" element={<Drops />} />
      <Route path="/drops/:id" element={<DropDetail />} />
      <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

      <Route
        path="/seller/pending"
        element={<RequireSellerRole><SellerPending /></RequireSellerRole>}
      />

      <Route
        path="/seller"
        element={<RequireApprovedSeller><SellerLayout /></RequireApprovedSeller>}
      >
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="drops" element={<SellerDrops />} />
        <Route path="drops/new" element={<SellerDropNew />} />
        <Route path="drops/:id/edit" element={<ComingSoon label="Edit Drop" />} />
        <Route path="orders" element={<SellerOrders />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ComingSoon({ label }: { label: string }) {
  return (
    <main className="flex-1 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Coming Soon</p>
        <h2 className="text-3xl font-black tracking-tighter text-stone-950">{label}</h2>
      </div>
    </main>
  )
}
