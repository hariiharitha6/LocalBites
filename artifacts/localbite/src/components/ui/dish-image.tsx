import type { ReactEventHandler } from 'react';
import type { Food } from '../../food-content';

const fallbackSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <rect width="640" height="480" fill="#e8e1d2"/>
    <g fill="none" stroke="#617067" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
      <rect x="220" y="150" width="200" height="150" rx="18"/>
      <circle cx="276" cy="205" r="20"/>
      <path d="M232 278l58-52 42 37 28-24 48 39"/>
    </g>
    <text x="320" y="350" text-anchor="middle" fill="#52645a" font-family="Arial, sans-serif" font-size="24" font-weight="600">Image unavailable</text>
  </svg>
`;

export const imageFallbackSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`;

type DishImageProps = {
  food: Food;
  sizes: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decorative?: boolean;
};

export function DishImage({
  food,
  sizes,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
  decorative = false,
}: DishImageProps) {
  const handleError: ReactEventHandler<HTMLImageElement> = (event) => {
    const image = event.currentTarget;
    if (image.dataset.fallback === 'true') return;

    image.dataset.fallback = 'true';
    image.removeAttribute('srcset');
    image.src = imageFallbackSrc;
    image.alt = decorative ? '' : `${food.name}: image unavailable`;
  };

  return (
    <img
      className={className}
      src={food.image}
      srcSet={food.imageSrcSet}
      sizes={sizes}
      alt={decorative ? '' : `${food.name} — illustrative seed image`}
      width={food.imageWidth}
      height={food.imageHeight}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={handleError}
    />
  );
}
