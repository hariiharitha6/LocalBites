import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { foods } from '../../food-content';
import { MobileNav } from './mobile-nav';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

const pageTitles: Record<string, string> = {
  '/': 'Discover',
  '/explore': 'Explore Kerala food',
  '/compare': 'Compare dishes',
  '/journey': 'Food Passport',
  '/nearby': 'Nearby food guide',
  '/preferences': 'Preferences',
  '/about': 'About LocalBite',
};

export function AppShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();

  useEffect(() => {
    const food = path.startsWith('/food/')
      ? foods.find((item) => item.id === path.slice('/food/'.length))
      : undefined;
    document.title = `${food?.name ?? pageTitles[path] ?? 'Page not found'} · LocalBite`;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [path]);

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="shell site-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <MobileNav />
    </div>
  );
}
