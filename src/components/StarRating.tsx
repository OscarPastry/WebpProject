'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (val: number) => void
  size?: number
  readonly?: boolean
}

export default function StarRating({ value, onChange, size = 20, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'star-interactive'} focus:outline-none disabled:opacity-100`}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={star <= value
              ? 'fill-[var(--yellow)] text-[var(--yellow)]'
              : 'fill-none text-[var(--fg-ghost)]'
            }
          />
        </button>
      ))}
    </div>
  )
}
