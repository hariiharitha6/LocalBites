import { Link } from 'wouter';
import {
  ArrowUpRight,
  Bookmark,
  Compass,
  GitCompareArrows,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: 'Editorial discovery',
    copy: 'A considered starting point for Kerala dishes, with taste, texture and cultural context rather than a wall of listings.',
  },
  {
    icon: Search,
    title: 'Search and filter',
    copy: 'Browse by category, budget, spice comfort, dietary starting point and the kind of experience you want.',
  },
  {
    icon: Bookmark,
    title: 'A private Food Passport',
    copy: 'Save dishes, mark them tried, add notes and reactions. Everything stays in your browser.',
  },
  {
    icon: GitCompareArrows,
    title: 'Side-by-side compare',
    copy: 'Put up to three dishes next to each other to understand the differences before you choose.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Personal preferences',
    copy: 'Tune spice, budget and curiosity so suggestions feel useful without pretending to know what is safe for you.',
  },
  {
    icon: MapPin,
    title: 'Area context',
    copy: 'Set a browsing area or choose to share your location. No venue, distance or review claims are invented.',
  },
];

const principles = [
  'Start from honest information, not engagement metrics.',
  'Make unfamiliar food feel approachable without flattening its culture.',
  'Keep personal data local by default.',
  'Design for small screens first, then give larger screens more breathing room.',
];

const stack = [
  'React 19',
  'TypeScript',
  'Vite 7',
  'Wouter',
  'Tailwind CSS 4',
  'Custom CSS design system',
  'Lucide icons',
  'localStorage',
];

export default function AboutPage() {
  return (
    <div className="page about-page fade-in">
      <section className="about-hero">
        <div>
          <div className="eyebrow">About LocalBite</div>
          <h1 className="display">A field guide, not a food court.</h1>
          <p className="lead">
            Discover the food. Understand the culture. Find your next favourite.
          </p>
        </div>
        <div className="about-note">
          <Sparkles size={20} aria-hidden="true" />
          <p>
            LocalBite is an independent frontend project about Kerala food. It is a discovery
            guide, not a delivery app.
          </p>
        </div>
      </section>

      <section className="about-grid">
        <div className="about-block">
          <div className="eyebrow">Why it exists</div>
          <h2>Kerala food rewards curiosity. It also needs context.</h2>
          <p>
            A first-time visitor meets a menu full of unfamiliar names, different textures and
            spice levels that are hard to guess. Most food apps are built to complete an order, not
            to help someone understand what they are choosing.
          </p>
          <p>
            LocalBite started from that gap: a calm, editorial way to learn what a dish may be like,
            what to ask at the table, and what to try next.
          </p>
        </div>

        <div className="about-block about-block--warm">
          <div className="eyebrow">The problem</div>
          <h2>Discovery is scattered. Reassurance is missing.</h2>
          <ul className="about-list">
            <li>Dish guides are spread across blogs, maps and social posts.</li>
            <li>Spice, texture and portion expectations are hard to compare.</li>
            <li>People forget what they wanted to try and what they loved.</li>
            <li>Generic recommendations rarely explain the culture behind a dish.</li>
          </ul>
        </div>
      </section>

      <section className="about-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">What it does</div>
            <h2>One clear path from curiosity to a confident first bite.</h2>
          </div>
          <Link className="text-link" href="/explore">
            Start exploring <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="about-feature-grid">
          {features.map(({ icon: Icon, title, copy }) => (
            <article className="about-feature" key={title}>
              <span className="about-feature-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-grid about-grid--reverse">
        <div className="about-block">
          <div className="eyebrow">How it is built</div>
          <h2>A small, deliberate frontend.</h2>
          <p>
            The app is a single-page React application with typed seed content and browser-based
            persistence. There is no account system, database or ordering flow. That constraint
            keeps the project focused on the discovery experience.
          </p>
          <div className="tech-list" aria-label="Technology stack">
            {stack.map((item) => (
              <span className="pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="about-block about-block--deep">
          <div className="eyebrow">Engineering approach</div>
          <h2>Useful before impressive.</h2>
          <ol className="about-list about-list--numbered">
            {principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ol>
          <p className="about-small">
            Semantic HTML, keyboard support, reduced-motion support and a consistent design system
            are part of the product, not an afterthought.
          </p>
        </div>
      </section>

      <section className="about-trust">
        <div className="about-trust-icon">
          <ShieldCheck size={22} aria-hidden="true" />
        </div>
        <div>
          <h2>What this guide does not claim</h2>
          <p>
            Dish facts, indicative prices and images are seed material and may be incomplete or
            unverified. LocalBite does not invent restaurants, reviews, ratings, distances or
            visits. Always confirm ingredients, allergens and current details with the venue.
          </p>
        </div>
        <HeartHandshake size={30} aria-hidden="true" className="about-trust-mark" />
      </section>

      <section className="about-cta">
        <div>
          <div className="eyebrow">Keep discovering</div>
          <h2>Find a dish worth asking about.</h2>
        </div>
        <div className="about-cta-actions">
          <Link className="btn" href="/explore">
            Explore dishes <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a
            className="btn secondary"
            href="https://github.com/hariiharitha6/LocalBites"
            target="_blank"
            rel="noreferrer"
          >
            View source <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
