import { Link } from 'wouter';

const footerLinks = [
  { href: '/explore', label: 'Explore dishes' },
  { href: '/journey', label: 'Food Passport' },
  { href: '/compare', label: 'Compare' },
  { href: '/nearby', label: 'Nearby' },
  { href: '/preferences', label: 'Preferences' },
  { href: '/about', label: 'About' },
];

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <span className="brandmark" aria-hidden="true">
              L
            </span>
            <span>localbite</span>
          </Link>
          <p>Discover the food. Understand the culture. Find your next favourite.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="footer-meta">
          <p>Kerala food discovery, built for curiosity.</p>
          <p>Seed facts, prices and details are unverified guidance. Confirm with the venue.</p>
        </div>
      </div>
    </footer>
  );
}
