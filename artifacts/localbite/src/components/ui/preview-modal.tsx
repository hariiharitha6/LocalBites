import { Link } from 'wouter';
import { ArrowUpRight, Bookmark, Check, GitCompareArrows, X } from 'lucide-react';
import type { Food } from '../../food-content';
import { DishImage } from './dish-image';
import { Modal } from './modal';

type PreviewModalProps = {
  food: Food | null;
  onClose: () => void;
  onSave: (food: Food) => void;
  onCompare: (food: Food) => void;
  onTried: (food: Food) => void;
  saved: boolean;
  tried: boolean;
  inCompare: boolean;
};

export function PreviewModal({
  food,
  onClose,
  onSave,
  onCompare,
  onTried,
  saved,
  tried,
  inCompare,
}: PreviewModalProps) {
  return (
    <Modal
      open={Boolean(food)}
      onClose={onClose}
      title={food ? `${food.name} preview` : 'Food preview'}
      description={food?.intro}
      variant="sheet"
      className="preview-sheet"
    >
      {food ? (
        <>
          <div className="preview-head">
            <div>
              <div className="eyebrow">{food.category}</div>
              <p className="preview-title">{food.name}</p>
              <p className="preview-intro">{food.intro}</p>
            </div>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close preview"
              onClick={onClose}
              data-autofocus
            >
              <X size={18} />
            </button>
          </div>

          <DishImage
            food={food}
            className="preview-image"
            sizes="(min-width: 720px) 680px, 92vw"
            loading="eager"
          />

          <div className="tag-row">
            <span className="pill">Spice {food.spice}/4</span>
            <span className="pill soft">Indicative ₹{food.price[0]}–{food.price[1]}</span>
            {food.diet.map((diet) => (
              <span key={diet} className="pill soft">
                {diet}
              </span>
            ))}
          </div>

          <p className="preview-taste">
            {food.taste} {food.texture ? `· ${food.texture}` : ''}
          </p>

          <div className="preview-actions">
            <button
              type="button"
              className={`btn ${saved ? 'terracotta' : 'secondary'}`}
              aria-pressed={saved}
              onClick={() => onSave(food)}
            >
              <Bookmark size={16} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              type="button"
              className={`btn ${tried ? 'terracotta' : 'secondary'}`}
              aria-pressed={tried}
              onClick={() => onTried(food)}
            >
              <Check size={16} />
              {tried ? 'Tried' : 'Mark tried'}
            </button>
            <button
              type="button"
              className={`btn ${inCompare ? 'terracotta' : 'secondary'}`}
              aria-pressed={inCompare}
              onClick={() => onCompare(food)}
            >
              <GitCompareArrows size={16} />
              {inCompare ? 'In compare' : 'Compare'}
            </button>
            <Link className="btn" href={`/food/${food.id}`} onClick={onClose}>
              Full details <ArrowUpRight size={16} />
            </Link>
          </div>

          <p className="notice preview-notice">
            Seed guide only. Prices and details are unverified — ask the venue to confirm.
          </p>
        </>
      ) : null}
    </Modal>
  );
}
