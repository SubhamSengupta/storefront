import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRating } from "@/lib/format";

interface RatingProps {
  value: number;
  /** Show the numeric value next to the stars. */
  showValue?: boolean;
  className?: string;
}

const MAX_STARS = 5;

/**
 * Star rating display (read-only). Renders as an accessible label for screen
 * readers while showing five stars visually.
 */
export function Rating({ value, showValue = true, className }: RatingProps) {
  const rounded = Math.round(value);

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`Rated ${formatRating(value)} out of ${MAX_STARS}`}
    >
      <div className="flex" aria-hidden="true">
        {Array.from({ length: MAX_STARS }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              index < rounded
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-muted-foreground text-sm" aria-hidden="true">
          {formatRating(value)}
        </span>
      )}
    </div>
  );
}
