import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy, Trash2, Lock, RefreshCw, Link as LinkIcon, Users, Check, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const STORAGE_KEY = "fr_host_passcode";
const HISTORY_KEY = "fr_link_history";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" });
};

const PasscodeGate = ({ onUnlock }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post(`${API}/host/verify`, null, { headers:{"X-Host-Passcode":code} });
      localStorage.setItem(STORAGE_KEY, code); onUnlock(code);
    } catch { toast.error("Incorrect passcode. Please try again."); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6" data-testid="passcode-gate">
      <motion.form onSubmit={submit} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="w-full max-w-md border border-[#E5E1D8] bg-white p-10">
        <div className="flex justify-center mb-6"><div className="w-14 h-14 rounded-full bg-[#FFF6F0] flex items-center justify-center"><Lock size={20} className="text-[#C87C5B]" strokeWidth={1.4}/></div></div>
        <h1 className="font-serif-display text-3xl text-center text-[#2B2824]">Host Sign-in</h1>
        <p className="text-center text-sm text-[#857F76] mt-2">Enter your passcode to manage RSVPs for Filmar &amp; Rochelle.</p>
        <div className="mt-8 space-y-2">
          <Label htmlFor="passcode" className="text-xs tracking-[0.25em] uppercase text-[#857F76]">Passcode</Label>
          <Input id="passcode" type="password" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="••••••••" className="bg-white border-[#E5E1D8] h-12 text-center tracking-[0.3em]" autoFocus required data-testid="passcode-input"/>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-12 mt-6 bg-[#C87C5B] hover:bg-[#B36B4D] text-white tracking-[0.25em] uppercase text-xs" data-testid="passcode-submit">
          {loading ? "Verifying…" : "Unlock"}
        </Button>
      </motion.form>
    </div>
  );
};

const StatCard = ({ label, value, testid }) => (
  <div className="border border-[#E5E1D8] bg-white p-6 flex flex-col" data-testid={testid}>
    <span className="text-[10px] tracking-[0.35em] uppercase text-[#857F76]">{label}</span>
    <span className="font-serif-display text-4xl text-[#C87C5B] mt-2 leading-none">{value}</span>
  </div>
);

const LinkGenerator = () => {
  const [guestName, setGuestName] = useState("");
  const [seats, setSeats] = useState(2);
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]"); } catch { return []; } });
  const baseUrl = useMemo(() => typeof window !== "undefined" ? `${window.location.origin}/` : "", []);
  const generated = useMemo(() => { const p = new URLSearchParams(); if (guestName.trim()) p.set("guest",guestName.trim()); p.set("seats",String(seats)); return `${baseUrl}?${p.toString()}`; }, [guestName,seats,baseUrl]);

  const persistHistory = (next) => { setHistory(next); try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {} };
  const addToHistory = (entry) => { const filtered = history.filter(h=>h.url!==entry.url); persistHistory([entry,...filtered].slice(0,10)); };
  const copy = async (text, entry) => {
    if (entry) addToHistory(entry);
    try { await navigator.clipboard.writeText(text); toast.success("Link copied to clipboard"); }
    catch { toast.error("Couldn't auto-copy — long-press the link to copy manually."); }
  };
  const copyCurrent = () => { if (!guestName.trim()) { toast.error("Please add a guest name first."); return; } copy(generated, {name:guestName.trim(),seats,url:generated,createdAt:new Date().toISOString()}); };

  return (
    <div className="space-y-8" data-testid="link-generator">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="guest-name" className="text-xs tracking-[0.25em] uppercase text-[#857F76]">Guest or family name</Label>
          <Input id="guest-name" value={guestName} onChange={(e)=>setGuestName(e.target.value)} placeholder="e.g. The Cruz Family" className="bg-white border-[#E5E1D8] h-12" data-testid="generator-guest-input"/>
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-[0.25em] uppercase text-[#857F76]">Seats reserved</Label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>setSeats(s=>Math.max(1,s-1))} className="h-12 w-12 border border-[#E5E1D8] bg-white text-[#C87C5B] hover:bg-[#FBF7F2]">−</button>
            <Input type="number" min={1} max={12} value={seats} onChange={(e)=>{const v=parseInt(e.target.value,10);if(!isNaN(v))setSeats(Math.min(12,Math.max(1,v)));}} className="h-12 text-center font-serif-display text-2xl bg-white border-[#E5E1D8]"/>
            <button type="button" onClick={()=>setSeats(s=>Math.min(12,s+1))} className="h-12 w-12 border border-[#E5E1D8] bg-white text-[#C87C5B] hover:bg-[#FBF7F2]">+</button>
          </div>
        </div>
      </div>
      <div className="border border-[#C87C5B]/30 bg-[#FFF6F0] p-5">
        <Label className="text-xs tracking-[0.25em] uppercase text-[#857F76]">Personal invitation link</Label>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 font-mono text-sm text-[#2B2824] bg-white border border-[#E5E1D8] px-4 py-3 break-all" data-testid="generated-link">{generated}</div>
          <Button onClick={copyCurrent} className="bg-[#C87C5B] hover:bg-[#B36B4D] text-white tracking-[0.25em] uppercase text-xs px-6" data-testid="copy-link-button"><Copy size={16} className="mr-2" strokeWidth={1.5}/>Copy</Button>
        </div>
        <p className="mt-3 text-xs text-[#857F76] italic">Share this link with {guestName.trim()||"your guest"} — the form will pre-fill their name and confirm {seats} {seats===1?"seat":"seats"} are saved.</p>
      </div>
      {history.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76] mb-4">Recent links</p>
          <ul className="border border-[#E5E1D8] bg-white divide-y divide-[#E5E1D8]">
            {history.map(h=>(
              <li key={h.url} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-[#FBF7F2]">
                <div className="flex-1 min-w-0">
                  <p className="font-serif-display text-lg text-[#2B2824]">{h.name} <span className="text-[10px] tracking-[0.25em] uppercase text-[#C87C5B]">{h.seats} seats</span></p>
                  <p className="text-xs text-[#857F76] font-mono truncate">{h.url}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>copy(h.url,h)} className="text-xs tracking-[0.25em] uppercase text-white bg-[#C87C5B] hover:bg-[#B36B4D] px-4 py-2 flex items-center gap-2"><Copy size={12}/>Copy</button>
                  <button onClick={()=>persistHistory(history.filter(x=>x.url!==h.url))} className="text-[#857F76] hover:text-red-600 p-2"><Trash2 size={14}/></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const RSVPTracker = ({ passcode, onChange }) => {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAll = async () => {
    setLoading(true);
    try { const res = await axios.get(`${API}/host/rsvps`,{headers:{"X-Host-Passcode":passcode}}); setRsvps(res.data||[]); onChange?.(res.data||[]); }
    catch { toast.error("Failed to load RSVPs."); }
    finally { setLoading(false); }
  };
  useEffect(()=>{fetchAll();},[]);
  const remove = async (id) => {
    if (!window.confirm("Remove this RSVP?")) return;
    try { await axios.delete(`${API}/host/rsvps/${id}`,{headers:{"X-Host-Passcode":passcode}}); toast.success("RSVP removed"); fetchAll(); }
    catch { toast.error("Could not remove RSVP."); }
  };
  const downloadCsv = () => {
    const attending = rsvps.filter(r=>r.attending);
    const csv = [["Guest Name","Seats Confirmed"],...attending.map(r=>[r.name,r.seats]),["TOTAL",attending.reduce((s,r)=>s+r.seats,0)]].map(row=>row.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="filmar-rochelle-attendees.csv"; a.click();
  };
  return (
    <div className="space-y-6" data-testid="rsvp-tracker">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#857F76]">{loading?"Loading…":`${rsvps.length} ${rsvps.length===1?"response":"responses"} so far`}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAll} className="h-10 border-[#E5E1D8]" data-testid="refresh-button"><RefreshCw size={14} className="mr-2"/>Refresh</Button>
          <Button variant="outline" onClick={downloadCsv} disabled={rsvps.length===0} className="h-10 border-[#E5E1D8]" data-testid="download-csv-button">Download CSV</Button>
        </div>
      </div>
      <div className="border border-[#E5E1D8] bg-white overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="bg-[#FBF7F2]"><TableHead className="text-xs tracking-[0.2em] uppercase">Guest</TableHead><TableHead className="text-xs tracking-[0.2em] uppercase">Status</TableHead><TableHead className="text-xs tracking-[0.2em] uppercase text-center">Seats</TableHead><TableHead className="text-xs tracking-[0.2em] uppercase">Message</TableHead><TableHead className="text-xs tracking-[0.2em] uppercase">Submitted</TableHead><TableHead/></TableRow></TableHeader>
          <TableBody>
            {!loading && rsvps.length===0 && (<TableRow><TableCell colSpan={6} className="text-center py-12 text-[#857F76]">No RSVPs yet. Share your personal invitation links to start collecting replies.</TableCell></TableRow>)}
            {rsvps.map(r=>(
              <TableRow key={r.id} data-testid={`rsvp-row-${r.id}`}>
                <TableCell><div className="font-serif-display text-lg">{r.name}</div>{r.email&&<div className="text-xs text-[#857F76]">{r.email}</div>}</TableCell>
                <TableCell>{r.attending?(<Badge className="bg-[#E2DAC6] text-[#4A463F] border-0"><Check size={12} className="mr-1"/>Joyfully accepts</Badge>):(<Badge className="bg-[#F3F0E9] text-[#857F76] border-0"><X size={12} className="mr-1"/>Regrets</Badge>)}</TableCell>
                <TableCell className="text-center font-serif-display text-xl text-[#C87C5B]">{r.seats}</TableCell>
                <TableCell className="max-w-xs text-sm italic text-[#4A463F]">{r.message||"—"}</TableCell>
                <TableCell className="text-xs text-[#857F76]">{formatDate(r.created_at)}</TableCell>
                <TableCell className="text-right"><button onClick={()=>remove(r.id)} className="text-[#857F76] hover:text-red-600 p-2" data-testid={`delete-rsvp-${r.id}`}><Trash2 size={14}/></button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default function Manage() {
  const [passcode, setPasscode] = useState(()=>typeof window!=="undefined"?localStorage.getItem(STORAGE_KEY)||"":"");
  const [verified, setVerified] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  useEffect(()=>{
    if (!passcode) return;
    axios.post(`${API}/host/verify`,null,{headers:{"X-Host-Passcode":passcode}}).then(()=>setVerified(true)).catch(()=>{localStorage.removeItem(STORAGE_KEY);setPasscode("");});
  },[passcode]);
  const stats = useMemo(()=>{const a=rsvps.filter(r=>r.attending);return{total:rsvps.length,attending:a.length,declined:rsvps.filter(r=>!r.attending).length,guests:a.reduce((s,r)=>s+r.seats,0)};},[rsvps]);
  const signOut = ()=>{localStorage.removeItem(STORAGE_KEY);setPasscode("");setVerified(false);};

  if (!verified) return <PasscodeGate onUnlock={(code)=>{setPasscode(code);setVerified(true);}}/>;

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 sm:py-20 px-6" data-testid="manage-page">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#857F76]">Host Dashboard</p>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-[#2B2824] mt-2">Filmar &amp; Rochelle</h1>
            <p className="text-[#857F76] mt-1 italic">06 · 12 · 2026 — Bardot Room</p>
          </div>
          <button onClick={signOut} className="text-xs tracking-[0.3em] uppercase text-[#857F76] hover:text-[#C87C5B] transition-colors self-start sm:self-end" data-testid="sign-out-button">Sign out</button>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total replies" value={stats.total} testid="stat-total"/>
          <StatCard label="Joyfully attending" value={stats.attending} testid="stat-attending"/>
          <StatCard label="Seats reserved" value={stats.guests} testid="stat-guests"/>
          <StatCard label="Regretfully declined" value={stats.declined} testid="stat-declined"/>
        </div>
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="bg-[#F3F0E9] p-1 h-auto">
            <TabsTrigger value="tracker" className="data-[state=active]:bg-white data-[state=active]:text-[#C87C5B] px-6 py-3 text-xs tracking-[0.2em] uppercase" data-testid="tab-tracker"><Users size={14} className="mr-2"/>RSVP Tracker</TabsTrigger>
            <TabsTrigger value="generator" className="data-[state=active]:bg-white data-[state=active]:text-[#C87C5B] px-6 py-3 text-xs tracking-[0.2em] uppercase" data-testid="tab-generator"><LinkIcon size={14} className="mr-2"/>Invitation Links</TabsTrigger>
          </TabsList>
          <TabsContent value="tracker" className="mt-8"><RSVPTracker passcode={passcode} onChange={setRsvps}/></TabsContent>
          <TabsContent value="generator" className="mt-8"><LinkGenerator/></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
