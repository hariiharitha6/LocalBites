import { Link } from 'wouter';
import { ArrowUpRight, Bookmark, Eye, GitCompareArrows } from 'lucide-react';
import type { Food } from '../../food-content';
import { DishImage } from './dish-image';

type FoodCardProps = {
  food: Food;
  onPreview?: (food: Food) => void;
  onSave?: (food: Food) => void;
  onCompare?: (food: Food) => void;
  saved?: boolean;
  inCompare?: boolean;
};

export function FoodCard({
  food,
  onPreview,
  onSave,
  onCompare,
  saved = false,
  inCompare = false,
}: FoodCardProps) {
  return (
    <article className="food-card fade-in" data-testid={`card-food-${food.id}`}>
      <div className="food-card-media">
        <Link
          href={`/food/${food.id}`}
          aria-label={`Explore ${food.name}`}
          data-testid={`link-food-${food.id}`}
        >
          <DishImage
            food={food}
            className="food-image"
            sizes="(min-width: 1200px) 30vw, (min-width: 720px) 45vw, 92vw"
          />
        </Link>
        <div className="card-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={`Preview ${food.name}`}
            onClick={() => onPreview?.(food)}
            data-testid={`preview-${food.id}`}
          >
            <Eye size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`icon-btn ${saved ? 'active' : ''}`}
            aria-label={saved ? `Remove ${food.name} from saved` : `Save ${food.name}`}
            aria-pressed={saved}
            onClick={() => onSave?.(food)}
            data-testid={`save-${food.id}`}
          >
            <Bookmark size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`icon-btn ${inCompare ? 'active' : ''}`}
            aria-label={
              inCompare
                ? `${food.name} is in your comparison`
                : `Add ${food.name} to comparison`
            }
            aria-pressed={inCompare}
            onClick={() => onCompare?.(food)}
            data-testid={`card-compare-${food.id}`}
          >
            <GitCompareArrows size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="food-card-body">
        <div className="tag-row">
          <span className="pill">{food.category}</span>
          <span className="pill soft">Spice {food.spice}/4</span>
          {food.diet.slice(0, 1).map((diet) => (
            <span key={diet} className="pill soft">
              {diet}
            </span>
          ))}
        </div>

        <h3>
          <Link href={`/food/${food.id}`}>{food.name}</Link>
        </h3>
        <p>{food.intro}</p>

        <div className="food-card-foot">
          <span>Indicative ₹{food.price[0]}–{food.price[1]}</span>
          <Link className="text-link" href={`/food/${food.id}`}>
            View details <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
