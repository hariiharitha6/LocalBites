import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Bookmark,
  ChevronRight,
  Compass,
  GitCompareArrows,
  Info,
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { isNavActive, mobileMoreNav, mobilePrimaryNav } from '../../lib/navigation';
import { Modal } from '../ui/modal';

const icons = {
  '/': Compass,
  '/explore': Search,
  '/journey': Bookmark,
  '/compare': GitCompareArrows,
};

const moreIcons = {
  '/nearby': MapPin,
  '/preferences': SlidersHorizontal,
  '/about': Info,
};

const moreDescriptions: Record<string, string> = {
  '/nearby': 'Set an area or choose to share your location.',
  '/preferences': 'Tune spice, budget and what you are curious about.',
  '/about': 'Why LocalBite exists and how it is built.',
};

export function MobileNav() {
  const [path] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const moreActive = mobileMoreNav.some((item) => isNavActive(path, item.href));

  return (
    <>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {mobilePrimaryNav.map((item) => {
          const Icon = icons[item.href as keyof typeof icons] ?? Compass;
          const active = isNavActive(path, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'active' : ''}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
        <button
          type="button"
          className={`mobile-more ${moreActive || menuOpen ? 'active' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={19} aria-hidden="true" />
          <span>More</span>
        </button>
      </nav>

      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="More ways to explore"
        variant="sheet"
        className="mobile-menu-sheet"
      >
        <div className="mobile-menu-head">
          <div>
            <div className="eyebrow">More ways to explore</div>
            <p className="mobile-menu-title">Make LocalBite yours</p>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            data-autofocus
          >
            <X size={18} />
          </button>
        </div>

        <div className="mobile-menu-links">
          {mobileMoreNav.map((item) => {
            const Icon = moreIcons[item.href as keyof typeof moreIcons] ?? Info;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-menu-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="mobile-menu-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{moreDescriptions[item.href]}</small>
                </span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
            );
          })}
        </div>

        <p className="mobile-menu-note">Saved dishes and notes stay on this device.</p>
      </Modal>
    </>
  );
}
