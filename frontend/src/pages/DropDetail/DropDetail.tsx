import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getDropById } from '../../services/drop.service'
import { createOrder } from '../../services/order.service'
import { getReviewsByProduct, submitReview } from '../../services/review.service'
import { useAuthStore } from '../../store/auth.store'
import { useDropSocket } from '../../hooks/useSocket'
import type { Drop, DropStatus } from '../../types/drop.types'
import type { Review } from '../../types/review.types'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

function useCountdown(target: string | null) {
  const [diff, setDiff] = useState(() =>
    target ? Math.max(0, new Date(target).getTime() - Date.now()) : 0
  )

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => {
      setDiff(Math.max(0, new Date(target).getTime() - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [target])

  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { hours, minutes, seconds, done: diff === 0 }
}

export default function DropDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [drop, setDrop] = useState<Drop | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState('')
  const [ordered, setOrdered] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      setLoading(true)
      setError('')
      try {
        const dropRes = await getDropById(id!)
        const fetchedDrop = dropRes.data.data
        setDrop(fetchedDrop)
        try {
          const revRes = await getReviewsByProduct(fetchedDrop.productId)
          setReviews(revRes.data.data)
        } catch { /* reviews optional */ }
      } catch {
        setError('Drop not found.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useDropSocket(id, useCallback((event: string) => {
    if (!id) return
    if (['drop:activated', 'drop:ended', 'drop:sold_out'].includes(event)) {
      getDropById(id).then((res) => setDrop(res.data.data)).catch(() => {})
    }
  }, [id]))

  async function handleBuy() {
    if (!user) { navigate('/login'); return }
    if (!drop) return
    setBuying(true)
    setBuyError('')
    try {
      await createOrder(drop.id)
      setOrdered(true)
      const res = await getDropById(drop.id)
      setDrop(res.data.data)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setBuyError(msg ?? 'Purchase failed. Please try again.')
    } finally {
      setBuying(false)
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!drop || reviewRating === 0) return
    setSubmittingReview(true)
    setReviewError('')
    try {
      await submitReview(drop.productId, reviewRating, reviewComment || undefined)
      setReviewSubmitted(true)
      setReviewComment('')
      setReviewRating(0)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setReviewError(msg ?? 'Failed to submit review.')
    } finally {
      setSubmittingReview(false)
    }
  }

  const countdownTarget =
    drop?.status === 'UPCOMING' ? drop.startTime :
    drop?.status === 'LIVE' ? drop.endTime : null

  const countdown = useCountdown(countdownTarget)

  if (loading) return <PageShell><DropDetailSkeleton /></PageShell>
  if (error || !drop) return (
    <PageShell>
      <div className="py-40 text-center">
        <p className="text-sm font-semibold text-stone-500 mb-4">{error || 'Drop not found.'}</p>
        <button onClick={() => navigate('/drops')} className="text-xs uppercase tracking-widest font-bold border border-stone-200 px-6 h-9 rounded hover:bg-stone-950 hover:text-white transition-all">
          Back to Drops
        </button>
      </div>
    </PageShell>
  )

  const slotsLeft = drop.stock - drop.sold
  const soldPct = Math.round((drop.sold / drop.stock) * 100)
  const isLive = drop.status === 'LIVE'
  const isUpcoming = drop.status === 'UPCOMING'
  const isEnded = drop.status === 'ENDED' || drop.status === 'SOLD_OUT'
  const canBuy = isLive && !ordered && slotsLeft > 0

  return (
    <PageShell>
      <main className="max-w-6xl mx-auto px-6 py-14">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-stone-400 hover:text-stone-950 transition-colors mb-10"
        >
          <span>←</span> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-square">
            {drop.product.imageUrl ? (
              <img
                src={drop.product.imageUrl}
                alt={drop.product.name}
                className={`w-full h-full object-cover ${isEnded ? 'grayscale opacity-60' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-stone-600 text-xs uppercase tracking-widest">No image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
            <StatusBadge status={drop.status} />
          </div>

          <div className="flex flex-col justify-between py-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">Drop</p>
              <h1 className="text-4xl font-black tracking-tighter text-stone-950 mb-3 leading-tight">
                {drop.product.name}
              </h1>
              <p className="text-stone-500 leading-relaxed mb-8">{drop.product.description}</p>

              {(isLive || isUpcoming) && (
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">
                    {isUpcoming ? 'Drop starts in' : 'Drop ends in'}
                  </p>
                  <CountdownDisplay {...countdown} done={countdown.done} />
                </div>
              )}

              <div className="mb-8">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                  <span>Vault progress</span>
                  <span>{slotsLeft} of {drop.stock} remaining</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${soldPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Price</p>
                  <p className="text-4xl font-black tracking-tight text-stone-950">
                    ${drop.product.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                    {isUpcoming ? 'Starts' : 'Ended'}
                  </p>
                  <p className="text-sm font-semibold text-stone-600">
                    {new Date(isUpcoming ? drop.startTime : drop.endTime).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {ordered ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-14 flex items-center justify-center bg-emerald-50 border border-emerald-200 rounded-xl"
                  >
                    <span className="text-sm font-bold text-emerald-700 tracking-wide">Order placed successfully</span>
                  </motion.div>
                ) : (
                  <motion.button
                    key="buy"
                    onClick={handleBuy}
                    disabled={!canBuy || buying}
                    className={`w-full h-14 font-black text-sm uppercase tracking-widest rounded-xl transition-all ${
                      canBuy
                        ? 'bg-stone-950 text-white hover:-translate-y-0.5 hover:shadow-xl hover:bg-amber-700 active:translate-y-0'
                        : 'bg-stone-100 text-stone-400 cursor-default'
                    }`}
                  >
                    {buying ? 'Processing…' :
                     isLive && slotsLeft > 0 ? 'Buy Now' :
                     drop.status === 'SOLD_OUT' ? 'Sold Out' :
                     isUpcoming ? 'Not Live Yet' : 'Drop Ended'}
                  </motion.button>
                )}
              </AnimatePresence>

              {buyError && (
                <p className="mt-3 text-xs font-semibold text-red-500 text-center">{buyError}</p>
              )}

              {ordered && (
                <button
                  onClick={() => navigate('/orders')}
                  className="mt-3 w-full h-10 text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-stone-950 transition-colors"
                >
                  View your orders →
                </button>
              )}
            </div>
          </div>
        </div>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black tracking-tight text-stone-950">Reviews</h2>
            <span className="text-sm font-semibold text-stone-400">{reviews.length} approved</span>
          </div>

          {user && (ordered || isEnded) && !reviewSubmitted && (
            <form onSubmit={handleReviewSubmit} className="mb-10 p-6 border border-stone-100 rounded-xl bg-white">
              <p className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-4">Leave a Review</p>
              <StarRating value={reviewRating} onChange={setReviewRating} />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts (optional)"
                rows={3}
                className="mt-4 w-full border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 resize-none focus:outline-none focus:border-stone-400 transition-colors"
              />
              {reviewError && <p className="mt-2 text-xs font-semibold text-red-500">{reviewError}</p>}
              <button
                type="submit"
                disabled={reviewRating === 0 || submittingReview}
                className="mt-4 px-6 h-10 bg-stone-950 text-white text-xs uppercase tracking-widest font-bold rounded-lg hover:-translate-y-px hover:shadow-md transition-all disabled:bg-stone-200 disabled:text-stone-400 disabled:translate-y-0 disabled:shadow-none"
              >
                {submittingReview ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}

          {reviewSubmitted && (
            <div className="mb-10 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-sm font-bold text-emerald-700">Review submitted — pending moderation.</p>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-block w-10 h-10 border-2 border-stone-200 rounded-full mb-4" />
              <p className="text-sm text-stone-400">No reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </section>
      </main>
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbf9f9]">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

function CountdownDisplay({ hours, minutes, seconds, done }: { hours: number; minutes: number; seconds: number; done: boolean }) {
  if (done) return <p className="text-2xl font-black tracking-tight text-amber-600">Starting now…</p>
  return (
    <div className="flex items-end gap-3">
      {[{ value: hours, label: 'hrs' }, { value: minutes, label: 'min' }, { value: seconds, label: 'sec' }].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="text-4xl font-black tracking-tighter text-stone-950 tabular-nums w-16 text-center">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span className={star <= (hover || value) ? 'text-amber-500' : 'text-stone-200'}>★</span>
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-5 border border-stone-100 bg-white rounded-xl">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-bold text-stone-950">{review.user?.name ?? 'Customer'}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={`text-sm ${s <= review.rating ? 'text-amber-500' : 'text-stone-200'}`}>★</span>
          ))}
        </div>
      </div>
      {review.comment && <p className="text-sm text-stone-600 leading-relaxed">{review.comment}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: DropStatus }) {
  const configs: Record<DropStatus, { label: string; dot: boolean; color: string }> = {
    LIVE: { label: 'Live Now', dot: true, color: 'text-white' },
    UPCOMING: { label: 'Dropping Soon', dot: false, color: 'text-white' },
    ENDED: { label: 'Ended', dot: false, color: 'text-white/60' },
    SOLD_OUT: { label: 'Sold Out', dot: false, color: 'text-white/60' },
  }
  const { label, dot, color } = configs[status]
  return (
    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
      {dot && <span className="animate-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />}
      <span className={`text-[9px] uppercase tracking-widest font-bold ${color}`}>{label}</span>
    </div>
  )
}

function DropDetailSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      <div className="h-4 w-16 bg-stone-100 rounded animate-pulse mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-stone-100 rounded-2xl animate-pulse" />
        <div className="space-y-4 py-2">
          <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-stone-100 rounded animate-pulse" />
          <div className="h-4 w-full bg-stone-100 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-stone-100 rounded animate-pulse" />
          <div className="h-14 w-full bg-stone-100 rounded-xl animate-pulse mt-8" />
        </div>
      </div>
    </main>
  )
}
