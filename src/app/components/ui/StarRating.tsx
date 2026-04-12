import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({ rating, count, size = 'md', interactive, onRate }: StarRatingProps) {
  const starSize = { sm: 12, md: 14, lg: 18 }[size];
  const textSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size];
  const clampedRating = Math.max(0, Math.min(5, rating || 0));

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const starFill = Math.max(0, Math.min(1, clampedRating - i)); // 0..1
          const pct = Math.round(starFill * 100);
          return (
            <button
              key={i}
              onClick={() => interactive && onRate?.(i + 1)}
              type="button"
              aria-label={`Rate ${i + 1} stars`}
              className={interactive ? 'cursor-pointer p-0.5 hover:scale-110 transition-transform' : 'cursor-default p-0.5'}
            >
              <div style={{ width: starSize, height: starSize }} className="relative inline-block align-middle">
                {/* empty/background star */}
                <Star size={starSize} className="text-[#EDE0D0]" />

                {/* filled overlay clipped to percentage */}
                {pct > 0 && (
                  <div
                    aria-hidden
                    style={{ width: `${pct}%` }}
                    className="absolute left-0 top-0 bottom-0 overflow-hidden"
                  >
                    <Star size={starSize} className="text-[#D4A853]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {count !== undefined && (
        <span className={`${textSize} text-[#9B8E84]`}>
          {clampedRating.toFixed(1)} ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
