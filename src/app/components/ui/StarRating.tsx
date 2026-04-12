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

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <button
              key={i}
              onClick={() => interactive && onRate?.(i + 1)}
              className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
              type="button"
            >
              <Star
                size={starSize}
                className={
                  filled
                    ? 'fill-[#D4A853] text-[#D4A853]'
                    : partial
                    ? 'fill-[#D4A853]/40 text-[#D4A853]/60'
                    : 'fill-[#EDE0D0] text-[#EDE0D0]'
                }
              />
            </button>
          );
        })}
      </div>
      {count !== undefined && (
        <span className={`${textSize} text-[#9B8E84]`}>
          {rating.toFixed(1)} ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
