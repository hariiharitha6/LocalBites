import { useMemo, useState, type FormEvent } from 'react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import {
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  GitCompareArrows,
  Info,
  LocateFixed,
  MapPin,
  NotebookPen,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { AppShell } from './components/layout/app-shell';
import { DishImage } from './components/ui/dish-image';
import { FoodCard } from './components/ui/food-card';
import { Modal } from './components/ui/modal';
import { PreviewModal } from './components/ui/preview-modal';
import { foods, type Food } from './food-content';
import { AppStateProvider, useApp } from './lib/app-state';
import { defaultPrefs } from './lib/app-types';
import { useStored } from './lib/use-stored';
import AboutPage from '@/pages/about';
import NotFound from '@/pages/not-found';

type ExploreFilters = {
  query: string;
  budget: number;
  spice: number;
  category: string;
  diet: string;
  experience: string;
  sort: string;
  intent: string;
};

const defaultExploreFilters: ExploreFilters = {
  query: '',
  budget: 500,
  spice: 4,
  category: 'Any',
  diet: 'Any',
  experience: 'Any',
  sort: 'featured',
  intent: '',
};

const featuredDishes = foods.slice(0, 4);

function App() {
  return (
    <AppStateProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppShell>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/explore" component={Explore} />
            <Route path="/food/:id" component={FoodDetail} />
            <Route path="/compare" component={Compare} />
            <Route path="/nearby" component={Nearby} />
            <Route path="/journey" component={Journey} />
            <Route path="/preferences" component={PreferencesPage} />
            <Route path="/about" component={AboutPage} />
            <Route component={NotFound} />
          </Switch>
        </AppShell>
      </WouterRouter>
    </AppStateProvider>
  );
}

function Disclosure() {
  return (
    <div className="seed-note" role="note">
      <Info size={15} aria-hidden="true" />
      <span>
        Seed guide only: dish details and indicative prices are unverified. Source type: legacy
        project seed · confidence: low. Ask the venue to confirm current details.
      </span>
    </div>
  );
}

function Home() {
  const [, setLocation] = useLocation();
  const { journey, compares, prefs, toggleSaved, toggleTried, addCompare } = useApp();
  const [preview, setPreview] = useState<Food | null>(null);
  const savedIds = journey.saved ?? [];
  const triedIds = journey.tried ?? [];

  const suggested = useMemo(
    () =>
      foods
        .filter(
          (food) =>
            !featuredDishes.some((featured) => featured.id === food.id) &&
            food.price[1] <= prefs.budget &&
            (prefs.spice < 0 || food.spice <= prefs.spice) &&
            (!prefs.diet.includes('Vegetarian') ||
              food.diet.some((item) => item.toLowerCase().includes('vegetarian'))) &&
            (!prefs.diet.includes('Vegan') ||
              food.diet.some((item) => item.toLowerCase().includes('vegan'))) &&
            (!prefs.tastes.includes('Mild & gentle') || food.spice <= 1) &&
            (!prefs.tastes.includes('Crisp textures') || /crisp|crispy/i.test(food.texture)) &&
            (!prefs.tastes.includes('Coconut-rich') ||
              /coconut/i.test(`${food.taste} ${food.ingredients?.join(' ') ?? ''}`)) &&
            (!prefs.tastes.includes('New to me') || !triedIds.includes(food.id)),
        )
        .slice(0, 3),
    [prefs, triedIds],
  );

  function surpriseMe() {
    const pick = foods[Math.floor(Math.random() * foods.length)];
    setLocation(`/food/${pick.id}`);
  }

  return (
    <div className="fade-in">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Kerala food discovery</div>
          <h1 className="display">What&apos;s your next bite?</h1>
          <p className="lead">
            Discover the food. Understand the culture. Find your next favourite.
          </p>
          <p className="hero-support">
            Honest taste notes, first-timer guidance and a private Food Passport. No invented
            restaurants or reviews.
          </p>
          <div className="hero-actions">
            <Link className="btn" href="/explore" data-testid="button-explore">
              <Search size={16} aria-hidden="true" /> Explore dishes
            </Link>
            <button className="btn secondary" type="button" onClick={surpriseMe} data-testid="button-surprise">
              <Sparkles size={16} aria-hidden="true" /> Surprise me
            </button>
            <Link className="btn secondary" href="/journey" data-testid="button-journey">
              <NotebookPen size={16} aria-hidden="true" /> My Passport
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <DishImage
            food={foods[0]}
            className="hero-photo"
            sizes="(min-width: 1200px) 620px, (min-width: 720px) 50vw, 92vw"
            loading="eager"
            fetchPriority="high"
          />
          <div className="hero-tag">
            <b>Start with {foods[0].name}</b>
            <span>{foods[0].intro}</span>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            Kerala
            <br />
            one bite
            <br />
            at a time
          </div>
        </div>
      </section>

      <Disclosure />

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Quick picks for you</div>
            <h2>Suggested from your preferences</h2>
          </div>
          <Link href="/preferences" className="text-link">
            Tune preferences <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <p className="section-note">
          Suggestions use your saved taste, budget and browse preferences. Not dietary or allergy
          assurances.
        </p>
        {suggested.length ? (
          <div className="food-grid">
            {suggested.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onPreview={setPreview}
                onSave={(item) => toggleSaved(item.id)}
                onCompare={(item) => addCompare(item.id)}
                saved={savedIds.includes(food.id)}
                inCompare={compares.includes(food.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>No close matches in this seed guide</h3>
            <p>Try widening your budget or preference range, or browse every dish.</p>
            <Link className="btn secondary" href="/explore">
              Explore all dishes
            </Link>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Great to start with</div>
            <h2>First-timer favourites</h2>
          </div>
          <Link href="/explore" className="text-link">
            Browse all dishes <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <p className="section-note">
          A short starting shortlist, not a ranking. Ask each kitchen about ingredients, spice and
          allergens before ordering.
        </p>
        <div className="food-grid">
          {featuredDishes.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onPreview={setPreview}
              onSave={(item) => toggleSaved(item.id)}
              onCompare={(item) => addCompare(item.id)}
              saved={savedIds.includes(food.id)}
              inCompare={compares.includes(food.id)}
            />
          ))}
        </div>
      </section>

      <PreviewModal
        food={preview}
        onClose={() => setPreview(null)}
        onSave={(item) => toggleSaved(item.id)}
        onCompare={(item) => addCompare(item.id)}
        onTried={(item) => toggleTried(item.id)}
        saved={preview ? savedIds.includes(preview.id) : false}
        tried={preview ? triedIds.includes(preview.id) : false}
        inCompare={preview ? compares.includes(preview.id) : false}
      />

      <section className="banner">
        <div>
          <div className="eyebrow">Build your story</div>
          <h2>Keep the dishes you love in your Food Passport</h2>
          <p>
            Save, mark tried, add notes and reactions as you discover Kerala food. Everything stays
            on this device.
          </p>
        </div>
        <Link className="btn" href="/journey">
          Open Food Passport <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

function Explore() {
  const [filters, setFilters] = useStored<ExploreFilters>(
    'localbite-explore-filters',
    defaultExploreFilters,
  );
  const { query, budget, spice, category, diet, experience, sort, intent } = filters;
  const categories = ['Any', ...Array.from(new Set(foods.map((food) => food.category)))];
  const { journey, compares, toggleSaved, toggleTried, addCompare } = useApp();
  const [preview, setPreview] = useState<Food | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const savedIds = journey.saved ?? [];
  const triedIds = journey.tried ?? [];

  const visible = useMemo(() => {
    let list = foods.filter(
      (food) =>
        `${food.name} ${food.localName} ${food.intro} ${food.story} ${food.taste} ${food.category} ${
          food.ingredients?.join(' ') ?? ''
        }`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        food.price[1] <= budget &&
        food.spice <= spice &&
        (category === 'Any' || food.category === category) &&
        (diet === 'Any' ||
          food.diet.some((item) => item.toLowerCase().includes(diet.toLowerCase()))) &&
        (experience === 'Any' || food.experience === experience),
    );
    if (intent) list = list.filter((food) => food.intents.includes(intent));
    if (sort === 'price') list.sort((a, b) => a.price[0] - b.price[0]);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, budget, spice, category, diet, experience, sort, intent]);

  function resetFilters() {
    setFilters(defaultExploreFilters);
  }

  const FiltersPanel = (
    <aside className="filters" aria-label="Food filters">
      <div className="filter-group">
        <h3>Category</h3>
        <select
          value={category}
          onChange={(event) => setFilters({ ...filters, category: event.target.value })}
          aria-label="Filter category"
          data-testid="filter-category"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <h3>Budget · up to ₹{budget}</h3>
        <div className="range-row">
          <span>₹70</span>
          <input
            type="range"
            min="100"
            max="700"
            step="25"
            value={budget}
            onChange={(event) => setFilters({ ...filters, budget: Number(event.target.value) })}
            aria-label="Maximum indicative budget"
            data-testid="filter-budget"
          />
          <span>₹700</span>
        </div>
      </div>
      <div className="filter-group">
        <h3>Spice comfort · up to {spice}</h3>
        <div className="range-row">
          <span>Mild</span>
          <input
            type="range"
            min="0"
            max="4"
            value={spice}
            onChange={(event) => setFilters({ ...filters, spice: Number(event.target.value) })}
            aria-label="Maximum spice level"
            data-testid="filter-spice"
          />
          <span>Hot</span>
        </div>
      </div>
      <div className="filter-group">
        <h3>Dietary starting point</h3>
        <select
          value={diet}
          onChange={(event) => setFilters({ ...filters, diet: event.target.value })}
          aria-label="Diet filter"
          data-testid="filter-diet"
        >
          {['Any', 'Vegetarian', 'Vegan'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <small>Never rely on these tags for allergy or safety decisions.</small>
      </div>
      <div className="filter-group">
        <h3>Experience</h3>
        <select
          value={experience}
          onChange={(event) => setFilters({ ...filters, experience: event.target.value })}
          aria-label="Filter by experience"
          data-testid="filter-experience"
        >
          <option>Any</option>
          {Array.from(new Set(foods.map((food) => food.experience))).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <button
        className="btn secondary small"
        type="button"
        onClick={resetFilters}
        data-testid="button-clear-filters"
      >
        <RotateCcw size={14} aria-hidden="true" /> Reset filters
      </button>
    </aside>
  );

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Discover Kerala dishes</div>
        <h1 className="display">Explore</h1>
        <p className="lead">
          Search dishes or start with a feeling. Every guide is a starting point, not a promise
          about a specific kitchen.
        </p>
      </div>

      <div className="searchbox">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          placeholder="Try “soft”, “rice” or a dish name"
          aria-label="Search foods"
          data-testid="input-search-food"
        />
        {query ? (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => setFilters({ ...filters, query: '' })}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="intent-block">
        <div className="eyebrow">Help me find something...</div>
        <div className="preference-options">
          {[
            'Eat local',
            'Under ₹200',
            'Mild & gentle',
            'Vegetarian',
            'Must try',
            'Quick & familiar',
          ].map((item) => (
            <button
              className={`option ${intent === item ? 'selected' : ''}`}
              type="button"
              key={item}
              aria-pressed={intent === item}
              onClick={() => setFilters({ ...filters, intent: intent === item ? '' : item })}
              data-testid={`intent-${item
                .toLowerCase()
                .replaceAll(' ', '-')
                .replace('&', 'and')
                .replace('₹', 'inr')}`}
            >
              {item}
            </button>
          ))}
        </div>
        <small>Editorial seed-guide shortcuts, not verified labels.</small>
      </div>

      <div className="filters-layout">
        <div className="filters-desktop">{FiltersPanel}</div>
        <section>
          <div className="results-head">
            <div className="results-count">
              <strong aria-live="polite">
                {visible.length} {visible.length === 1 ? 'dish' : 'dishes'}
              </strong>
              <button
                className="btn secondary small filters-mobile-btn"
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-haspopup="dialog"
              >
                <SlidersHorizontal size={14} aria-hidden="true" /> Filters
              </button>
            </div>
            <select
              className="sort-select"
              value={sort}
              onChange={(event) => setFilters({ ...filters, sort: event.target.value })}
              aria-label="Sort foods"
              data-testid="sort-foods"
            >
              <option value="featured">Featured</option>
              <option value="price">Price: lower first</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>

          {visible.length ? (
            <div className="food-grid">
              {visible.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onPreview={setPreview}
                  onSave={(item) => toggleSaved(item.id)}
                  onCompare={(item) => addCompare(item.id)}
                  saved={savedIds.includes(food.id)}
                  inCompare={compares.includes(food.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <div className="empty-icon">
                <Search size={21} aria-hidden="true" />
              </div>
              <h3>No dishes match those choices</h3>
              <p>Try a broader budget, spice range or category.</p>
              <button className="btn secondary" type="button" onClick={resetFilters}>
                Show all dishes
              </button>
            </div>
          )}
        </section>
      </div>

      <PreviewModal
        food={preview}
        onClose={() => setPreview(null)}
        onSave={(item) => toggleSaved(item.id)}
        onCompare={(item) => addCompare(item.id)}
        onTried={(item) => toggleTried(item.id)}
        saved={preview ? savedIds.includes(preview.id) : false}
        tried={preview ? triedIds.includes(preview.id) : false}
        inCompare={preview ? compares.includes(preview.id) : false}
      />

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter dishes"
        variant="sheet"
        className="filter-sheet"
      >
        <div className="modal-head">
          <h3>Filter dishes</h3>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
            data-autofocus
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {FiltersPanel}
        <div className="modal-actions">
          <button className="btn" type="button" onClick={() => setFiltersOpen(false)}>
            Show {visible.length} {visible.length === 1 ? 'dish' : 'dishes'}
          </button>
          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              resetFilters();
              setFiltersOpen(false);
            }}
          >
            Reset
          </button>
        </div>
      </Modal>

      <div className="page-disclosure">
        <Disclosure />
      </div>
    </div>
  );
}

function FoodDetail({ params }: { params: { id: string } }) {
  const food = foods.find((item) => item.id === params.id);
  const [, setLocation] = useLocation();
  const { journey, setJourney, compares, setCompares } = useApp();
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState({ type: 'Price seems off', detail: '' });
  const [message, setMessage] = useState('');

  if (!food) return <NotFound />;

  const foodId = food.id;
  const saved = (journey.saved ?? []).includes(foodId);
  const tried = (journey.tried ?? []).includes(foodId);

  function toggle(key: 'saved' | 'tried') {
    setJourney((prev) => {
      const base = {
        saved: prev.saved ?? [],
        tried: prev.tried ?? [],
        notes: prev.notes ?? {},
        reactions: prev.reactions ?? {},
      };
      return {
        ...base,
        [key]: base[key].includes(foodId)
          ? base[key].filter((item) => item !== foodId)
          : [...base[key], foodId],
      };
    });
    setMessage(
      key === 'saved'
        ? saved
          ? 'Removed from saved'
          : 'Saved for later'
        : tried
          ? 'Removed from tried list'
          : 'Marked as tried',
    );
  }

  function addCompare() {
    setCompares((prev) =>
      prev.includes(foodId) ? prev : prev.length >= 3 ? prev : [...prev, foodId],
    );
    setMessage(
      compares.includes(foodId)
        ? 'Already in your comparison'
        : compares.length >= 3
          ? 'Compare up to three foods.'
          : 'Added to compare',
    );
  }

  function submitReport(event: FormEvent) {
    event.preventDefault();
    if (report.detail.trim().length < 12) {
      setMessage('Please add a little more detail (at least 12 characters).');
      return;
    }
    try {
      const reports = JSON.parse(localStorage.getItem('localbite-reports') || '[]');
      reports.push({
        foodId,
        ...report,
        createdAt: new Date().toISOString(),
        status: 'local draft',
      });
      localStorage.setItem('localbite-reports', JSON.stringify(reports));
      setMessage('Report saved as a local draft. No moderation backend is connected.');
      setReportOpen(false);
      setReport({ ...report, detail: '' });
    } catch {
      setMessage('Could not save this draft on this device. Check local storage settings.');
    }
  }

  const related = food.related
    .map((id) => foods.find((item) => item.id === id))
    .filter((item): item is Food => Boolean(item));
  const next =
    foods.find((item) => item.id !== foodId && !(journey.tried ?? []).includes(item.id)) ||
    related[0] ||
    foods[0];

  return (
    <div className="page fade-in">
      <div className="detail-breadcrumb">
        <button
          className="btn secondary small"
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              window.history.back();
            } else {
              setLocation('/explore');
            }
          }}
        >
          <ChevronLeft size={14} aria-hidden="true" /> Back
        </button>
        <div className="eyebrow">
          <Link href="/explore" className="text-link">
            Explore
          </Link>{' '}
          / {food.category}
        </div>
      </div>

      <div className="detail-hero">
        <DishImage
          food={food}
          sizes="(min-width: 1200px) 640px, (min-width: 720px) 55vw, 92vw"
          loading="eager"
          fetchPriority="high"
        />
        <div>
          <div className="tag-row">
            <span className="pill">{food.category}</span>
            {food.diet.slice(0, 3).map((item) => (
              <span key={item} className="pill soft">
                {item}
              </span>
            ))}
          </div>
          <h1 className="detail-title">{food.name}</h1>
          <p className="lead">{food.intro}</p>
          <div className="action-row">
            <button
              className={`btn ${saved ? 'terracotta' : 'secondary'}`}
              type="button"
              aria-pressed={saved}
              onClick={() => toggle('saved')}
              data-testid="button-save-food"
            >
              <Bookmark size={16} aria-hidden="true" /> {saved ? 'Saved' : 'Save'}
            </button>
            <button
              className={`btn ${tried ? 'terracotta' : 'secondary'}`}
              type="button"
              aria-pressed={tried}
              onClick={() => toggle('tried')}
              data-testid="button-tried-food"
            >
              <Check size={16} aria-hidden="true" /> {tried ? 'Tried' : "I've tried this"}
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={addCompare}
              data-testid="button-compare-food"
            >
              <GitCompareArrows size={16} aria-hidden="true" /> Compare
            </button>
            <Link className="btn secondary" href="/journey">
              Record in Passport
            </Link>
          </div>
          <Disclosure />
        </div>
      </div>

      <div className="detail-content">
        <div>
          <section className="detail-section">
            <h2>Should I try this?</h2>
            <p>{food.tip}</p>
            <p>
              <b>First-timer guidance:</b> {food.experience}.{' '}
              {food.spice <= 1
                ? 'Mild and approachable.'
                : food.spice >= 3
                  ? 'Expect some heat — ask about spice if unsure.'
                  : 'Moderate warmth — easy to share.'}
            </p>
          </section>
          <section className="detail-section">
            <h2>A little context</h2>
            <p>{food.story}</p>
          </section>
          <section className="detail-section">
            <h2>What it may be like</h2>
            <p>
              <b>Taste:</b> {food.taste}
            </p>
            <p>
              <b>Texture:</b> {food.texture}
            </p>
            <p>
              <b>Spice guide:</b>{' '}
              {food.spice === 0
                ? 'No chilli expected'
                : `${food.spice} out of 4 — a broad seed estimate, not a venue-specific promise`}
            </p>
          </section>
          <section className="detail-section">
            <h2>Ingredients & suitability</h2>
            {food.ingredients ? (
              <p>
                <b>Commonly described with:</b> {food.ingredients.join(', ')}. This is not a
                complete ingredient list.
              </p>
            ) : (
              <p>Ingredients are unknown for this guide.</p>
            )}
            <p>{food.suitability}</p>
            <div className="notice">
              <b>Safety:</b> Allergen information is unknown. Do not use this guide for allergy,
              intolerance, religious or medical safety decisions. Ask the venue directly about
              ingredients, cross-contact and preparation.
            </div>
          </section>
          <section className="detail-section">
            <h2>Where to try it</h2>
            <p>
              No verified venue listings are available for this guide yet. Use Nearby to set an area
              or browse by permission if you choose; the app will not invent restaurants, distances
              or opening hours.
            </p>
            <Link className="text-link" href="/nearby">
              Open Nearby <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <p className="notice">
              Local/tourist-oriented context has not been verified for this dish or any specific
              venue.
            </p>
          </section>
          {related.length > 0 ? (
            <section className="detail-section">
              <h2>Related dishes</h2>
              <div className="preference-options">
                {related.map((item) => (
                  <Link className="option" href={`/food/${item.id}`} key={item.id}>
                    {item.name} <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          {next ? (
            <section className="detail-section">
              <h2>Discover next</h2>
              <div className="next-dish">
                <div>
                  <h3>{next.name}</h3>
                  <p>{next.intro}</p>
                </div>
                <Link className="btn secondary" href={`/food/${next.id}`}>
                  View this dish <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </section>
          ) : null}
          <section className="detail-section">
            <h2>Something not right?</h2>
            <p>
              Send a correction note for your own records. It stays on this device as a draft; no
              moderation service is connected.
            </p>
            <button
              className="btn secondary"
              type="button"
              onClick={() => setReportOpen(!reportOpen)}
              aria-expanded={reportOpen}
              data-testid="button-report-food"
            >
              <CircleAlert size={16} aria-hidden="true" />
              {reportOpen ? 'Close report' : 'Report a detail'}
            </button>
            {reportOpen ? (
              <form className="form-card" onSubmit={submitReport}>
                <div className="field">
                  <label htmlFor="report-type">What needs a second look?</label>
                  <select
                    id="report-type"
                    value={report.type}
                    onChange={(event) => setReport({ ...report, type: event.target.value })}
                    data-testid="select-report-type"
                  >
                    {[
                      'Price seems off',
                      'Description needs correction',
                      'Image does not match',
                      'Other',
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="report-detail">Your note</label>
                  <textarea
                    id="report-detail"
                    value={report.detail}
                    onChange={(event) => setReport({ ...report, detail: event.target.value })}
                    minLength={12}
                    required
                    placeholder="Share what you noticed (at least 12 characters)."
                    data-testid="input-report-detail"
                  />
                  <small>
                    Saved as a local draft only. Do not include personal or sensitive information.
                  </small>
                </div>
                <button className="btn" type="submit" data-testid="button-submit-report">
                  Save draft report
                </button>
              </form>
            ) : null}
          </section>
        </div>

        <aside className="facts" aria-label="Price and source details">
          <div className="eyebrow">Worth knowing</div>
          <h3>Price context</h3>
          <div className="fact-row">
            <small>Indicative seed range · unverified</small>
            <b>
              ₹{food.price[0]}–₹{food.price[1]}{' '}
              <span className="fact-unit">{food.priceUnit}</span>
            </b>
          </div>
          <div className="fact-row">
            <small>Freshness</small>
            <b>Not currently verified</b>
          </div>
          <div className="fact-row">
            <small>Source type</small>
            <b>Legacy project seed</b>
          </div>
          <div className="fact-row">
            <small>Confidence</small>
            <b>Low</b>
          </div>
          <div className="fact-row">
            <small>Dietary notes</small>
            <b>{food.diet.join(' · ')}</b>
          </div>
          <p className="notice facts-notice">
            Prices change by place, portion and time. Confirm the current price and ingredients
            before ordering.
          </p>
        </aside>
      </div>

      {message ? (
        <div className="toast" role="status">
          {message}
          <button type="button" aria-label="Dismiss message" onClick={() => setMessage('')}>
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Compare() {
  const { compares, setCompares } = useApp();
  const items = compares
    .map((id) => foods.find((food) => food.id === id))
    .filter((item): item is Food => Boolean(item));

  function toggle(id: string) {
    setCompares((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : old.length < 3 ? [...old, id] : old,
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Side by side</div>
        <h1 className="display">Compare bites</h1>
        <p className="lead">
          Look at taste, spice, texture and indicative price together. These are seed descriptions,
          not promises about a particular place.
        </p>
      </div>
      <Disclosure />

      <div className="compare-selector">
        <span className="compare-selector-label">Add up to 3:</span>
        {foods.map((food) => (
          <button
            key={food.id}
            className={`option ${compares.includes(food.id) ? 'selected' : ''}`}
            type="button"
            aria-pressed={compares.includes(food.id)}
            onClick={() => toggle(food.id)}
            data-testid={`compare-toggle-${food.id}`}
          >
            {food.name}
          </button>
        ))}
        <Link className="text-link" href="/explore">
          See all
        </Link>
      </div>

      {items.length < 2 ? (
        <div className="empty">
          <div className="empty-icon">
            <GitCompareArrows size={20} aria-hidden="true" />
          </div>
          <h3>Choose two or three foods</h3>
          <p>
            Select dishes above, or add from a card/detail. You can compare up to three at a time.
          </p>
          <Link className="btn" href="/explore">
            Find dishes
          </Link>
        </div>
      ) : (
        <div className="compare-grid">
          {items.map((food) => (
            <article className="compare-col" key={food.id}>
              <DishImage
                food={food}
                sizes="(min-width: 1200px) 30vw, (min-width: 720px) 45vw, 92vw"
              />
              <div>
                <div className="eyebrow">{food.category}</div>
                <h2>{food.name}</h2>
                <p className="compare-intro">{food.intro}</p>
                {[
                  ['Taste', food.taste],
                  ['Spice estimate', `${food.spice}/4 · low confidence`],
                  ['Texture', food.texture],
                  ['Diet', food.diet.join(', ')],
                  ['Suitability', food.suitability],
                  ['Indicative price', `₹${food.price[0]}–₹${food.price[1]} ${food.priceUnit} · unverified`],
                ].map(([label, value]) => (
                  <div className="compare-row" key={label}>
                    <small>{label}</small>
                    <div>{value}</div>
                  </div>
                ))}
                <Link className="text-link" href={`/food/${food.id}`}>
                  Read the guide <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
                <button
                  className="remove-btn"
                  type="button"
                  onClick={() => toggle(food.id)}
                  aria-label={`Remove ${food.name} from comparison`}
                  data-testid={`remove-compare-${food.id}`}
                >
                  <X size={17} aria-hidden="true" /> Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="compare-source">
        Source type: legacy project seed · Confidence: low. For allergies or dietary safety, ask the
        venue directly.
      </p>

      {items.length > 0 ? (
        <div className="compare-tray">
          <span>Comparing {items.length}/3</span>
          <div className="compare-tray-items">
            {items.map((food) => (
              <Link key={food.id} href={`/food/${food.id}`} className="pill">
                {food.name}
              </Link>
            ))}
          </div>
          <button
            className="btn secondary small"
            type="button"
            onClick={() => setCompares([])}
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Nearby() {
  const [area, setArea] = useStored('localbite-area', '');
  const [input, setInput] = useState(area);
  const [geo, setGeo] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [geoMessage, setGeoMessage] = useState('');

  function setAreaFromInput(event: FormEvent) {
    event.preventDefault();
    const nextArea = input.trim();
    setArea(nextArea);
    setGeoMessage(
      nextArea ? `Area set to ${nextArea}.` : 'Enter an area to set your browsing context.',
    );
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setGeo('error');
      setGeoMessage('Location is not available in this browser. You can still enter an area above.');
      return;
    }
    setGeo('loading');
    setGeoMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeo('success');
        setGeoMessage(
          `Location permission granted (approximately ${position.coords.latitude.toFixed(
            2,
          )}, ${position.coords.longitude.toFixed(2)}).`,
        );
      },
      (error) => {
        setGeo('error');
        setGeoMessage(
          error.code === 1
            ? 'Location permission was not granted. You can browse by entering an area instead.'
            : 'Could not determine your location. Try entering an area instead.',
        );
      },
      { timeout: 9000, maximumAge: 300000 },
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Browse with context, not assumptions</div>
        <h1 className="display">What&apos;s around you?</h1>
        <p className="lead">
          Set an area yourself, or ask your browser to share your location. We won&apos;t request it
          until you choose to.
        </p>
      </div>

      <form className="location-box" onSubmit={setAreaFromInput}>
        <MapPin size={20} aria-hidden="true" />
        <label htmlFor="area-input">Your area</label>
        <input
          id="area-input"
          placeholder="For example, Fort Kochi"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          data-testid="input-area"
        />
        <button className="btn small" type="submit" data-testid="button-set-area">
          Set area
        </button>
        <button
          className="btn secondary small"
          type="button"
          onClick={requestLocation}
          disabled={geo === 'loading'}
          data-testid="button-request-location"
        >
          <LocateFixed size={15} aria-hidden="true" />
          {geo === 'loading' ? 'Requesting…' : 'Use my location'}
        </button>
      </form>

      {geo === 'loading' ? (
        <div className="loading-skeleton location-loading" role="status" aria-label="Requesting location" />
      ) : null}
      {geoMessage ? (
        <div className={geo === 'error' ? 'notice' : 'inline-success'} role="status">
          {geoMessage}
        </div>
      ) : null}
      {area ? (
        <p className="pill area-pill">
          <MapPin size={13} aria-hidden="true" /> Browsing context: {area}
        </p>
      ) : null}

      <div className="empty nearby-empty">
        <div className="empty-icon">
          <MapPin size={20} aria-hidden="true" />
        </div>
        <h3>Verified places aren&apos;t loaded yet</h3>
        <p>
          LocalBite has no verified venue listings or live nearby data connected. We won&apos;t
          invent restaurant names, distances, opening hours or reviews. Explore dish guides for now,
          then confirm local details directly with a venue.
        </p>
        <Link className="btn" href="/explore">
          Explore dish guides <ChevronRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <Disclosure />
    </div>
  );
}

function Journey() {
  const { journey, setJourney } = useApp();
  const [tab, setTab] = useState<'saved' | 'tried'>('saved');
  const saved = journey.saved ?? [];
  const tried = journey.tried ?? [];
  const notes = journey.notes ?? {};
  const reactions = journey.reactions ?? {};
  const ids = tab === 'saved' ? saved : tried;
  const items = ids
    .map((id) => foods.find((food) => food.id === id))
    .filter((item): item is Food => Boolean(item));

  function updateNote(id: string, note: string) {
    setJourney((old) => ({
      ...old,
      notes: { ...(old.notes ?? {}), [id]: note },
    }));
  }

  function updateReaction(id: string, reaction: string) {
    setJourney((old) => ({
      ...old,
      reactions: { ...(old.reactions ?? {}), [id]: reaction },
    }));
  }

  function remove(id: string) {
    setJourney((old) => ({
      ...old,
      [tab]: (old[tab] ?? []).filter((item) => item !== id),
    }));
  }

  const progress = Math.round((tried.length / Math.max(1, foods.length)) * 100);
  const next =
    foods.find((food) => !tried.includes(food.id) && !saved.includes(food.id)) ||
    foods.find((food) => !tried.includes(food.id)) ||
    foods[0];

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Your personal Food Passport</div>
        <h1 className="display">Tried, saved, remembered.</h1>
        <p className="lead">
          Track dishes you&apos;ve tried and save ones to explore next. Notes and reactions stay on
          this device.
        </p>
      </div>

      <div className="preference-box journey-progress">
        <div className="journey-progress-head">
          <div>
            <div className="eyebrow">Discovery so far</div>
            <h3>
              {tried.length} of {foods.length} tried
            </h3>
          </div>
          <span className="pill">{progress}%</span>
        </div>
        <div
          className="progress-wrap"
          role="progressbar"
          aria-valuenow={tried.length}
          aria-valuemin={0}
          aria-valuemax={foods.length}
          aria-label="Foods tried"
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <small>A gentle record, not a goal.</small>
      </div>

      {next ? (
        <div className="banner journey-banner">
          <div>
            <div className="eyebrow">Next food suggestion</div>
            <h2>Try something new: {next.name}</h2>
            <p>
              {next.intro} {next.spice <= 1 ? 'Gentle starter.' : ''}
            </p>
          </div>
          <Link className="btn" href={`/food/${next.id}`}>
            See guide <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : null}

      <div className="tabs" role="tablist" aria-label="Passport lists">
        <button
          className={`tab ${tab === 'saved' ? 'active' : ''}`}
          type="button"
          onClick={() => setTab('saved')}
          role="tab"
          id="tab-saved"
          aria-selected={tab === 'saved'}
          aria-controls="passport-panel"
          data-testid="tab-saved"
        >
          Saved ({saved.length})
        </button>
        <button
          className={`tab ${tab === 'tried' ? 'active' : ''}`}
          type="button"
          onClick={() => setTab('tried')}
          role="tab"
          id="tab-tried"
          aria-selected={tab === 'tried'}
          aria-controls="passport-panel"
          data-testid="tab-tried"
        >
          Tried ({tried.length})
        </button>
      </div>

      <div
        id="passport-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="tab-panel"
      >
        {!items.length ? (
          <div className="empty">
            <div className="empty-icon">
              {tab === 'saved' ? (
                <Bookmark size={20} aria-hidden="true" />
              ) : (
                <Check size={20} aria-hidden="true" />
              )}
            </div>
            <h3>{tab === 'saved' ? 'Nothing saved yet' : 'Your first bite awaits'}</h3>
            <p>
              {tab === 'saved'
                ? 'Save a dish guide to build your list.'
                : 'Mark dishes as tried when you taste them and add notes/reactions.'}
            </p>
            <Link className="btn" href="/explore">
              Explore foods
            </Link>
          </div>
        ) : (
          <div>
            {items.map((food) => (
              <article className="journey-row" key={food.id}>
                <Link href={`/food/${food.id}`} aria-label={`View ${food.name}`}>
                  <DishImage
                    food={food}
                    sizes="(min-width: 720px) 84px, 68px"
                    decorative
                  />
                </Link>
                <div className="journey-row-body">
                  <h3>
                    <Link href={`/food/${food.id}`}>{food.name}</Link>
                  </h3>
                  <p>{tab === 'saved' ? 'Saved for later' : 'Tried'}</p>
                  {tab === 'tried' ? (
                    <div className="preference-options journey-reactions">
                      {['Loved', 'Liked', 'Okay', 'Meh'].map((reaction) => (
                        <button
                          key={reaction}
                          className={`option ${reactions[food.id] === reaction ? 'selected' : ''}`}
                          type="button"
                          aria-pressed={reactions[food.id] === reaction}
                          onClick={() => updateReaction(food.id, reaction)}
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <label htmlFor={`note-${food.id}`} className="sr-only">
                    Your note for {food.name}
                  </label>
                  <input
                    id={`note-${food.id}`}
                    className="note-input"
                    value={notes[food.id] || ''}
                    onChange={(event) => updateNote(food.id, event.target.value)}
                    placeholder={
                      tab === 'tried' ? 'Add a note about your experience…' : 'Add a note…'
                    }
                    data-testid={`note-${food.id}`}
                  />
                </div>
                <button
                  className="remove-btn"
                  type="button"
                  onClick={() => remove(food.id)}
                  aria-label={`Remove ${food.name} from ${tab}`}
                  data-testid={`remove-${tab}-${food.id}`}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <p className="page-legal">
        Saved foods, notes and reactions stay in this browser&apos;s local storage. Clearing browser
        data removes them.
      </p>
    </div>
  );
}

function PreferencesPage() {
  const { prefs, setPrefs } = useApp();
  const [saved, setSaved] = useState(false);

  function setDiet(value: string) {
    setPrefs((current) => ({
      ...current,
      diet: current.diet.includes(value)
        ? current.diet.filter((item) => item !== value)
        : [...current.diet, value],
    }));
    setSaved(false);
  }

  function setTaste(value: string) {
    setPrefs((current) => ({
      ...current,
      tastes: current.tastes.includes(value)
        ? current.tastes.filter((item) => item !== value)
        : [...current.tastes, value],
    }));
    setSaved(false);
  }

  const dietOptions = ['Vegetarian', 'Vegan', 'No preference'];
  const tasteOptions = ['Mild & gentle', 'Crisp textures', 'Coconut-rich', 'New to me'];

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Make the guide feel more like yours</div>
        <h1 className="display">A few things you like.</h1>
        <p className="lead">
          These preferences stay on this device. They&apos;re here to make browsing easier—not to
          determine what is safe for you to eat.
        </p>
      </div>

      <div className="preference-grid">
        <section className="preference-box">
          <h3>Spice comfort</h3>
          <p className="preference-help">
            Your usual comfort level; you can still explore anything.
          </p>
          <div className="preference-options">
            {[
              'Very mild',
              'Gentle',
              'Some warmth',
              'Bring the heat',
              'No preference',
            ].map((label, index) => {
              const selected = index === 4 ? prefs.spice < 0 : prefs.spice === index;
              return (
                <button
                  className={`option ${selected ? 'selected' : ''}`}
                  type="button"
                  key={label}
                  aria-pressed={selected}
                  onClick={() => {
                    setPrefs((current) => ({ ...current, spice: index === 4 ? -1 : index }));
                    setSaved(false);
                  }}
                  data-testid={`preference-spice-${index}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="preference-box">
          <h3>Budget guide</h3>
          <p className="preference-help">
            Maximum indicative price you&apos;d like to see in suggestions.
          </p>
          <div className="range-row">
            <span>₹100</span>
            <input
              type="range"
              min="100"
              max="700"
              step="25"
              value={prefs.budget}
              onChange={(event) => {
                setPrefs((current) => ({ ...current, budget: Number(event.target.value) }));
                setSaved(false);
              }}
              aria-label="Preferred maximum budget"
              data-testid="preference-budget"
            />
            <span>₹700</span>
          </div>
          <p className="pill">Up to ₹{prefs.budget} · prices are unverified</p>
        </section>

        <section className="preference-box">
          <h3>Dietary direction</h3>
          <p className="preference-help">
            Use this as a browse preference, never as an ingredient guarantee.
          </p>
          <div className="preference-options">
            {dietOptions.map((item) => {
              const selected =
                item === 'No preference' ? !prefs.diet.length : prefs.diet.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === 'No preference') {
                      setPrefs((current) => ({ ...current, diet: [] }));
                      setSaved(false);
                    } else {
                      setDiet(item);
                    }
                  }}
                  className={`option ${selected ? 'selected' : ''}`}
                  aria-pressed={selected}
                  data-testid={`preference-diet-${item.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        <section className="preference-box">
          <h3>What you&apos;re curious about</h3>
          <p className="preference-help">Pick any that sound like you.</p>
          <div className="preference-options">
            {tasteOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTaste(item)}
                className={`option ${prefs.tastes.includes(item) ? 'selected' : ''}`}
                aria-pressed={prefs.tastes.includes(item)}
                data-testid={`preference-taste-${item.toLowerCase().replaceAll(' ', '-')}`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="preference-actions">
        <button
          className="btn"
          type="button"
          onClick={() => {
            localStorage.setItem('localbite-preferences', JSON.stringify(prefs));
            setSaved(true);
          }}
          data-testid="button-save-preferences"
        >
          <Check size={16} aria-hidden="true" /> Save preferences
        </button>
        <button
          className="btn secondary"
          type="button"
          onClick={() => {
            setPrefs(defaultPrefs);
            setSaved(false);
          }}
          data-testid="button-reset-preferences"
        >
          Reset
        </button>
        {saved ? (
          <span className="inline-success preference-saved" role="status">
            Preferences saved on this device.
          </span>
        ) : null}
      </div>

      <div className="notice preference-notice">
        Important: ingredient lists may be incomplete or unknown. Always ask the venue about
        allergens, cross-contact, preparation and dietary suitability.
      </div>
    </div>
  );
}

export default App;
