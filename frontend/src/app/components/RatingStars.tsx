"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

interface RatingStarsProps {
  rating: number;      // Valor de 0 a 5
  size?: number;       // Tamaño del ícono en píxeles
}

export const RatingStars = ({ rating, size = 20 }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon
          key={`full-${i}`}
          className="text-pucara-red"
          style={{ width: size, height: size }}
        />
      ))}
      {hasHalfStar && (
        <div className="relative" style={{ width: size, height: size }}>
          <StarOutlineIcon className="absolute text-pucara-red/30" style={{ width: size, height: size }} />
          <div className="absolute overflow-hidden" style={{ width: size / 2, height: size }}>
            <StarIcon className="text-pucara-red" style={{ width: size, height: size }} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarOutlineIcon
          key={`empty-${i}`}
          className="text-pucara-red/30"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
};