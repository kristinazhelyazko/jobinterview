"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import type { DictionaryItem, Question, QuestionType, Role, Stage } from "@/lib/questions/types";

const TYPE_CONFIG = {
  about: { label: "About you", bg: "#EBF0FF", text: "#0040CC" },
  soft:  { label: "STAR",      bg: "#E6F4EE", text: "#0A8754" },
  hard:  { label: "Technical", bg: "#EDE9FE", text: "#5B21B6" },
};
const DEFAULT_STAGES: Stage[] = ["Phone Screen", "HR", "Technical", "HM Interview", "Final Round"];
const DEFAULT_ROLES: { id: Role; label: string }[] = [
  { id: "all", label: "All roles" },
  { id: "qa",  label: "QA Engineer" },
  { id: "pm",  label: "Project Manager" },
  { id: "bsa", label: "BSA" },
];

function uid() { return "q" + Date.now() + Math.random().toString(36).slice(2, 6); }

function PlanView({ plan }: { plan: Question["plan"] }) {
  return (
    <div>
      {plan.map((p, i) => {
        if (!p.n && p.t) return <div key={i} style={{ fontSize: 12, color: "#767676", padding: "2px 0 2px 32px", fontStyle: "italic", lineHeight: 1.4 }}>→ {p.t}</div>;
        return (
          <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom: i < plan.length-1 ? "1px solid #F4F4F4" : "none", alignItems:"flex-start" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#0B5CFF", minWidth:22, flexShrink:0, marginTop:3 }}>{p.n}</span>
            <span style={{ fontSize:13.5, color:"#1F1F1F", lineHeight:1.55 }}>{p.t}</span>
          </div>
        );
      })}
    </div>
  );
}

function EditModal({ question, isNew, stages, onSave, onDelete, onClose }: {
  question: Question; isNew: boolean;
  stages: Stage[];
  onSave:(q:Question)=>void; onDelete:(id:string)=>void; onClose:()=>void;
}) {
  const [text, setText] = useState(question.q);
  const [role, setRole] = useState<Role>(question.role);
  const [type, setType] = useState<QuestionType>(question.type);
  const [stage, setStage] = useState<Stage>(question.stage);
  const [plan, setPlan] = useState(question.plan.length ? [...question.plan] : [{n:"1",t:""}]);

  const inputStyle = { width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #E0E0E0", fontSize:13, color:"#1F1F1F", outline:"none", background:"#fff", marginBottom:14, fontFamily:"inherit" };
  const selectStyle = { ...inputStyle, cursor:"pointer" };
  const labelStyle = { fontSize:12, fontWeight:600 as const, color:"#525252", marginBottom:5, display:"block" as const };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,15,35,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:540, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.18)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #F0F0F0", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:"#1F1F1F", marginBottom:2 }}>{isNew?"Add new question":"Edit question"}</div>
            <div style={{ fontSize:12, color:"#767676" }}>Fill in the details and answer plan steps</div>
          </div>
          <button onClick={onClose} style={{ background:"#F0F2F5", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18, color:"#525252", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
        </div>
        <div style={{ padding:"16px 24px 24px" }}>
          <label style={labelStyle}>Question</label>
          <input style={inputStyle} value={text} onChange={e=>setText(e.target.value)} placeholder="Enter interview question..." />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
            {[
              { label:"Role", val:role, set:(v:string)=>setRole(v as Role), opts:[["all","All roles"],["qa","QA"],["pm","PM"],["bsa","BSA"]] },
              { label:"Type", val:type, set:(v:string)=>setType(v as QuestionType), opts:[["about","About you"],["soft","STAR"],["hard","Technical"]] },
              { label:"Stage", val:stage, set:(v:string)=>setStage(v as Stage), opts:stages.map(s=>[s,s]) },
            ].map(f=>(
              <div key={f.label}>
                <label style={labelStyle}>{f.label}</label>
                <select value={f.val} onChange={e=>f.set(e.target.value)} style={{ ...selectStyle, marginBottom:0, fontFamily:"inherit" }}>
                  {(f.opts as [string,string][]).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <label style={labelStyle}>Answer plan steps</label>
          {plan.map((p,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
              <input value={p.n} onChange={e=>setPlan(pl=>pl.map((r,j)=>j===i?{...r,n:e.target.value}:r))}
                placeholder="1" style={{ width:52, padding:"8px 8px", borderRadius:8, border:"1px solid #E0E0E0", fontSize:12, flexShrink:0, fontFamily:"inherit" }} />
              <input value={p.t} onChange={e=>setPlan(pl=>pl.map((r,j)=>j===i?{...r,t:e.target.value}:r))}
                placeholder="Step description..." style={{ flex:1, padding:"8px 10px", borderRadius:8, border:"1px solid #E0E0E0", fontSize:12, fontFamily:"inherit" }} />
              <button onClick={()=>setPlan(pl=>pl.filter((_,j)=>j!==i))}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#B0B0B0", fontSize:18, padding:"6px 4px", flexShrink:0 }}>×</button>
            </div>
          ))}
          <button onClick={()=>setPlan(pl=>[...pl,{n:String(pl.length+1),t:""}])}
            style={{ background:"#F0F2F5", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, color:"#525252", cursor:"pointer", marginTop:2, fontFamily:"inherit" }}>
            + Add step
          </button>
          <div style={{ display:"flex", gap:8, marginTop:20, flexWrap:"wrap" }}>
            <button onClick={()=>{ if(!text.trim()) return; const cl=plan.filter(p=>p.t.trim()); onSave({id:question.id||uid(),q:text.trim(),role,type,stage,plan:cl.length?cl:[{n:"1",t:"Add your answer plan"}]}); }}
              style={{ background:"#0B5CFF", color:"#fff", border:"none", borderRadius:8, padding:"9px 22px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
            <button onClick={onClose} style={{ background:"#F0F2F5", color:"#525252", border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            {!isNew && <button onClick={()=>{ onDelete(question.id); onClose(); }}
              style={{ background:"none", color:"#DC2626", border:"1px solid #FCA5A5", borderRadius:8, padding:"9px 16px", fontSize:13, fontWeight:500, cursor:"pointer", marginLeft:"auto", fontFamily:"inherit" }}>Delete</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ q, onEdit, onClose }: { q:Question; onEdit:()=>void; onClose:()=>void; }) {
  const cfg = TYPE_CONFIG[q.type];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,15,35,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:540, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.18)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #F0F0F0", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
          <div style={{ flex:1 }}>
            <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:100, fontSize:11, fontWeight:600, background:cfg.bg, color:cfg.text, marginBottom:8 }}>{cfg.label} · {q.stage}</span>
            <div style={{ fontSize:17, fontWeight:700, color:"#1F1F1F", lineHeight:1.4, paddingRight:12 }}>{q.q}</div>
          </div>
          <button onClick={onClose} style={{ background:"#F0F2F5", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18, color:"#525252", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
        </div>
        <div style={{ padding:"16px 24px 24px" }}>
          <PlanView plan={q.plan} />
          <div style={{ display:"flex", gap:8, marginTop:16, borderTop:"1px solid #F4F4F4", paddingTop:16 }}>
            <button onClick={onEdit} style={{ background:"#0B5CFF", color:"#fff", border:"none", borderRadius:8, padding:"9px 22px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Edit</button>
            <button onClick={onClose} style={{ background:"#F0F2F5", color:"#525252", border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [qs, setQs] = useState<Question[]>([]);
  const [roles, setRoles] = useState<{ id: Role; label: string }[]>(DEFAULT_ROLES);
  const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES);
  const [role, setRole] = useState<Role>("all");
  const [types, setTypes] = useState<Record<QuestionType, boolean>>({ about:true, soft:true, hard:true });
  const [stage, setStage] = useState("All stages");
  const [search, setSearch] = useState("");
  const [viewQ, setViewQ] = useState<Question|null>(null);
  const [editQ, setEditQ] = useState<Question|null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromDb = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/questions", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load questions from API.");
      const data = (await res.json()) as {
        questions: Question[];
        positions: DictionaryItem[];
        stages: DictionaryItem[];
      };

      setQs(data.questions ?? []);
      if (Array.isArray(data.positions) && data.positions.length) {
        setRoles(
          data.positions.map((item) => ({
            id: item.code as Role,
            label: item.name,
          })),
        );
      }
      if (Array.isArray(data.stages) && data.stages.length) {
        setStages(data.stages.map((item) => item.name as Stage));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromDb();
  }, [loadFromDb]);

  const filtered = useMemo(()=>qs.filter(q=>{
    const roleOk = role==="all"||q.role==="all"||q.role===role;
    const typeOk = types[q.type];
    const stageOk = stage==="All stages"||q.stage===stage;
    const srchOk = !search||q.q.toLowerCase().includes(search.toLowerCase());
    return roleOk&&typeOk&&stageOk&&srchOk;
  }), [qs, role, types, stage, search]);

  const handleSave = async (q: Question) => {
    try {
      setError(null);
      const res = await fetch(isNew ? "/api/questions" : `/api/questions/${q.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q),
      });
      if (!res.ok) throw new Error("Failed to save question.");

      setEditQ(null);
      setIsNew(false);
      setViewQ(null);
      await loadFromDb();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete question.");

      setViewQ(null);
      setEditQ(null);
      await loadFromDb();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  };
  const openNew = () => {
    setIsNew(true);
    setEditQ({ id:"", q:"", role:"all", type:"about", stage: stages[0] ?? "Phone Screen", plan:[{n:"1",t:""}] });
  };
  const openEdit = (q: Question) => { setIsNew(false); setEditQ(q); setViewQ(null); };

  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>{ if(e.key==="Escape"){ setViewQ(null); setEditQ(null); setIsNew(false); }};
    window.addEventListener("keydown",fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[]);

  return (
    <div style={{ minHeight:"100vh", background:"#F0F2F5", fontFamily:"var(--font)" }}>
      {/* Header */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E0E0E0", padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#0B5CFF", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14 }}>IP</div>
          <span style={{ fontSize:16, fontWeight:600, color:"#1F1F1F" }}>Interview Prep</span>
          <span style={{ fontSize:12, color:"#767676", marginLeft:2 }}>· Kristina Strebkova</span>
        </div>
        <button onClick={openNew} style={{ background:"#0B5CFF", color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
          <span style={{ fontSize:18, lineHeight:1 }}>+</span> New question
        </button>
      </header>

      <main style={{ maxWidth:1100, margin:"0 auto", padding:"24px 24px 60px" }}>
        {/* Filter bar */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E0E0E0", padding:"16px 20px", marginBottom:16, display:"flex", flexWrap:"wrap", gap:12, alignItems:"center" }}>
          {roles.map(r=>(
            <button key={r.id} onClick={()=>setRole(r.id)} style={{ padding:"6px 16px", borderRadius:100, fontSize:13, fontWeight:500, border:role===r.id?"none":"1px solid #E0E0E0", background:role===r.id?"#0B5CFF":"#fff", color:role===r.id?"#fff":"#525252", cursor:"pointer", transition:"all .15s", fontFamily:"inherit" }}>{r.label}</button>
          ))}
          <div style={{ width:1, height:24, background:"#E0E0E0" }} />
          {(["about","soft","hard"] as QuestionType[]).map(t=>(
            <label key={t} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
              <input type="checkbox" checked={types[t]} onChange={()=>setTypes(p=>({...p,[t]:!p[t]}))} style={{ cursor:"pointer", accentColor:"#0B5CFF", width:15, height:15 }} />
              <span style={{ fontSize:13, fontWeight:types[t]?600:400, color:types[t]?"#1F1F1F":"#767676", cursor:"pointer" }}>{TYPE_CONFIG[t].label}</span>
            </label>
          ))}
          <div style={{ width:1, height:24, background:"#E0E0E0" }} />
          <input type="text" placeholder="Search questions…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ flex:1, minWidth:180, padding:"8px 12px", borderRadius:8, border:"1px solid #E0E0E0", fontSize:13, background:"#F8F8F8", outline:"none", color:"#1F1F1F", fontFamily:"inherit" }} />
          <select value={stage} onChange={e=>setStage(e.target.value)}
            style={{ padding:"7px 12px", borderRadius:8, border:"1px solid #E0E0E0", fontSize:13, background:"#fff", color:"#1F1F1F", cursor:"pointer", fontFamily:"inherit" }}>
            {["All stages",...stages].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        {error && <div style={{ width:"100%", color:"#B91C1C", fontSize:12 }}>Failed to sync with Supabase: {error}</div>}

        <div style={{ fontSize:12, color:"#767676", marginBottom:12 }}>
          {loading ? "Loading from Supabase..." : `${filtered.length} question${filtered.length!==1?"s":""} · click any card to see answer plan · Esc to close`}
        </div>

        {!loading && filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#767676", fontSize:14 }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🔍</div>
            <div>No questions match the selected filters.</div>
            <button onClick={openNew} style={{ background:"#0B5CFF", color:"#fff", border:"none", borderRadius:8, padding:"9px 22px", fontSize:13, fontWeight:600, cursor:"pointer", margin:"16px auto 0", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>Add a question</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
            {filtered.map(q=>{
              const cfg=TYPE_CONFIG[q.type];
              return (
                <div
                  key={q.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open question: ${q.q}`}
                  onClick={()=>setViewQ(q)}
                  onKeyDown={e=>{
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setViewQ(q);
                    }
                  }}
                  style={{ background:"#fff", borderRadius:12, border:viewQ?.id===q.id?"2px solid #0B5CFF":"1px solid #E0E0E0", padding:"14px 14px 10px", cursor:"pointer", transition:"box-shadow .15s, border-color .15s", display:"flex", flexDirection:"column", gap:6, textAlign:"left", width:"100%", fontFamily:"inherit" }}
                  onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.10)")}
                  onMouseLeave={e=>(e.currentTarget.style.boxShadow="none")}>
                  <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:100, fontSize:11, fontWeight:600, background:cfg.bg, color:cfg.text, alignSelf:"flex-start" }}>{cfg.label}</span>
                  <div style={{ fontSize:13, color:"#1F1F1F", lineHeight:1.45, fontWeight:500 }}>{q.q}</div>
                  <div style={{ fontSize:11, color:"#767676" }}>{q.stage}</div>
                  <div style={{ display:"flex", gap:4, marginTop:4 }} onClick={e=>e.stopPropagation()}>
                    {[
                      { icon:"👁", title:"View",   action:()=>setViewQ(q),   hbg:"#EBF0FF", hc:"#0B5CFF" },
                      { icon:"✏️", title:"Edit",   action:()=>openEdit(q),   hbg:"#EBF0FF", hc:"#0B5CFF" },
                      { icon:"🗑", title:"Delete", action:()=>{ if(confirm("Delete this question?")) handleDelete(q.id); }, hbg:"#FEE2E2", hc:"#DC2626" },
                    ].map(b=>(
                      <button key={b.title} title={b.title} onClick={b.action}
                        style={{ background:"none", border:"none", cursor:"pointer", color:"#767676", fontSize:14, padding:"3px 5px", borderRadius:6, transition:"background .12s, color .12s", fontFamily:"inherit" }}
                        onMouseEnter={e=>{ e.currentTarget.style.background=b.hbg; e.currentTarget.style.color=b.hc; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color="#767676"; }}>
                        {b.icon}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {viewQ&&!editQ&&<ViewModal q={viewQ} onEdit={()=>openEdit(viewQ)} onClose={()=>setViewQ(null)} />}
      {editQ&&<EditModal question={editQ} isNew={isNew} stages={stages} onSave={handleSave} onDelete={handleDelete} onClose={()=>{ setEditQ(null); setIsNew(false); }} />}
    </div>
  );
}
