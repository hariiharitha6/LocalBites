import { useEffect, useMemo, useState, type ReactNode, type FormEvent } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Bookmark, Check, ChevronRight, Compass, MapPin, Search, SlidersHorizontal, X, ArrowUpRight, CircleAlert, NotebookPen, LocateFixed, GitCompareArrows, Trash2, Info, RotateCcw } from 'lucide-react';
import { foods, type Food } from './food-content';
import NotFound from '@/pages/not-found';

type JourneyState = { saved: string[]; tried: string[]; notes: Record<string,string>; };
type Preferences = { spice: number; budget: number; diet: string[]; tastes: string[]; };
const blankJourney: JourneyState = {saved:[],tried:[],notes:{}};
const defaultPrefs: Preferences = {spice:2,budget:350,diet:[],tastes:[]};

function useStored<T>(key:string, fallback:T):[T,(v:T|((old:T)=>T))=>void] {
  const [value,setValue]=useState<T>(()=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}},[key,value]);
  return [value,setValue];
}
function AppShell({children}:{children:ReactNode}) {
  const [path]=useLocation(); const [journey]=useStored<JourneyState>('localbite-journey',blankJourney);
  const nav=[['/explore','Explore'],['/nearby','Nearby'],['/compare','Compare'],['/journey','My journey']];
  useEffect(()=>{const food=path.startsWith('/food/')?foods.find(item=>item.id===path.slice('/food/'.length)):undefined;const labels:Record<string,string>={'/':'Discover','/explore':'Explore Kerala food','/nearby':'Nearby food guide','/compare':'Compare foods','/journey':'My food journey','/preferences':'Preferences'};document.title=`${food?.name??labels[path]??'Not found'} · LocalBite`;},[path]);
  return <div className="app"><header className="topbar shell">
    <Link href="/" className="brand" data-testid="link-home"><span className="brandmark">L</span><span>localbite</span></Link>
    <nav className="navlinks" aria-label="Primary navigation">{nav.map(([url,label])=><Link key={url} href={url} className={path===url?'active':''} data-testid={`link-${label.toLowerCase().replaceAll(' ','-')}`}>{label}</Link>)}</nav>
    <div className="navright"><Link className="icon-link" href="/journey" aria-label="Saved and tried foods" data-testid="link-saved"><Bookmark size={17}/><span>My bites</span><span className="nav-count">{journey.saved.length+journey.tried.length}</span></Link><Link className="icon-link" href="/preferences" aria-label="Preferences" data-testid="link-preferences"><SlidersHorizontal size={17}/></Link></div>
  </header><main className="shell">{children}</main>
  <nav className="mobile-nav" aria-label="Mobile navigation">{[['/','Home',Compass],['/explore','Explore',Search],['/nearby','Nearby',MapPin],['/compare','Compare',GitCompareArrows],['/journey','Journey',Bookmark]].map(([url,label,Icon]:any)=><Link key={url} href={url} className={path===url?'active':''} data-testid={`mobile-${String(label).toLowerCase()}`}><Icon size={18}/>{label}</Link>)}</nav>
  <footer className="footer shell"><span>LocalBite · A field guide for your first Kerala food stories.</span><span>Seed facts and prices are unverified demo guidance.</span></footer></div>
}
function App() {return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><AppShell><Switch>
  <Route path="/" component={Home}/><Route path="/explore" component={Explore}/><Route path="/food/:id" component={FoodDetail}/>
  <Route path="/compare" component={Compare}/><Route path="/nearby" component={Nearby}/><Route path="/journey" component={Journey}/><Route path="/preferences" component={PreferencesPage}/><Route component={NotFound}/>
</Switch></AppShell></WouterRouter>}

function FoodCard({food}:{food:Food}) {return <article className="food-card fade-in" data-testid={`card-food-${food.id}`}>
  <Link href={`/food/${food.id}`} aria-label={`Explore ${food.name}`} data-testid={`link-food-${food.id}`}><img className="food-image" src={food.image} alt={`${food.name} — illustrative legacy seed image`} loading="lazy"/></Link>
  <div className="food-card-body"><div className="eyebrow">{food.category} · Seed guide</div><h3><Link href={`/food/${food.id}`} style={{color:'inherit',textDecoration:'none'}}>{food.name}</Link></h3><p>{food.intro}</p><div className="food-card-foot"><span className="pill">Spice {food.spice}/4</span><span>Indicative ₹{food.price[0]}–{food.price[1]}</span></div></div>
</article>}
function Disclosure(){return <div className="seed-note" role="note"><Info size={15} style={{flexShrink:0}}/><span>Seed guide only: dish details and indicative prices are unverified. Source type: legacy project seed · confidence: low. Ask the venue to confirm current details.</span></div>}
function Home(){
 const featured=[foods[0],foods[1],foods[2]];
  const [prefs]=useStored<Preferences>('localbite-preferences',defaultPrefs);
  const [journey]=useStored<JourneyState>('localbite-journey',blankJourney);
  const suggested=foods.filter(f=>
    f.price[1]<=prefs.budget &&
    (prefs.spice<0||f.spice<=prefs.spice) &&
    (!prefs.diet.includes('Vegetarian')||f.diet.some(x=>x.toLowerCase().includes('vegetarian'))) &&
    (!prefs.diet.includes('Vegan')||f.diet.some(x=>x.toLowerCase().includes('vegan'))) &&
    (!prefs.tastes.includes('Mild & gentle')||f.spice<=1) &&
    (!prefs.tastes.includes('Crisp textures')||/crisp|crispy/i.test(f.texture)) &&
    (!prefs.tastes.includes('Coconut-rich')||/coconut/i.test(`${f.taste} ${f.ingredients?.join(' ')??''}`)) &&
    (!prefs.tastes.includes('New to me')||!journey.tried.includes(f.id))
  ).slice(0,3);
 return <div className="fade-in"><section className="hero">
   <div className="hero-copy"><div className="eyebrow">A little more confident at the table</div><h1 className="display">Find your way<br/>to a good bite.</h1><p className="lead">A thoughtful guide to Kerala’s food, for the first time you’re here. Learn what a dish might taste like, what it may cost, and what to ask before you order.</p><div className="hero-actions"><Link className="btn" href="/explore" data-testid="button-explore"><Search size={16}/>Explore the food</Link><Link className="btn secondary" href="/journey" data-testid="button-journey"><NotebookPen size={16}/>My food journey</Link></div></div>
   <div className="hero-art"><div className="hero-photo" role="img" aria-label="Puttu and chickpea curry on a banana leaf" style={{backgroundImage:`linear-gradient(0deg,#172d2340,#172d2300 52%),url(${foods[0].image})`}}/><div className="hero-tag"><b>Start with puttu</b><span>Steamed rice and coconut, made for a scoop of curry.</span></div><div className="hero-stamp">Kerala<br/>one bite<br/>at a time</div></div>
 </section>
 <Disclosure/>
  <section className="section"><div className="section-head"><div><div className="eyebrow">A gentle match for your preferences</div><h2>A starting point for you</h2></div><Link href="/preferences" className="text-link">Tune your guide <ArrowUpRight size={14}/></Link></div><p>Picked using your saved taste, budget and browse preferences. These are not dietary or allergy assurances; the underlying seed details are unverified.</p>{suggested.length?<div className="food-grid">{suggested.map(f=><FoodCard key={f.id} food={f}/>)}</div>:<div className="empty"><h3>No close matches in this seed guide</h3><p>Try widening your budget or preference range, or browse every dish.</p><Link className="btn secondary" href="/explore">Explore all foods</Link></div>}</section>
 <section className="section"><div className="section-head"><div><div className="eyebrow">A good place to begin</div><h2>First-timer favourites</h2></div><Link href="/explore" className="text-link">Browse all dishes <ArrowUpRight size={14}/></Link></div><div className="food-grid">{featured.map(f=><FoodCard key={f.id} food={f}/>)}</div></section>
 <section className="banner"><div><div className="eyebrow">No wrong way to start</div><h2>Not sure what you like yet?</h2><p>Choose a mood, a spice comfort level or a budget. We’ll help narrow the menu without pretending there’s one right answer.</p></div><Link className="btn" href="/explore">Find a starting point <ChevronRight size={16}/></Link></section>
 <section className="section"><div className="section-head"><div><div className="eyebrow">Your own little field notes</div><h2>Keep the bites that stay with you.</h2></div></div><p className="lead">Save a dish for later, mark what you’ve tried, and jot down what you thought. Your journey stays on this device.</p><div style={{marginTop:22}}><Link className="btn secondary" href="/journey">Open my journey <ArrowUpRight size={15}/></Link></div></section>
 </div>
}

function Explore(){
 const [filters,setFilters]=useStored('localbite-explore-filters',{query:'',budget:500,spice:4,category:'Any',diet:'Any',experience:'Any',sort:'featured',intent:''});
 const {query,budget,spice,category,diet,experience,sort,intent}=filters;
 const categories=['Any',...Array.from(new Set(foods.map(f=>f.category)))];
   const visible=useMemo(()=>{let list=foods.filter(f=>(`${f.name} ${f.localName} ${f.intro} ${f.story} ${f.taste} ${f.category} ${f.ingredients?.join(' ')??''}`).toLowerCase().includes(query.toLowerCase())&&f.price[1]<=budget&&f.spice<=spice&&(category==='Any'||f.category===category)&&(diet==='Any'||f.diet.some(x=>x.toLowerCase().includes(diet.toLowerCase())))&&(experience==='Any'||f.experience===experience));
  if(intent)list=list.filter(f=>f.intents.includes(intent)); if(sort==='price')list.sort((a,b)=>a.price[0]-b.price[0]); if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));return list},[query,budget,spice,category,diet,experience,sort,intent]);
 return <div className="page fade-in"><div className="eyebrow">Explore the menu, at your pace</div><h1 className="display">What sounds good?</h1><p className="lead">Search dishes or start with a feeling. Every guide here is a starting point, not a promise about a specific kitchen.</p>
   <div className="searchbox" style={{marginTop:24}}><Search size={18}/><input value={query} onChange={e=>setFilters({...filters,query:e.target.value})} placeholder="Try “soft”, “rice” or a dish name" aria-label="Search foods" data-testid="input-search-food"/></div>
    <div style={{marginTop:24}}><div className="eyebrow">Help me find something...</div><div className="preference-options" style={{marginTop:10}}>{['Eat local','Under ₹200','Mild & gentle','Plant-friendly','Must try','Quick & familiar'].map(x=><button className={`option ${intent===x?'selected':''}`} key={x} onClick={()=>setFilters({...filters,intent:intent===x?'':x})} data-testid={`intent-${x.toLowerCase().replaceAll(' ','-').replace('&','and').replace('₹','inr')}`}>{x}</button>)}</div><small>These are editorial seed-guide shortcuts, not verified labels for every kitchen.</small></div>
   <div className="filters-layout"><aside className="filters" aria-label="Food filters">
     <div className="filter-group"><h3>Category</h3><select value={category} onChange={e=>setFilters({...filters,category:e.target.value})} aria-label="Filter category" data-testid="filter-category">{categories.map(x=><option key={x}>{x}</option>)}</select></div>
     <div className="filter-group"><h3>Budget · up to ₹{budget}</h3><div className="range-row"><span>₹70</span><input type="range" min="100" max="700" step="25" value={budget} onChange={e=>setFilters({...filters,budget:Number(e.target.value)})} aria-label="Maximum indicative budget" data-testid="filter-budget"/><span>₹700</span></div></div>
     <div className="filter-group"><h3>Spice comfort · up to {spice}</h3><div className="range-row"><span>Mild</span><input type="range" min="0" max="4" value={spice} onChange={e=>setFilters({...filters,spice:Number(e.target.value)})} aria-label="Maximum spice level" data-testid="filter-spice"/><span>Hot</span></div></div>
     <div className="filter-group"><h3>Dietary starting point</h3><select value={diet} onChange={e=>setFilters({...filters,diet:e.target.value})} aria-label="Diet filter" data-testid="filter-diet">{['Any','Vegetarian','Vegan'].map(x=><option key={x}>{x}</option>)}</select><small>Never rely on these tags for allergy or safety decisions.</small></div>
     <div className="filter-group"><h3>Experience</h3><select value={experience} onChange={e=>setFilters({...filters,experience:e.target.value})} aria-label="Filter by experience" data-testid="filter-experience"><option>Any</option>{Array.from(new Set(foods.map(f=>f.experience))).map(x=><option key={x}>{x}</option>)}</select></div>
     <button className="btn secondary small" onClick={()=>setFilters({query:'',budget:500,spice:4,category:'Any',diet:'Any',experience:'Any',sort:'featured',intent:''})} data-testid="button-clear-filters"><RotateCcw size={14}/>Reset filters</button>
   </aside><section><div className="results-head"><strong>{visible.length} {visible.length===1?'dish':'dishes'} to explore</strong><select className="sort-select" value={sort} onChange={e=>setFilters({...filters,sort:e.target.value})} aria-label="Sort foods" data-testid="sort-foods"><option value="featured">Featured</option><option value="price">Price: lower first</option><option value="name">Name: A–Z</option></select></div>
     {visible.length?<div className="food-grid">{visible.map(f=><FoodCard key={f.id} food={f}/>)}</div>:<div className="empty"><div className="empty-icon"><Search size={21}/></div><h3>No dishes match those choices</h3><p>Try a broader budget, spice range or category. Some dishes may be listed with unknown or variable details.</p><button className="btn secondary" onClick={()=>setFilters({query:'',budget:500,spice:4,category:'Any',diet:'Any',experience:'Any',sort:'featured',intent:''})}>Show all dishes</button></div>}
   </section></div><div style={{marginTop:24}}><Disclosure/></div>
 </div>
}

function FoodDetail({params}:{params:{id:string}}){
 const food=foods.find(f=>f.id===params.id); const [journey,setJourney]=useStored<JourneyState>('localbite-journey',blankJourney); const [compares,setCompares]=useStored<string[]>('localbite-compare',[]); const [reportOpen,setReportOpen]=useState(false); const [report,setReport]=useState({type:'Price seems off',detail:''}); const [message,setMessage]=useState('');
 if(!food)return <NotFound/>;
  const foodId=food.id;
  const saved=journey.saved.includes(foodId),tried=journey.tried.includes(foodId);
  function toggle(key:'saved'|'tried'){setJourney(prev=>({...prev,[key]:prev[key].includes(foodId)?prev[key].filter(x=>x!==foodId):[...prev[key],foodId]}));setMessage(key==='saved'?(saved?'Removed from saved bites':'Saved for later'):(tried?'Removed from tried list':'Added to tried list'))}
  function addCompare(){setCompares(prev=>prev.includes(foodId)?prev:prev.length>=3?prev:[...prev,foodId]);setMessage(compares.includes(foodId)?'Already in your comparison':compares.length>=3?'Compare up to three foods.':'Added to compare')}
  function submitReport(e:FormEvent){e.preventDefault();if(report.detail.trim().length<12){setMessage('Please add a little more detail (at least 12 characters).');return}try{const reports=JSON.parse(localStorage.getItem('localbite-reports')||'[]');reports.push({foodId,...report,createdAt:new Date().toISOString(),status:'local draft'});localStorage.setItem('localbite-reports',JSON.stringify(reports));setMessage('Report saved as a local draft. No moderation backend is connected.');setReportOpen(false);setReport({...report,detail:''})}catch{setMessage('Could not save this draft on this device. Check local storage settings.')}}
 return <div className="page fade-in"><div className="eyebrow"><Link href="/explore" className="text-link">Explore</Link> / {food.category}</div>
   <div className="detail-hero"><img src={food.image} alt={`${food.name} — unverified legacy seed image`}/><div><div className="pill">{food.category}</div><h1 className="detail-title">{food.name}</h1><p className="lead">{food.intro}</p><div className="action-row"><button className={`btn ${saved?'terracotta':'secondary'}`} onClick={()=>toggle('saved')} data-testid="button-save-food"><Bookmark size={16}/>{saved?'Saved':'Save for later'}</button><button className={`btn ${tried?'terracotta':'secondary'}`} onClick={()=>toggle('tried')} data-testid="button-tried-food"><Check size={16}/>{tried?'Tried':'Mark tried'}</button><button className="btn secondary" onClick={addCompare} data-testid="button-compare-food"><GitCompareArrows size={16}/>Compare</button></div><Disclosure/></div></div>
   <div className="detail-content"><div>
     <section className="detail-section"><h2>A little context</h2><p>{food.story}</p></section>
     <section className="detail-section"><h2>What it may be like</h2><p><b>Taste:</b> {food.taste}</p><p><b>Texture:</b> {food.texture}</p><p><b>Spice guide:</b> {food.spice===0?'No chilli expected':`${food.spice} out of 4 — a broad seed estimate, not a venue-specific promise`}</p></section>
     <section className="detail-section"><h2>Ingredients & suitability</h2>{food.ingredients?<p><b>Commonly described with:</b> {food.ingredients.join(', ')}. This is not a complete ingredient list.</p>:<p>Ingredients are unknown for this guide.</p>}<p>{food.suitability}</p><div className="notice">Allergen information is unknown. Do not use this guide for allergy, intolerance, religious or medical safety decisions. Ask the venue directly about ingredients, cross-contact and preparation.</div></section>
     <section className="detail-section"><h2>A first-timer tip</h2><p>{food.tip}</p></section>
      <section className="detail-section"><h2>Where to try it</h2><p>No verified venue listings are available for this guide yet. Use Nearby to set an area or browse by permission if you choose; the app will not invent restaurants, distances or opening hours.</p><Link className="text-link" href="/nearby">Open Nearby <ArrowUpRight size={13}/></Link><p className="notice">Local/tourist-oriented context has not been verified for this dish or any specific venue.</p></section>
     <section className="detail-section"><h2>Related foods</h2><div className="preference-options">{food.related.map(id=>{const rel=foods.find(x=>x.id===id);return rel?<Link className="option" href={`/food/${id}`} key={id}>{rel.name} <ArrowUpRight size={12}/></Link>:null})}</div></section>
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
 return <div className="page fade-in"><div className="eyebrow">A side-by-side field note</div><h1 className="display">Compare a few bites.</h1><p className="lead">Look at taste, spice and indicative price context together. These are broad seed descriptions, not promises about a particular place.</p>
   <Disclosure/><div className="preference-options" style={{margin:'22px 0'}}>{foods.map(f=><button key={f.id} className={`option ${selected.includes(f.id)?'selected':''}`} onClick={()=>toggle(f.id)} data-testid={`compare-toggle-${f.id}`}>{selected.includes(f.id)?'✓ ':''}{f.name}</button>)}</div>
   {items.length<2?<div className="empty"><div className="empty-icon"><GitCompareArrows size={20}/></div><h3>Choose two or three foods</h3><p>Select dishes above, or add one from its guide. You can compare up to three at a time.</p><Link className="btn" href="/explore">Find dishes</Link></div>:<div className="compare-grid">{items.map(f=><article className="compare-col" key={f.id}><img src={f.image} alt={`${f.name} unverified seed image`}/><div><div className="eyebrow">{f.category}</div><h2 style={{fontSize:25}}>{f.name}</h2><p style={{fontSize:12,lineHeight:1.55,color:'#69786e'}}>{f.intro}</p>{[['Taste',f.taste],['Spice estimate',`${f.spice}/4 · low confidence`],['Texture',f.texture],['Diet context',f.suitability],['Indicative price',`₹${f.price[0]}–₹${f.price[1]} ${f.priceUnit} · unverified`]].map(([label,value])=><div className="compare-row" key={label}><small>{label}</small>{value}</div>)}<Link className="text-link" href={`/food/${f.id}`}>Read the guide <ArrowUpRight size={13}/></Link><button className="remove-btn" onClick={()=>toggle(f.id)} aria-label={`Remove ${f.name} from comparison`} data-testid={`remove-compare-${f.id}`}><X size={17}/> Remove</button></div></article>)}</div>}
   <p style={{fontSize:11,color:'#748076',marginTop:20}}>Source type: legacy project seed · Confidence: low. For allergies or dietary safety, ask the venue directly.</p>
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
 const ids=tab==='saved'?journey.saved:journey.tried; const items=ids.map(id=>foods.find(f=>f.id===id)).filter((x):x is Food=>!!x);
 function updateNote(id:string,note:string){setJourney(old=>({...old,notes:{...old.notes,[id]:note}}))}
 function remove(id:string){setJourney(old=>({...old,[tab]:old[tab].filter(x=>x!==id)}))}
 const progress=Math.round(journey.tried.length/foods.length*100);
 return <div className="page fade-in"><div className="eyebrow">Your personal food field notes</div><h1 className="display">A journey, one bite at a time.</h1><p className="lead">Saved dishes and things you’ve tried live on this device. No account, no sharing, no judgement.</p>
  <div className="preference-box" style={{marginTop:28}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'end'}}><div><div className="eyebrow">Your discovery so far</div><h3 style={{marginBottom:0}}>{journey.tried.length} of {foods.length} guides tried</h3></div><span className="pill">{progress}%</span></div><div className="progress-wrap" role="progressbar" aria-valuenow={journey.tried.length} aria-valuemin={0} aria-valuemax={foods.length} aria-label="Foods tried"><div className="progress-fill" style={{width:`${progress}%`}}/></div><small style={{color:'#718075'}}>Progress is just a gentle record, not a goal.</small></div>
  <div className="tabs" role="tablist" aria-label="Journey lists"><button className={`tab ${tab==='saved'?'active':''}`} onClick={()=>setTab('saved')} role="tab" aria-selected={tab==='saved'} data-testid="tab-saved">Saved for later ({journey.saved.length})</button><button className={`tab ${tab==='tried'?'active':''}`} onClick={()=>setTab('tried')} role="tab" aria-selected={tab==='tried'} data-testid="tab-tried">Tried ({journey.tried.length})</button></div>
  {!items.length?<div className="empty"><div className="empty-icon">{tab==='saved'?<Bookmark size={20}/>:<Check size={20}/>}</div><h3>{tab==='saved'?'Nothing saved just yet':'Your first bite is still ahead'}</h3><p>{tab==='saved'?'Save a dish guide to keep it close for later.':'Mark a dish as tried when you’ve tasted it, then add a note about your own experience.'}</p><Link className="btn" href="/explore">Explore foods</Link></div>:<div>{items.map(food=><article className="journey-row" key={food.id}><Link href={`/food/${food.id}`}><img src={food.image} alt={food.name}/></Link><div><h3><Link href={`/food/${food.id}`} style={{color:'inherit',textDecoration:'none'}}>{food.name}</Link></h3><p>{tab==='saved'?'Saved for a future bite.':'Tried · Add a note about your experience.'}</p><label htmlFor={`note-${food.id}`} className="sr-only">Your note for {food.name}</label><input id={`note-${food.id}`} value={journey.notes[food.id]||''} onChange={e=>updateNote(food.id,e.target.value)} placeholder="A note to remember…" style={{marginTop:9,width:'100%',maxWidth:420,padding:'9px 10px',border:'1px solid #d6d2c6',borderRadius:7,background:'#fbfaf5'}} data-testid={`note-${food.id}`}/></div><button className="remove-btn" onClick={()=>remove(food.id)} aria-label={`Remove ${food.name} from ${tab}`} data-testid={`remove-${tab}-${food.id}`}><Trash2 size={17}/></button></article>)}</div>}
  <p style={{fontSize:11,color:'#748076',marginTop:22}}>Your saved foods and notes stay in this browser’s local storage. Clearing browser data removes them.</p>
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
