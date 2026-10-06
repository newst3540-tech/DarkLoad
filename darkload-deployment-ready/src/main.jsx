import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownToLine, Check, ChevronDown, FileVideo2, Link2, LoaderCircle,
  Menu, Moon, Play, ShieldCheck, Sparkles, X, Zap
} from "lucide-react";
import { analyzeMedia, createDownload, getJob } from "./api";
import "./styles.css";

const fallbackThumb = "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=80";

function App() {
  const [url,setUrl]=useState("");
  const [quality,setQuality]=useState("1080p");
  const [status,setStatus]=useState("idle");
  const [error,setError]=useState("");
  const [media,setMedia]=useState(null);
  const [job,setJob]=useState(null);
  const [mobileOpen,setMobileOpen]=useState(false);

  const analyze=async()=>{
    if(!url.trim()) return;
    setError(""); setStatus("analyzing"); setMedia(null); setJob(null);
    try{
      const data=await analyzeMedia(url.trim());
      setMedia(data); setStatus("ready");
    }catch(e){setError(e.message);setStatus("error");}
  };

  const startDownload=async()=>{
    if(!media) return;
    setError(""); setStatus("downloading");
    try{
      const data=await createDownload(url.trim(),quality);
      setJob(data);
    }catch(e){setError(e.message);setStatus("error");}
  };

  useEffect(()=>{
    if(!job?.jobId || job.status==="complete" || job.status==="failed") return;
    const timer=setInterval(async()=>{
      try{
        const next=await getJob(job.jobId);
        setJob(next);
        if(next.status==="complete"){
          setStatus("complete");
          if(next.downloadUrl) window.location.href=next.downloadUrl;
        }else if(next.status==="failed"){
          setStatus("error"); setError(next.error || "Processing failed.");
        }
      }catch(e){setStatus("error");setError(e.message);}
    },1500);
    return()=>clearInterval(timer);
  },[job?.jobId,job?.status]);

  const reset=()=>{setUrl("");setMedia(null);setJob(null);setError("");setStatus("idle");};

  return <div className="app">
    <div className="noise"/><div className="orb orb-a"/><div className="orb orb-b"/><div className="grid"/>
    <header className="nav shell">
      <a className="brand" href="#"><span className="brand-mark"><Zap size={18} fill="currentColor"/></span>DARK<span>LOAD</span></a>
      <nav className={mobileOpen?"nav-links open":"nav-links"}>
        <a href="#home" onClick={()=>setMobileOpen(false)}>Home</a>
        <a href="#how" onClick={()=>setMobileOpen(false)}>How it works</a>
        <a href="#faq" onClick={()=>setMobileOpen(false)}>FAQ</a>
      </nav>
      <button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?<X size={20}/>:<Menu size={20}/>}</button>
      <div className="nav-status"><span className="pulse"/> API ready</div>
    </header>

    <main>
      <section id="home" className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> FAST • CLEAN • DARK</div>
          <h1>Turn a media URL into a <em>simple</em> download workflow.</h1>
          <p className="hero-text">A futuristic interface for processing media you own or have permission to download.</p>
          <div className="converter glass">
            <div className="url-row">
              <Link2 size={19}/>
              <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} placeholder="Paste a supported media URL…" aria-label="Media URL"/>
              {url&&<button className="clear" onClick={reset}><X size={16}/></button>}
              <button className="primary" onClick={analyze} disabled={!url.trim()||status==="analyzing"}>
                {status==="analyzing"?<><LoaderCircle className="spin" size={17}/>Analyzing</>:<>Analyze <ArrowDownToLine size={17}/></>}
              </button>
            </div>
            <div className="converter-note"><ShieldCheck size={14}/> Use only content you are authorized to download.</div>
          </div>
          {error&&<div className="error-box">{error}</div>}
        </div>

        <div className="hero-visual"><div className="scene">
          <div className="ring ring-1"/><div className="ring ring-2"/>
          <div className="cube"><div className="cube-face face-front"><Play size={40} fill="currentColor"/></div><div className="cube-face face-back"/><div className="cube-face face-right"/><div className="cube-face face-left"/><div className="cube-face face-top"/><div className="cube-face face-bottom"/></div>
          <div className="float-card card-top"><FileVideo2 size={18}/><span>MEDIA READY</span></div>
          <div className="float-card card-bottom"><span className="mini-dot"/> API CONNECTED</div>
        </div></div>
      </section>

      <section className="preview-section shell">
        <div className="section-heading"><div><span className="kicker">WORKSPACE</span><h2>Conversion console</h2></div><span className="step-pill">02 / 03</span></div>
        <div className="console glass">
          <div className="preview">
            <div className="thumb" style={{backgroundImage:`url(${media?.thumbnail||fallbackThumb})`}}>
              <div className="thumb-overlay">
                {status==="idle"&&<span>Waiting for URL</span>}
                {status==="analyzing"&&<><LoaderCircle className="spin" size={22}/> Reading media…</>}
                {status==="ready"&&<><Play size={22} fill="currentColor"/> Preview ready</>}
                {status==="downloading"&&<><LoaderCircle className="spin" size={22}/> Processing…</>}
                {status==="complete"&&<><Check size={22}/> Complete</>}
              </div>
            </div>
            <div className="preview-info">
              <span className="source-label">{media?"SOURCE DETECTED":"NO SOURCE"}</span>
              <h3>{media?.title||"Your media preview will appear here"}</h3>
              <p>{media?`${media.source||"Authorized source"}${media.duration?` • ${media.duration}`:""}`:"Paste a URL above to populate this panel."}</p>
            </div>
          </div>
          <div className="controls">
            <label>QUALITY</label>
            <div className="quality-grid">
              {(media?.formats||["720p","1080p","Audio"]).map(q=><button key={q} className={quality===q?"quality active":"quality"} onClick={()=>setQuality(q)}>{q}<span>{q==="Audio"?"MP3":"MP4"}</span></button>)}
            </div>
            <button className="download" onClick={startDownload} disabled={!media||status==="downloading"||status==="complete"}>
              {status==="downloading"?<><LoaderCircle className="spin" size={18}/> Processing…</>:status==="complete"?<><Check size={18}/> Complete</>:<><ArrowDownToLine size={18}/> Download {quality}</>}
            </button>
            {status==="downloading"&&<><div className="progress"><span/></div><div className="job-line">Job {job?.jobId?.slice(0,8)||"queued"} • {job?.progress||0}%</div></>}
            {status==="complete"&&<div className="success"><Check size={15}/> Job complete.</div>}
          </div>
        </div>
      </section>

      <section id="how" className="how shell">
        <div className="section-heading centered"><span className="kicker">SIMPLE FLOW</span><h2>Three steps. Zero clutter.</h2></div>
        <div className="steps">
          {[["01","Paste","Drop a supported URL into the glowing input."],["02","Analyze","The API validates the source and returns metadata."],["03","Download","A background job processes the authorized request."]].map(([n,t,d])=><article className="step glass" key={n}><span className="step-no">{n}</span><div className="step-icon"><ArrowDownToLine size={20}/></div><h3>{t}</h3><p>{d}</p></article>)}
        </div>
      </section>

      <section id="faq" className="faq shell">
        <div className="section-heading centered"><span className="kicker">FAQ</span><h2>Before you ship it</h2></div>
        <div className="faq-list">
          <details><summary>Can GitHub Pages run the API?<ChevronDown/></summary><p>No. Keep the React frontend on GitHub Pages and deploy the Express API separately over HTTPS.</p></details>
          <details><summary>Where do provider credentials go?<ChevronDown/></summary><p>Only on the backend server. Never expose private provider keys in frontend JavaScript.</p></details>
          <details><summary>How should long jobs work?<ChevronDown/></summary><p>Create a job, poll its status, and return a short-lived signed download URL when complete.</p></details>
        </div>
      </section>
    </main>

    <footer className="footer shell"><div className="brand"><span className="brand-mark"><Moon size={16}/></span>DARK<span>LOAD</span></div><span>Authorized-media workflow.</span><span>© 2026</span></footer>
  </div>;
}
createRoot(document.getElementById("root")).render(<App/>);
