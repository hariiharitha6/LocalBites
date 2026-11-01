export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export const primaryNav: NavItem[] = [
  { href: '/', label: 'Discover', shortLabel: 'Discover' },
  { href: '/explore', label: 'Explore', shortLabel: 'Explore' },
  { href: '/compare', label: 'Compare', shortLabel: 'Compare' },
  { href: '/journey', label: 'Food Passport', shortLabel: 'Passport' },
  { href: '/nearby', label: 'Nearby', shortLabel: 'Nearby' },
  { href: '/preferences', label: 'Preferences', shortLabel: 'Preferences' },
  { href: '/about', label: 'About', shortLabel: 'About' },
];

export const mobilePrimaryNav: NavItem[] = [
  { href: '/', label: 'Discover', shortLabel: 'Discover' },
  { href: '/explore', label: 'Explore', shortLabel: 'Explore' },
  { href: '/journey', label: 'Food Passport', shortLabel: 'Passport' },
  { href: '/compare', label: 'Compare', shortLabel: 'Compare' },
];

export const mobileMoreNav: NavItem[] = [
  { href: '/nearby', label: 'Nearby', shortLabel: 'Nearby' },
  { href: '/preferences', label: 'Preferences', shortLabel: 'Preferences' },
  { href: '/about', label: 'About LocalBite', shortLabel: 'About' },
];

export function isNavActive(path: string, href: string): boolean {
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}
