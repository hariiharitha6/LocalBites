import { Link, useLocation } from 'wouter';
import { Bookmark, GitCompareArrows } from 'lucide-react';
import { useApp } from '../../lib/app-state';
import { uniquePassportCount } from '../../lib/app-types';
import { isNavActive, primaryNav } from '../../lib/navigation';

export function SiteHeader() {
  const [path] = useLocation();
  const { journey, compares } = useApp();
  const passportCount = uniquePassportCount(journey);

  return (
    <header className="topbar">
      <div className="shell topbar-inner">
        <Link href="/" className="brand" aria-label="LocalBite home">
          <span className="brandmark" aria-hidden="true">
            L
          </span>
          <span className="brand-copy">
            <span>localbite</span>
            <small>Kerala food guide</small>
          </span>
        </Link>

        <nav className="navlinks" aria-label="Primary navigation">
          {primaryNav.map((item) => {
            const active = isNavActive(path, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'active' : ''}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="navright">
          <Link
            className={`passport-link ${isNavActive(path, '/journey') ? 'active' : ''}`}
            href="/journey"
            aria-label={`Food Passport, ${passportCount} ${passportCount === 1 ? 'dish' : 'dishes'} saved`}
          >
            <Bookmark size={17} aria-hidden="true" />
            <span>Passport</span>
            <span className="nav-count" aria-hidden="true">
              {passportCount}
            </span>
          </Link>
          <Link
            className={`icon-link ${isNavActive(path, '/compare') ? 'active' : ''}`}
            href="/compare"
            aria-label={`Compare dishes${compares.length ? `, ${compares.length} selected` : ''}`}
          >
            <GitCompareArrows size={17} aria-hidden="true" />
            {compares.length > 0 ? (
              <span className="nav-count" aria-hidden="true">
                {compares.length}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
