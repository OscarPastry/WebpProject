'use client'

import { useState, useTransition } from 'react'
import StarRating from './StarRating'
import { submitReview } from '@/app/actions'
import { Star } from 'lucide-react'

interface ReviewData {
  review_id: number
  rating: number
  comment: string | null
  created_at: string
  user: {
    username: string
    profile: { display_name: string | null } | null
  }
}

interface ReviewSectionProps {
  recipeId: number
  reviews: ReviewData[]
  averageRating: number
  totalReviews: number
  distribution: number[] // [0, count1star, count2star, count3star, count4star, count5star]
  currentUserId: number | null
  existingUserReview: ReviewData | null
}

export default function ReviewSection({
  recipeId, reviews, averageRating, totalReviews,
  distribution, currentUserId, existingUserReview
}: ReviewSectionProps) {
  const [rating, setRating] = useState(existingUserReview?.rating ?? 0)
  const [comment, setComment] = useState(existingUserReview?.comment ?? '')
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!rating || !currentUserId) return
    const formData = new FormData()
    formData.set('recipeId', String(recipeId))
    formData.set('rating', String(rating))
    formData.set('comment', comment)
    startTransition(async () => {
      await submitReview(formData)
      setSubmitted(true)
    })
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="brutalist-card overflow-hidden">
        <div className="p-5 border-b-[3px] border-[var(--border)] bg-[var(--fg)] flex items-center justify-between">
          <h2 className="font-headline font-black text-xl uppercase tracking-tighter text-[var(--yellow)]">
            Ratings & Reviews
          </h2>
          <span className="font-mono text-[10px] text-[var(--yellow)] uppercase opacity-60">
            Review Table · AVG + GROUP BY
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Average */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="font-headline font-black text-7xl tracking-tighter text-[var(--fg)]">
              {totalReviews > 0 ? averageRating.toFixed(1) : '—'}
            </div>
            <StarRating value={Math.round(averageRating)} readonly size={24} />
            <p className="font-mono text-xs text-[var(--fg-muted)] uppercase mt-2">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Right: Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = distribution[star] || 0
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black w-3 text-right text-[var(--fg)]">{star}</span>
                  <Star size={12} className="fill-[var(--yellow)] text-[var(--yellow)]" />
                  <div className="flex-1 h-4 border-[2px] border-[var(--border)] bg-[var(--bg-muted)]">
                    <div className="h-full bg-[var(--yellow)]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--fg-dim)] w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Submit/Edit Review */}
      {currentUserId && (
        <div className="brutalist-card overflow-hidden">
          <div className="h-3 bg-[var(--yellow)] border-b-[3px] border-[var(--border)]" />
          <div className="p-6 space-y-4">
            <h3 className="font-headline font-black text-lg uppercase tracking-tighter text-[var(--fg)]">
              {existingUserReview ? 'Update Your Review' : 'Write a Review'}
            </h3>
            {submitted ? (
              <div className="border-[3px] border-[var(--border)] bg-[var(--bg-muted)] p-6 text-center">
                <p className="font-mono text-sm uppercase font-black text-green-600">✓ Review Saved!</p>
                <p className="font-mono text-[10px] text-[var(--fg-dim)] uppercase mt-1">
                  UPSERT Review WHERE user_id AND recipe_id
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block font-mono font-black text-xs uppercase mb-2 text-[var(--fg-dim)]">Your Rating *</label>
                  <StarRating value={rating} onChange={setRating} size={28} />
                </div>
                <div>
                  <label className="block font-mono font-black text-xs uppercase mb-2 text-[var(--fg-dim)]">Comment (Optional)</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    className="w-full bg-[var(--input-bg)] border-[3px] border-[var(--border)] font-mono text-sm px-4 py-3 focus:outline-none text-[var(--fg)] placeholder:text-[var(--fg-ghost)]"
                    placeholder="Share your thoughts about this recipe..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!rating || isPending}
                  className="brutalist-btn bg-[var(--fg)] text-[var(--yellow)] px-6 py-3 text-xs disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : existingUserReview ? '★ Update Review' : '★ Submit Review'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.review_id} className="brutalist-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono font-bold text-sm uppercase text-[var(--fg)]">
                      {review.user.profile?.display_name || review.user.username}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--fg-dim)] uppercase">
                      @{review.user.username} · {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StarRating value={review.rating} readonly size={16} />
                </div>
                {review.comment && (
                  <p className="font-body text-sm text-[var(--fg-muted)] mt-3 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
