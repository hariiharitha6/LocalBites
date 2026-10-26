import { useEffect, useMemo, useState, type ReactNode, type FormEvent, createContext, useContext } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Bookmark, Check, ChevronRight, Compass, MapPin, Search, SlidersHorizontal, X, ArrowUpRight, CircleAlert, NotebookPen, LocateFixed, GitCompareArrows, Trash2, Info, RotateCcw, Sparkles, Eye, Heart, Flame, Utensils, Leaf, Fish, CakeSlice, Home as HomeIcon, Filter, ChevronLeft } from 'lucide-react';
import { foods, type Food } from './food-content';
import NotFound from '@/pages/not-found';

type JourneyState = { saved: string[]; tried: string[]; notes: Record<string,string>; reactions?: Record<string,string>; };
type Preferences = { spice: number; budget: number; diet: string[]; tastes: string[]; };
const blankJourney: JourneyState = {saved:[],tried:[],notes:{},reactions:{}};
const defaultPrefs: Preferences = {spice:2,budget:350,diet:[],tastes:[]};

function useStored<T>(key:string, fallback:T):[T,(v:T|((old:T)=>T))=>void] {
  const [value,setValue]=useState<T>(()=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}},[key,value]);
  return [value,setValue];
}

type AppState = {
  journey: JourneyState; setJourney: (v:JourneyState|((o:JourneyState)=>JourneyState))=>void;
  compares: string[]; setCompares: (v:string[]|((o:string[])=>string[]))=>void;
  prefs: Preferences; setPrefs: (v:Preferences|((o:Preferences)=>Preferences))=>void;
};
const AppCtx = createContext<AppState|null>(null);
function useApp(){const ctx=useContext(AppCtx); if(!ctx) throw new Error('AppCtx missing'); return ctx;}
function AppShell({children}:{children:ReactNode}) {
  const [path]=useLocation(); const [journey]=useStored<JourneyState>('localbite-journey',blankJourney);
  const nav=[['/','Discover'],['/explore','Explore'],['/journey','Food Passport'],['/compare','Compare'],['/preferences','Preferences'],['/nearby','Nearby']];
  useEffect(()=>{const food=path.startsWith('/food/')?foods.find(item=>item.id===path.slice('/food/'.length)):undefined;const labels:Record<string,string>={'/':'Discover','/explore':'Explore Kerala food','/nearby':'Nearby food guide','/compare':'Compare dishes','/journey':'Food Passport','/preferences':'Preferences'};document.title=`${food?.name??labels[path]??'Not found'} · LocalBite`;},[path]);
  const passportCount = ((journey.saved||[]).length) + ((journey.tried||[]).length);
  function isActive(url:string){
    if(url==='/') return path==='/';
    if(url==='/explore') return path.startsWith('/explore');
    if(url==='/journey') return path.startsWith('/journey');
    if(url==='/compare') return path.startsWith('/compare');
    if(url==='/preferences') return path.startsWith('/preferences');
    if(url==='/nearby') return path.startsWith('/nearby');
    return path===url || path.startsWith(url+'/');
  }
  return <div className="app"><header className="topbar shell">
    <Link href="/" className="brand" data-testid="link-home"><span className="brandmark">L</span><span>localbite</span></Link>
    <nav className="navlinks" aria-label="Primary navigation">{nav.map(([url,label])=><Link key={url} href={url} className={isActive(url)?'active':''} data-testid={`link-${label.toLowerCase().replaceAll(' ','-')}`}>{label}</Link>)}</nav>
    <div className="navright"><Link className="icon-link" href="/journey" aria-label="Saved and tried foods" data-testid="link-saved"><Bookmark size={17}/><span>Passport</span><span className="nav-count">{passportCount}</span></Link><Link className="icon-link" href="/compare" aria-label="Compare" data-testid="link-compare"><GitCompareArrows size={17}/></Link></div>
  </header><main className="shell">{children}</main>
  <nav className="mobile-nav" aria-label="Mobile navigation">{[['/','Discover',Compass],['/explore','Explore',Search],['/journey','Passport',Bookmark],['/compare','Compare',GitCompareArrows],['/preferences','Prefs',SlidersHorizontal]].map(([url,label,Icon]:any)=><Link key={url} href={url} className={isActive(url)?'active':''} data-testid={`mobile-${String(label).toLowerCase().replace(' ','-')}`}><Icon size={18}/>{label}</Link>)}</nav>
  <footer className="footer shell"><span>LocalBite · Kerala food discovery, built for curiosity.</span><span>Seed facts, prices and details are unverified guidance.</span></footer></div>
}
function App() {
  const [journey,setJourney]=useStored<JourneyState>('localbite-journey',blankJourney);
  const [compares,setCompares]=useStored<string[]>('localbite-compare',[]);
  const [prefs,setPrefs]=useStored<Preferences>('localbite-preferences',defaultPrefs);
  const state={journey,setJourney,compares,setCompares,prefs,setPrefs};
  return <AppCtx.Provider value={state}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><AppShell><Switch>
  <Route path="/" component={Home}/><Route path="/explore" component={Explore}/><Route path="/food/:id" component={FoodDetail}/>
  <Route path="/compare" component={Compare}/><Route path="/nearby" component={Nearby}/><Route path="/journey" component={Journey}/><Route path="/preferences" component={PreferencesPage}/><Route component={NotFound}/>
</Switch></AppShell></WouterRouter></AppCtx.Provider>
}

function FoodCard({food, onPreview, onSave, onCompare, saved=false, inCompare=false}:{food:Food, onPreview?:(f:Food)=>void, onSave?:(f:Food)=>void, onCompare?:(f:Food)=>void, saved?:boolean, inCompare?:boolean}) {
  return <article className="food-card fade-in" data-testid={`card-food-${food.id}`}>
    <div style={{position:'relative'}}>
      <Link href={`/food/${food.id}`} aria-label={`Explore ${food.name}`} data-testid={`link-food-${food.id}`}><img className="food-image" src={food.image} alt={`${food.name} — illustrative legacy seed image`} loading="lazy"/></Link>
      <div style={{position:'absolute',top:10,right:10,display:'flex',gap:8}}>
        <button className="icon-btn" aria-label="Quick preview" onClick={(e)=>{e.preventDefault();onPreview?.(food);}} data-testid={`preview-${food.id}`}><Eye size={16}/></button>
        <button className={`icon-btn ${saved?'active':''}`} aria-label={saved?'Unsave':'Save'} onClick={(e)=>{e.preventDefault();onSave?.(food);}} data-testid={`save-${food.id}`}><Bookmark size={16}/></button>
        <button className={`icon-btn ${inCompare?'active':''}`} aria-label="Add to compare" onClick={(e)=>{e.preventDefault();onCompare?.(food);}} data-testid={`card-compare-${food.id}`}><GitCompareArrows size={16}/></button>
      </div>
    </div>
    <div className="food-card-body">
      <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        <span className="pill">{food.category}</span>
        {food.diet.slice(0,2).map(d=><span key={d} className="pill soft">{d}</span>)}
        <span className="pill soft">Spice {food.spice}/4</span>
      </div>
      <h3><Link href={`/food/${food.id}`} style={{color:'inherit',textDecoration:'none'}}>{food.name}</Link></h3>
      <p>{food.intro}</p>
      <div className="food-card-foot">
        <span>Indicative ₹{food.price[0]}–{food.price[1]}</span>
        <Link className="text-link" href={`/food/${food.id}`}>View details <ArrowUpRight size={12}/></Link>
      </div>
    </div>
  </article>
}
function Disclosure(){return <div className="seed-note" role="note"><Info size={15} style={{flexShrink:0}}/><span>Seed guide only: dish details and indicative prices are unverified. Source type: legacy project seed · confidence: low. Ask the venue to confirm current details.</span></div>}
function PreviewModal({food, onClose, onSave, onCompare, onTried, saved, tried}:{food:Food|null, onClose:()=>void, onSave:(f:Food)=>void, onCompare:(f:Food)=>void, onTried:(f:Food)=>void, saved:boolean, tried:boolean}) {
  if(!food) return null;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
    <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',gap:12}}>
        <div>
          <div className="eyebrow">{food.category}</div>
          <h2 style={{fontSize:26,margin:'6px 0'}}>{food.name}</h2>
          <p style={{color:'#5d6f63',margin:0}}>{food.intro}</p>
        </div>
        <button className="icon-btn" aria-label="Close preview" onClick={onClose}><X size={18}/></button>
      </div>
      <img src={food.image} alt={food.name} style={{width:'100%',height:220,objectFit:'cover',borderRadius:14,marginTop:16}}/>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>
        <span className="pill">Spice {food.spice}/4</span>
        <span className="pill soft">Indicative ₹{food.price[0]}–{food.price[1]}</span>
        {food.diet.map(d=><span key={d} className="pill soft">{d}</span>)}
      </div>
      <p style={{marginTop:12,lineHeight:1.7}}>{food.taste} {food.texture && `· ${food.texture}`}</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:16}}>
        <button className={`btn ${saved?'terracotta':'secondary'}`} onClick={()=>onSave(food)}><Bookmark size={16}/>{saved?'Saved':'Save'}</button>
        <button className={`btn ${tried?'terracotta':'secondary'}`} onClick={()=>onTried(food)}><Check size={16}/>{tried?'Tried':'Mark tried'}</button>
        <button className="btn secondary" onClick={()=>onCompare(food)}><GitCompareArrows size={16}/>Compare</button>
        <Link className="btn" href={`/food/${food.id}`} onClick={onClose}>Full details <ArrowUpRight size={16}/></Link>
      </div>
      <div className="notice" style={{marginTop:16}}>Seed guide only. Prices and details are unverified — ask the venue to confirm.</div>
    </div>
  </div>
}

function Home(){
  const featured=[foods[0],foods[1],foods[2],foods[3]].filter(Boolean);
   const [prefs]=useStored<Preferences>('localbite-preferences',defaultPrefs);
   const [journey,setJourney]=useStored<JourneyState>('localbite-journey',blankJourney);
   const [compares,setCompares]=useStored<string[]>('localbite-compare',[]);
   const [preview,setPreview]=useState<Food|null>(null);
   const suggested=foods.filter(f=>
     f.price[1]<=prefs.budget &&
     (prefs.spice<0||f.spice<=prefs.spice) &&
     (!prefs.diet.includes('Vegetarian')||f.diet.some(x=>x.toLowerCase().includes('vegetarian'))) &&
     (!prefs.diet.includes('Vegan')||f.diet.some(x=>x.toLowerCase().includes('vegan'))) &&
     (!prefs.tastes.includes('Mild & gentle')||f.spice<=1) &&
     (!prefs.tastes.includes('Crisp textures')||/crisp|crispy/i.test(f.texture)) &&
     (!prefs.tastes.includes('Coconut-rich')||/coconut/i.test(`${f.taste} ${f.ingredients?.join(' ')??''}`)) &&
     (!prefs.tastes.includes('New to me')||!(journey.tried||[]).includes(f.id))
   ).slice(0,3);
   function toggleSaved(id:string){setJourney(prev=>{const s=prev.saved||[];return {...prev,saved:s.includes(id)?s.filter(x=>x!==id):[...s,id]}})}
   function toggleTried(id:string){setJourney(prev=>{const t=prev.tried||[];return {...prev,tried:t.includes(id)?t.filter(x=>x!==id):[...t,id]}})}
   function addCompare(id:string){setCompares(prev=>prev.includes(id)?prev:prev.length>=3?prev:[...prev,id])}
   function surpriseMe(){const pool = foods.length?foods:[...featured];const pick = pool[Math.floor(Math.random()*pool.length)]; window.location.href = `#/food/${pick.id}`;}
   return <div className="fade-in"><section className="hero">
     <div className="hero-copy"><div className="eyebrow">Modern food discovery for Kerala</div><h1 className="display">What's your next bite?</h1><p className="lead">Find dishes worth trying with honest taste notes, gentle first-timer guidance, and your own Food Passport. No invented restaurants or reviews.</p><div className="hero-actions"><Link className="btn" href="/explore" data-testid="button-explore"><Search size={16}/>Explore dishes</Link><button className="btn secondary" onClick={surpriseMe} data-testid="button-surprise"><Sparkles size={16}/>Surprise me</button><Link className="btn secondary" href="/journey" data-testid="button-journey"><NotebookPen size={16}/>My Passport</Link></div></div>
     <div className="hero-art"><div className="hero-photo" role="img" aria-label="Kerala food selection on banana leaf" style={{backgroundImage:`linear-gradient(0deg,#172d2340,#172d2300 52%),url(${foods[0].image})`}}/><div className="hero-tag"><b>Start with {foods[0].name}</b><span>{foods[0].intro}</span></div><div className="hero-stamp">Kerala<br/>one bite<br/>at a time</div></div>
   </section>
   <Disclosure/>
   <section className="section"><div className="section-head"><div><div className="eyebrow">Quick picks for you</div><h2>Suggested based on your preferences</h2></div><Link href="/preferences" className="text-link">Tune preferences <ArrowUpRight size={14}/></Link></div><p style={{color:'#61736a'}}>Suggestions use your saved taste, budget and browse preferences. Not dietary or allergy assurances.</p>{suggested.length?<div className="food-grid">{suggested.map(f=><FoodCard key={f.id} food={f} onPreview={setPreview} onSave={(x)=>toggleSaved(x.id)} onCompare={(x)=>addCompare(x.id)} saved={(journey.saved||[]).includes(f.id)} inCompare={compares.includes(f.id)}/>)}</div>:<div className="empty"><h3>No close matches in this seed guide</h3><p>Try widening your budget or preference range, or browse every dish.</p><Link className="btn secondary" href="/explore">Explore all dishes</Link></div>}</section>
   <section className="section"><div className="section-head"><div><div className="eyebrow">Great to start with</div><h2>First-timer favourites</h2></div><Link href="/explore" className="text-link">Browse all dishes <ArrowUpRight size={14}/></Link></div><div className="food-grid">{featured.map(f=><FoodCard key={f.id} food={f} onPreview={setPreview} onSave={(x)=>toggleSaved(x.id)} onCompare={(x)=>addCompare(x.id)} saved={(journey.saved||[]).includes(f.id)} inCompare={compares.includes(f.id)}/>)}</div></section>
   <PreviewModal food={preview} onClose={()=>setPreview(null)} onSave={(x)=>{toggleSaved(x.id);}} onCompare={(x)=>{addCompare(x.id);}} onTried={(x)=>{toggleTried(x.id);}} saved={preview? (journey.saved||[]).includes(preview.id):false} tried={preview? (journey.tried||[]).includes(preview.id):false}/>
   <section className="banner"><div><div className="eyebrow">Build your story</div><h2>Track what you love in your Food Passport</h2><p>Save, mark tried, add notes and reactions as you discover Kerala food. Everything stays on this device.</p></div><Link className="btn" href="/journey">Open Food Passport <ChevronRight size={16}/></Link></section>
   </div>
}

function Explore(){
  const [filters,setFilters]=useStored('localbite-explore-filters',{query:'',budget:500,spice:4,category:'Any',diet:'Any',experience:'Any',sort:'featured',intent:''});
  const {query,budget,spice,category,diet,experience,sort,intent}=filters;
  const categories=['Any',...Array.from(new Set(foods.map(f=>f.category)))];
  const [journey,setJourney]=useStored<JourneyState>('localbite-journey',blankJourney);
  const [compares,setCompares]=useStored<string[]>('localbite-compare',[]);
  const [preview,setPreview]=useState<Food|null>(null);
  const [filtersOpen,setFiltersOpen]=useState(false);
    const visible=useMemo(()=>{let list=foods.filter(f=>(`${f.name} ${f.localName} ${f.intro} ${f.story} ${f.taste} ${f.category} ${f.ingredients?.join(' ')??''}`).toLowerCase().includes(query.toLowerCase())&&f.price[1]<=budget&&f.spice<=spice&&(category==='Any'||f.category===category)&&(diet==='Any'||f.diet.some(x=>x.toLowerCase().includes(diet.toLowerCase())))&&(experience==='Any'||f.experience===experience));
   if(intent)list=list.filter(f=>f.intents.includes(intent)); if(sort==='price')list.sort((a,b)=>a.price[0]-b.price[0]); if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name)); if(sort==='featured'){} return list},[query,budget,spice,category,diet,experience,sort,intent]);
   function toggleSaved(id:string){setJourney(prev=>{const s=prev.saved||[];return {...prev,saved:s.includes(id)?s.filter(x=>x!==id):[...s,id]}})}
   function toggleTried(id:string){setJourney(prev=>{const t=prev.tried||[];return {...prev,tried:t.includes(id)?t.filter(x=>x!==id):[...t,id]}})}
   function addCompare(id:string){setCompares(prev=>prev.includes(id)?prev:prev.length>=3?prev:[...prev,id])}
   const FiltersPanel = <aside className="filters" aria-label="Food filters">
       <div className="filter-group"><h3>Category</h3><select value={category} onChange={e=>setFilters({...filters,category:e.target.value})} aria-label="Filter category" data-testid="filter-category">{categories.map(x=><option key={x}>{x}</option>)}</select></div>
       <div className="filter-group"><h3>Budget · up to ₹{budget}</h3><div className="range-row"><span>₹70</span><input type="range" min="100" max="700" step="25" value={budget} onChange={e=>setFilters({...filters,budget:Number(e.target.value)})} aria-label="Maximum indicative budget" data-testid="filter-budget"/><span>₹700</span></div></div>
       <div className="filter-group"><h3>Spice comfort · up to {spice}</h3><div className="range-row"><span>Mild</span><input type="range" min="0" max="4" value={spice} onChange={e=>setFilters({...filters,spice:Number(e.target.value)})} aria-label="Maximum spice level" data-testid="filter-spice"/><span>Hot</span></div></div>
       <div className="filter-group"><h3>Dietary starting point</h3><select value={diet} onChange={e=>setFilters({...filters,diet:e.target.value})} aria-label="Diet filter" data-testid="filter-diet">{['Any','Vegetarian','Vegan'].map(x=><option key={x}>{x}</option>)}</select><small>Never rely on these tags for allergy or safety decisions.</small></div>
       <div className="filter-group"><h3>Experience</h3><select value={experience} onChange={e=>setFilters({...filters,experience:e.target.value})} aria-label="Filter by experience" data-testid="filter-experience"><option>Any</option>{Array.from(new Set(foods.map(f=>f.experience))).map(x=><option key={x}>{x}</option>)}</select></div>
       <button className="btn secondary small" onClick={()=>setFilters({query:'',budget:500,spice:4,category:'Any',diet:'Any',experience:'Any',sort:'featured',intent:''})} data-testid="button-clear-filters"><RotateCcw size={14}/>Reset filters</button>
     </aside>;
   return <div className="page fade-in"><div className="eyebrow">Discover Kerala dishes</div><h1 className="display">Explore</h1><p className="lead">Search dishes or start with a feeling. Every guide is a starting point, not a promise about a specific kitchen.</p>
     <div className="searchbox" style={{marginTop:24}}><Search size={18}/><input value={query} onChange={e=>setFilters({...filters,query:e.target.value})} placeholder="Try “soft”, “rice” or a dish name" aria-label="Search foods" data-testid="input-search-food"/></div>
      <div style={{marginTop:24}}><div className="eyebrow">Help me find something...</div><div className="preference-options" style={{marginTop:10}}>{['Eat local','Under ₹200','Mild & gentle','Plant-friendly','Must try','Quick & familiar'].map(x=><button className={`option ${intent===x?'selected':''}`} key={x} onClick={()=>setFilters({...filters,intent:intent===x?'':x})} data-testid={`intent-${x.toLowerCase().replaceAll(' ','-').replace('&','and').replace('₹','inr')}`}>{x}</button>)}</div><small>Editorial seed-guide shortcuts, not verified labels.</small></div>
     <div className="filters-layout"><div className="filters-desktop">{FiltersPanel}</div><section><div className="results-head"><div style={{display:'flex',gap:10,alignItems:'center'}}><strong>{visible.length} {visible.length===1?'dish':'dishes'}</strong><button className="btn secondary small filters-mobile-btn" onClick={()=>setFiltersOpen(true)}><SlidersHorizontal size={14}/>Filters</button></div><select className="sort-select" value={sort} onChange={e=>setFilters({...filters,sort:e.target.value})} aria-label="Sort foods" data-testid="sort-foods"><option value="featured">Featured</option><option value="price">Price: lower first</option><option value="name">Name: A–Z</option></select></div>
       {visible.length?<div className="food-grid">{visible.map(f=><FoodCard key={f.id} food={f} onPreview={setPreview} onSave={(x)=>toggleSaved(x.id)} onCompare={(x)=>addCompare(x.id)} saved={(journey.saved||[]).includes(f.id)} inCompare={compares.includes(f.id)}/>)}</div>:<div className="empty"><div className="empty-icon"><Search size={21}/></div><h3>No dishes match those choices</h3><p>Try a broader budget, spice range or category.</p><button className="btn secondary" onClick={()=>setFilters({query:'',budget:500,spice:4,category:'Any',diet:'Any',experience:'Any',sort:'featured',intent:''})}>Show all dishes</button></div>}
     </section></div><PreviewModal food={preview} onClose={()=>setPreview(null)} onSave={(x)=>toggleSaved(x.id)} onCompare={(x)=>addCompare(x.id)} onTried={(x)=>toggleTried(x.id)} saved={preview? (journey.saved||[]).includes(preview.id):false} tried={preview? (journey.tried||[]).includes(preview.id):false}/>
     {filtersOpen&&<div className="modal-backdrop" role="dialog" aria-modal="true" onClick={()=>setFiltersOpen(false)}><div className="modal-sheet" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3>Filters</h3><button className="icon-btn" onClick={()=>setFiltersOpen(false)}><X size={18}/></button></div>{FiltersPanel}<div style={{marginTop:16,display:'flex',gap:10}}><button className="btn" onClick={()=>setFiltersOpen(false)}>Apply</button><button className="btn secondary" onClick={()=>{setFilters({query:'',budget:500,spice:4,category:'Any',diet:'Any',experience:'Any',sort:'featured',intent:''});setFiltersOpen(false);}}>Reset</button></div></div></div>}
     <div style={{marginTop:24}}><Disclosure/></div>
   </div>
}

function FoodDetail({params}:{params:{id:string}}){
  const food=foods.find(f=>f.id===params.id); const [,setLocation]=useLocation();
  const [journey,setJourney]=useStored<JourneyState>('localbite-journey',blankJourney); const [compares,setCompares]=useStored<string[]>('localbite-compare',[]); const [reportOpen,setReportOpen]=useState(false); const [report,setReport]=useState({type:'Price seems off',detail:''}); const [message,setMessage]=useState('');
  if(!food)return <NotFound/>;
   const foodId=food.id;
   const saved=(journey.saved||[]).includes(foodId),tried=(journey.tried||[]).includes(foodId);
   function toggle(key:'saved'|'tried'){setJourney(prev=>{const base={saved:prev.saved||[],tried:prev.tried||[],notes:prev.notes||{},reactions:prev.reactions||{}};return {...base,[key]:base[key].includes(foodId)?base[key].filter(x=>x!==foodId):[...base[key],foodId]}});setMessage(key==='saved'?(saved?'Removed from saved':'Saved for later'):(tried?'Removed from tried list':'Marked as tried'))}
   function addCompare(){setCompares(prev=>prev.includes(foodId)?prev:prev.length>=3?prev:[...prev,foodId]);setMessage(compares.includes(foodId)?'Already in your comparison':compares.length>=3?'Compare up to three foods.':'Added to compare')}
   function submitReport(e:FormEvent){e.preventDefault();if(report.detail.trim().length<12){setMessage('Please add a little more detail (at least 12 characters).');return}try{const reports=JSON.parse(localStorage.getItem('localbite-reports')||'[]');reports.push({foodId,...report,createdAt:new Date().toISOString(),status:'local draft'});localStorage.setItem('localbite-reports',JSON.stringify(reports));setMessage('Report saved as a local draft. No moderation backend is connected.');setReportOpen(false);setReport({...report,detail:''})}catch{setMessage('Could not save this draft on this device. Check local storage settings.')}}
   const related = food.related.map(id=>foods.find(x=>x.id===id)).filter((x):x is Food=>!!x);
   const next = foods.find(f=>f.id!==foodId && !((journey.tried||[]).includes(f.id))) || related[0] || foods[0];
   return <div className="page fade-in"><div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:10}}><button className="btn secondary small" onClick={()=>{if(typeof window !== 'undefined' && window.history.length>1){window.history.back();}else{setLocation('/explore');}}}><ChevronLeft size={14}/> Back</button><div className="eyebrow"><Link href="/explore" className="text-link">Explore</Link> / {food.category}</div></div>
     <div className="detail-hero"><img src={food.image} alt={`${food.name} — unverified legacy seed image`} loading="lazy"/><div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><span className="pill">{food.category}</span>{food.diet.slice(0,3).map(d=><span key={d} className="pill soft">{d}</span>)}</div><h1 className="detail-title">{food.name}</h1><p className="lead">{food.intro}</p><div className="action-row"><button className={`btn ${saved?'terracotta':'secondary'}`} onClick={()=>toggle('saved')} data-testid="button-save-food"><Bookmark size={16}/>{saved?'Saved':'Save'}</button><button className={`btn ${tried?'terracotta':'secondary'}`} onClick={()=>toggle('tried')} data-testid="button-tried-food"><Check size={16}/>{tried?'Tried':'I\'ve tried this'}</button><button className="btn secondary" onClick={addCompare} data-testid="button-compare-food"><GitCompareArrows size={16}/>Compare</button><Link className="btn secondary" href="/journey">Record in Passport</Link></div><Disclosure/></div></div>
     <div className="detail-content"><div>
       <section className="detail-section"><h2>Should I try this?</h2><p>{food.tip}</p><p><b>First-timer guidance:</b> {food.experience}. {food.spice<=1?'Mild and approachable.':food.spice>=3?'Expect some heat — ask about spice if unsure.':'Moderate warmth — easy to share.'}</p></section>
       <section className="detail-section"><h2>A little context</h2><p>{food.story}</p></section>
       <section className="detail-section"><h2>What it may be like</h2><p><b>Taste:</b> {food.taste}</p><p><b>Texture:</b> {food.texture}</p><p><b>Spice guide:</b> {food.spice===0?'No chilli expected':`${food.spice} out of 4 — a broad seed estimate, not a venue-specific promise`}</p></section>
       <section className="detail-section"><h2>Ingredients & suitability</h2>{food.ingredients?<p><b>Commonly described with:</b> {food.ingredients.join(', ')}. This is not a complete ingredient list.</p>:<p>Ingredients are unknown for this guide.</p>}<p>{food.suitability}</p><div className="notice"><b>Safety:</b> Allergen information is unknown. Do not use this guide for allergy, intolerance, religious or medical safety decisions. Ask the venue directly about ingredients, cross-contact and preparation.</div></section>
        <section className="detail-section"><h2>Where to try it</h2><p>No verified venue listings are available for this guide yet. Use Nearby to set an area or browse by permission if you choose; the app will not invent restaurants, distances or opening hours.</p><Link className="text-link" href="/nearby">Open Nearby <ArrowUpRight size={13}/></Link><p className="notice">Local/tourist-oriented context has not been verified for this dish or any specific venue.</p></section>
       {related.length>0 && <section className="detail-section"><h2>Related dishes</h2><div className="preference-options">{related.map(rel=><Link className="option" href={`/food/${rel.id}`} key={rel.id}>{rel.name} <ArrowUpRight size={12}/></Link>)}</div></section>}
       {next && <section className="detail-section"><h2>Discover next</h2><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}><div><h3 style={{margin:'0 0 6px'}}>{next.name}</h3><p style={{margin:0,color:'#5d6f63'}}>{next.intro}</p></div><Link className="btn secondary" href={`/food/${next.id}`}>View this dish <ArrowUpRight size={16}/></Link></div></section>}
       <section className="detail-section"><h2>Something not right?</h2><p>Send a correction note for your own records. It stays on this device as a draft; no moderation service is connected.</p><button className="btn secondary" onClick={()=>setReportOpen(!reportOpen)} data-testid="button-report-food"><CircleAlert size={16}/>{reportOpen?'Close report':'Report a detail'}</button>
         {reportOpen&&<form className="form-card" style={{marginTop:18}} onSubmit={submitReport}><div className="field"><label htmlFor="report-type">What needs a second look?</label><select id="report-type" value={report.type} onChange={e=>setReport({...report,type:e.target.value})} data-testid="select-report-type">{['Price seems off','Description needs correction','Image does not match','Other'].map(x=><option key={x}>{x}</option>)}</select></div><div className="field"><label htmlFor="report-detail">Your note</label><textarea id="report-detail" value={report.detail} onChange={e=>setReport({...report,detail:e.target.value})} minLength={12} required placeholder="Share what you noticed (at least 12 characters)." data-testid="input-report-detail"/><small>Saved as a local draft only. Do not include personal or sensitive information.</small></div><button className="btn" type="submit" data-testid="button-submit-report">Save draft report</button></form>}
       </section>
     </div><aside className="facts"><div className="eyebrow">Worth knowing</div><h3>Price context</h3><div className="fact-row"><small>Indicative seed range · unverified</small><b>₹{food.price[0]}–₹{food.price[1]} <span style={{fontSize:11,fontWeight:400}}> {food.priceUnit}</span></b></div><div className="fact-row"><small>Freshness</small><b>Not currently verified</b></div><div className="fact-row"><small>Source type</small><b>Legacy project seed</b></div><div className="fact-row"><small>Confidence</small><b>Low</b></div><div className="fact-row"><small>Dietary notes</small><b>{food.diet.join(' · ')}</b></div><p className="notice" style={{marginTop:16}}>Prices change by place, portion and time. Confirm the current price and ingredients before ordering.</p></aside></div>
     {message&&<div className="toast" role="status" onAnimationEnd={()=>{}}>{message}<button aria-label="Dismiss message" onClick={()=>setMessage('')} style={{background:'none',border:0,color:'inherit',marginLeft:14,cursor:'pointer'}}><X size={14}/></button></div>}
   </div>
}

function Compare(){
  const [selected,setSelected]=useStored<string[]>('localbite-compare',[]);
  const items=selected.map(id=>foods.find(f=>f.id===id)).filter((x):x is Food=>!!x);
  function toggle(id:string){setSelected(old=>old.includes(id)?old.filter(x=>x!==id):old.length<3?[...old,id]:old)}
  return <div className="page fade-in"><div className="eyebrow">Side by side</div><h1 className="display">Compare bites</h1><p className="lead">Look at taste, spice, texture and indicative price together. These are seed descriptions, not promises about a particular place.</p>
     <Disclosure/>
     <div style={{margin:'22px 0',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
       <span style={{fontWeight:600}}>Add up to 3:</span>
       {foods.slice(0,12).map(f=><button key={f.id} className={`option ${selected.includes(f.id)?'selected':''}`} onClick={()=>toggle(f.id)} data-testid={`compare-toggle-${f.id}`}>{selected.includes(f.id)?'✓ ':''}{f.name}</button>)}
       <Link className="text-link" href="/explore">See all</Link>
     </div>
     {items.length<2?<div className="empty"><div className="empty-icon"><GitCompareArrows size={20}/></div><h3>Choose two or three foods</h3><p>Select dishes above, or add from a card/detail. You can compare up to three at a time.</p><Link className="btn" href="/explore">Find dishes</Link></div>:<div className="compare-grid">{items.map(f=><article className="compare-col" key={f.id}><img src={f.image} alt={`${f.name} unverified seed image`}/><div><div className="eyebrow">{f.category}</div><h2 style={{fontSize:25}}>{f.name}</h2><p style={{fontSize:12,lineHeight:1.55,color:'#69786e'}}>{f.intro}</p>{[['Taste',f.taste],['Spice estimate',`${f.spice}/4 · low confidence`],['Texture',f.texture],['Diet',f.diet.join(', ')],['Suitability',f.suitability],['Indicative price',`₹${f.price[0]}–₹${f.price[1]} ${f.priceUnit} · unverified`]].map(([label,value])=><div className="compare-row" key={label}><small>{label}</small><div style={{textAlign:'right',maxWidth:'60%'}}>{value}</div></div>)}<Link className="text-link" href={`/food/${f.id}`}>Read the guide <ArrowUpRight size={13}/></Link><button className="remove-btn" onClick={()=>toggle(f.id)} aria-label={`Remove ${f.name} from comparison`} data-testid={`remove-compare-${f.id}`}><X size={17}/> Remove</button></div></article>)}</div>}
     <p style={{fontSize:11,color:'#748076',marginTop:20}}>Source type: legacy project seed · Confidence: low. For allergies or dietary safety, ask the venue directly.</p>
     {items.length>0 && <div className="compare-tray"><span>Comparing {items.length}/3</span><div style={{display:'flex',gap:8}}>{items.map(f=><Link key={f.id} href={`/food/${f.id}`} className="pill" style={{textDecoration:'none'}}>{f.name}</Link>)}</div><Link className="btn secondary small" href="/compare">Open full view</Link></div>}
   </div>
}

function Nearby(){
 const [area,setArea]=useStored('localbite-area',''); const [input,setInput]=useState(area); const [geo,setGeo]=useState<'idle'|'loading'|'success'|'error'>('idle'); const [geoMessage,setGeoMessage]=useState('');
 function requestLocation(){if(!navigator.geolocation){setGeo('error');setGeoMessage('Location is not available in this browser. You can still enter an area above.');return}setGeo('loading');setGeoMessage('');navigator.geolocation.getCurrentPosition(pos=>{setGeo('success');setGeoMessage(`Location permission granted (approximately ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}).`);},err=>{setGeo('error');setGeoMessage(err.code===1?'Location permission was not granted. You can browse by entering an area instead.':'Could not determine your location. Try entering an area instead.')},{timeout:9000,maximumAge:300000})}
 return <div className="page fade-in"><div className="eyebrow">Browse with context, not assumptions</div><h1 className="display">What’s around you?</h1><p className="lead">Set an area yourself, or ask your browser to share your location. We won’t request it until you choose to.</p>
   <div className="location-box"><MapPin size={20}/><label htmlFor="area-input" style={{fontWeight:700,fontSize:13}}>Your area</label><input id="area-input" placeholder="For example, Fort Kochi" value={input} onChange={e=>setInput(e.target.value)} data-testid="input-area"/><button className="btn small" onClick={()=>{setArea(input.trim());setGeoMessage(input.trim()?`Area set to ${input.trim()}.`:'Enter an area to set your browsing context.')}} data-testid="button-set-area">Set area</button><button className="btn secondary small" onClick={requestLocation} disabled={geo==='loading'} data-testid="button-request-location"><LocateFixed size={15}/>{geo==='loading'?'Requesting…':'Use my location'}</button></div>
   {geo==='loading'&&<div className="loading-skeleton" style={{maxWidth:320}} role="status" aria-label="Requesting location"/>}
   {geoMessage&&<div className={geo==='error'?'notice':'inline-success'} role="status">{geoMessage}</div>}
   {area&&<p className="pill"><MapPin size={13}/> Browsing context: {area}</p>}
   <div className="empty" style={{marginTop:26}}><div className="empty-icon"><MapPin size={20}/></div><h3>Verified places aren’t loaded yet</h3><p>LocalBite has no verified venue listings or live nearby data connected. We won’t invent restaurant names, distances, opening hours or reviews. Explore dish guides for now, then confirm local details directly with a venue.</p><Link className="btn" href="/explore">Explore dish guides <ChevronRight size={15}/></Link></div>
   <Disclosure/>
 </div>
}

function Journey(){
  const [journey,setJourney]=useStored<JourneyState>('localbite-journey',blankJourney); const [tab,setTab]=useState<'saved'|'tried'>('saved');
  const saved=journey.saved||[], tried=journey.tried||[], notes=journey.notes||{}, reactions=journey.reactions||{};
  const ids=tab==='saved'?saved:tried; const items=ids.map(id=>foods.find(f=>f.id===id)).filter((x):x is Food=>!!x);
  function updateNote(id:string,note:string){setJourney(old=>({...old,notes:{...(old.notes||{}),[id]:note}}))}
  function updateReaction(id:string,reaction:string){setJourney(old=>({...old,reactions:{...(old.reactions||{}),[id]:reaction}}))}
  function remove(id:string){setJourney(old=>({...old,[tab]:(old[tab]||[]).filter((x:string)=>x!==id)}))}
  const progress=Math.round(tried.length/Math.max(1,foods.length)*100);
  const next = foods.find(f=>!tried.includes(f.id) && !saved.includes(f.id)) || foods.find(f=>!tried.includes(f.id)) || foods[0];
  return <div className="page fade-in"><div className="eyebrow">Your personal Food Passport</div><h1 className="display">Tried, saved, remembered.</h1><p className="lead">Track dishes you’ve tried and save ones to explore next. Notes and reactions stay on this device.</p>
   <div className="preference-box" style={{marginTop:28}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'end',flexWrap:'wrap'}}><div><div className="eyebrow">Discovery so far</div><h3 style={{marginBottom:0}}>{tried.length} of {foods.length} tried</h3></div><span className="pill">{progress}%</span></div><div className="progress-wrap" role="progressbar" aria-valuenow={tried.length} aria-valuemin={0} aria-valuemax={foods.length} aria-label="Foods tried"><div className="progress-fill" style={{width:`${progress}%`}}/></div><small style={{color:'#718075'}}>A gentle record, not a goal.</small></div>
   {next && <div className="banner" style={{marginTop:18}}><div><div className="eyebrow">Next food suggestion</div><h2>Try something new: {next.name}</h2><p>{next.intro} {next.spice<=1?'Gentle starter.':''}</p></div><Link className="btn" href={`/food/${next.id}`}>See guide <ChevronRight size={16}/></Link></div>}
   <div className="tabs" role="tablist" aria-label="Passport lists"><button className={`tab ${tab==='saved'?'active':''}`} onClick={()=>setTab('saved')} role="tab" aria-selected={tab==='saved'} data-testid="tab-saved">Saved ({saved.length})</button><button className={`tab ${tab==='tried'?'active':''}`} onClick={()=>setTab('tried')} role="tab" aria-selected={tab==='tried'} data-testid="tab-tried">Tried ({tried.length})</button></div>
   {!items.length?<div className="empty"><div className="empty-icon">{tab==='saved'?<Bookmark size={20}/>:<Check size={20}/>}</div><h3>{tab==='saved'?'Nothing saved yet':'Your first bite awaits'}</h3><p>{tab==='saved'?'Save a dish guide to build your list.':'Mark dishes as tried when you taste them and add notes/reactions.'}</p><Link className="btn" href="/explore">Explore foods</Link></div>:<div>{items.map(food=><article className="journey-row" key={food.id}><Link href={`/food/${food.id}`}><img src={food.image} alt={food.name}/></Link><div><h3><Link href={`/food/${food.id}`} style={{color:'inherit',textDecoration:'none'}}>{food.name}</Link></h3><p>{tab==='saved'?'Saved for later':'Tried'}</p>{tab==='tried' && <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>{['Loved','Liked','Okay','Meh'].map(r=><button key={r} className={`option ${reactions[food.id]===r?'selected':''}`} onClick={()=>updateReaction(food.id,r)}>{r}</button>)}</div>}<label htmlFor={`note-${food.id}`} className="sr-only">Your note for {food.name}</label><input id={`note-${food.id}`} value={notes[food.id]||''} onChange={e=>updateNote(food.id,e.target.value)} placeholder={tab==='tried'?'Add a note about your experience…':'Add a note…'} style={{marginTop:9,width:'100%',maxWidth:420,padding:'9px 10px',border:'1px solid #d6d2c6',borderRadius:7,background:'#fbfaf5'}} data-testid={`note-${food.id}`}/></div><button className="remove-btn" onClick={()=>remove(food.id)} aria-label={`Remove ${food.name} from ${tab}`} data-testid={`remove-${tab}-${food.id}`}><Trash2 size={17}/></button></article>)}</div>}
   <p style={{fontSize:11,color:'#748076',marginTop:22}}>Saved foods, notes and reactions stay in this browser’s local storage. Clearing browser data removes them.</p>
   </div>
}

function PreferencesPage(){
 const [prefs,setPrefs]=useStored<Preferences>('localbite-preferences',defaultPrefs); const [saved,setSaved]=useState(false);
 function setDiet(value:string){setPrefs(p=>({...p,diet:p.diet.includes(value)?p.diet.filter(x=>x!==value):[...p.diet,value]}));setSaved(false)}
 function setTaste(value:string){setPrefs(p=>({...p,tastes:p.tastes.includes(value)?p.tastes.filter(x=>x!==value):[...p.tastes,value]}));setSaved(false)}
  const dietOptions=['Vegetarian','Vegan','No preference']; const tasteOptions=['Mild & gentle','Crisp textures','Coconut-rich','New to me'];
 return <div className="page fade-in"><div className="eyebrow">Make the guide feel more like yours</div><h1 className="display">A few things you like.</h1><p className="lead">These preferences stay on this device. They’re here to make browsing easier—not to determine what is safe for you to eat.</p>
   <div className="preference-grid" style={{marginTop:30}}><section className="preference-box"><h3>Spice comfort</h3><p style={{fontSize:12,color:'#6e7c72'}}>Your usual comfort level; you can still explore anything.</p><div className="preference-options">{['Very mild','Gentle','Some warmth','Bring the heat','No preference'].map((x,i)=><button className={`option ${(i===4?prefs.spice<0:prefs.spice===i)?'selected':''}`} key={x} onClick={()=>{setPrefs(p=>({...p,spice:i===4?-1:i}));setSaved(false)}} data-testid={`preference-spice-${i}`}>{x}</button>)}</div></section>
   <section className="preference-box"><h3>Budget guide</h3><p style={{fontSize:12,color:'#6e7c72'}}>Maximum indicative price you’d like to see in suggestions.</p><div className="range-row"><span>₹100</span><input type="range" min="100" max="700" step="25" value={prefs.budget} onChange={e=>{setPrefs(p=>({...p,budget:Number(e.target.value)}));setSaved(false)}} aria-label="Preferred maximum budget" data-testid="preference-budget"/><span>₹700</span></div><p className="pill">Up to ₹{prefs.budget} · prices are unverified</p></section>
    <section className="preference-box"><h3>Dietary direction</h3><p style={{fontSize:12,color:'#6e7c72'}}>Use this as a browse preference, never as an ingredient guarantee.</p><div className="preference-options">{dietOptions.map(x=><button key={x} onClick={()=>{if(x==='No preference'){setPrefs(p=>({...p,diet:[]}));setSaved(false)}else setDiet(x)}} className={`option ${(x==='No preference'?!prefs.diet.length:prefs.diet.includes(x))?'selected':''}`} data-testid={`preference-diet-${x.toLowerCase().replaceAll(' ','-')}`}>{x}</button>)}</div></section>
   <section className="preference-box"><h3>What you’re curious about</h3><p style={{fontSize:12,color:'#6e7c72'}}>Pick any that sound like you.</p><div className="preference-options">{tasteOptions.map(x=><button key={x} onClick={()=>setTaste(x)} className={`option ${prefs.tastes.includes(x)?'selected':''}`} data-testid={`preference-taste-${x.toLowerCase().replaceAll(' ','-')}`}>{x}</button>)}</div></section>
  </div><div style={{display:'flex',gap:12,alignItems:'center',marginTop:24}}><button className="btn" onClick={()=>{localStorage.setItem('localbite-preferences',JSON.stringify(prefs));setSaved(true)}} data-testid="button-save-preferences"><Check size={16}/>Save preferences</button><button className="btn secondary" onClick={()=>{setPrefs(defaultPrefs);setSaved(false)}} data-testid="button-reset-preferences">Reset</button>{saved&&<span className="inline-success" role="status" style={{margin:0}}>Preferences saved on this device.</span>}</div>
  <div style={{marginTop:27}} className="notice">Important: ingredient lists may be incomplete or unknown. Always ask the venue about allergens, cross-contact, preparation and dietary suitability.</div>
 </div>
}

export default App;
