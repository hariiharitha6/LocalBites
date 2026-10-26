import { Link } from 'wouter';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page fade-in">
      <div className="empty" style={{maxWidth:520,margin:'60px auto'}}>
        <div className="empty-icon"><AlertCircle size={22} /></div>
        <h1 style={{font:'600 32px Fraunces',margin:'0 0 10px'}}>Page not found</h1>
        <p>This page doesn’t exist or the link may be broken. Let’s get you back to discovering Kerala food.</p>
        <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
          <Link className="btn" href="/"><ArrowLeft size={16}/> Back to Discover</Link>
          <Link className="btn secondary" href="/explore">Explore dishes</Link>
        </div>
      </div>
    </div>
  );
}
