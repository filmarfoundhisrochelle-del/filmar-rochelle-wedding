import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const DEFAULT_RESERVED_SEATS = 2;
const initialState = { name: "", email: "", attending: "yes", message: "" };

export const RSVPForm = ({ onSubmitted }) => {
  const { reservedSeats, prefillName } = useMemo(() => {
    if (typeof window === "undefined") return { reservedSeats: DEFAULT_RESERVED_SEATS, prefillName: "" };
    const params = new URLSearchParams(window.location.search);
    let seats = parseInt(params.get("seats"), 10);
    if (Number.isNaN(seats) || seats < 1) seats = DEFAULT_RESERVED_SEATS;
    if (seats > 12) seats = 12;
    const name = params.get("guest") || params.get("name") || "";
    return { reservedSeats: seats, prefillName: name };
  }, []);

  const [form, setForm] = useState({ ...initialState, name: prefillName });
  const [confirmedSeats, setConfirmedSeats] = useState(reservedSeats);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { axios.get(`${API}/rsvp/stats`).catch(() => {}); }, []);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Please share your name so we know who's coming."); return; }
    const attending = form.attending === "yes";
    const seats = attending ? confirmedSeats : 0;
    setSubmitting(true);
    try {
      await axios.post(`${API}/rsvp`, { name: form.name.trim(), email: form.email.trim() || null, attending, seats, message: form.message.trim() || null });
      setSuccess(true);
      toast.success(attending ? "Thank you — your seats are reserved at the table." : "We'll miss you, but thank you for letting us know.");
      onSubmitted?.();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-center py-12" data-testid="rsvp-success">
        <div className="font-script text-5xl text-[#C87C5B] mb-4">With gratitude</div>
        <p className="font-serif-display text-2xl text-[#2B2824] mb-2">Your response has been received.</p>
        <p className="text-[#857F76] max-w-md mx-auto">Filmar &amp; Rochelle are so grateful for your love. We can't wait to celebrate this moment with you.</p>
        <button onClick={() => { setForm({ ...initialState, name: prefillName }); setSuccess(false); }} className="mt-8 text-xs tracking-[0.3em] uppercase text-[#C87C5B] hover:text-[#2B2824] transition-colors" data-testid="rsvp-another-button">Submit another response</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="rsvp-form">
      <div className="border border-[#C87C5B]/30 bg-[#FFF6F0] px-5 py-5 text-center" data-testid="reserved-seats-notice">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76]">We are saving</p>
        <div className="flex items-center justify-center gap-4 mt-1">
          <button type="button" onClick={()=>setConfirmedSeats(s=>Math.max(1,s-1))} className="w-10 h-10 border border-[#C87C5B] text-[#C87C5B] text-xl hover:bg-[#FFF6F0]">−</button>
          <p className="font-serif-display text-3xl sm:text-4xl text-[#C87C5B] leading-none">
            <span>{confirmedSeats}</span>
            <span className="ml-2 text-[#2B2824] text-2xl">{confirmedSeats === 1 ? "seat" : "seats"}</span>
          </p>
          <button type="button" onClick={()=>setConfirmedSeats(s=>Math.min(12,s+1))} className="w-10 h-10 border border-[#C87C5B] text-[#C87C5B] text-xl hover:bg-[#FFF6F0]">+</button>
        </div>
        <p className="mt-2 text-sm text-[#4A463F] italic">for you {confirmedSeats > 1 ? "and family" : ""} at our reception.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs tracking-[0.25em] uppercase text-[#857F76]">Full Name</Label>
        <Input id="name" value={form.name} onChange={(e) => update("name")(e.target.value)} placeholder="As it appears on your invitation" className="bg-white border-[#E5E1D8] focus-visible:ring-[#C87C5B] h-12" required data-testid="rsvp-input-name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs tracking-[0.25em] uppercase text-[#857F76]">Email <span className="lowercase tracking-normal">(optional)</span></Label>
        <Input id="email" type="email" value={form.email} onChange={(e) => update("email")(e.target.value)} placeholder="you@example.com" className="bg-white border-[#E5E1D8] focus-visible:ring-[#C87C5B] h-12" data-testid="rsvp-input-email" />
      </div>
      <div className="space-y-3">
        <Label className="text-xs tracking-[0.25em] uppercase text-[#857F76]">Will you be joining us?</Label>
        <RadioGroup value={form.attending} onValueChange={update("attending")} className="grid grid-cols-2 gap-3" data-testid="rsvp-attendance-group">
          <label htmlFor="attending-yes" className={`cursor-pointer border rounded-sm px-4 py-3 flex items-center gap-3 transition-colors ${form.attending === "yes" ? "border-[#C87C5B] bg-[#FFF6F0]" : "border-[#E5E1D8] bg-white hover:bg-[#FBF7F2]"}`}>
            <RadioGroupItem value="yes" id="attending-yes" data-testid="rsvp-attending-yes" />
            <span className="font-serif-display text-lg">Joyfully accept</span>
          </label>
          <label htmlFor="attending-no" className={`cursor-pointer border rounded-sm px-4 py-3 flex items-center gap-3 transition-colors ${form.attending === "no" ? "border-[#C87C5B] bg-[#FFF6F0]" : "border-[#E5E1D8] bg-white hover:bg-[#FBF7F2]"}`}>
            <RadioGroupItem value="no" id="attending-no" data-testid="rsvp-attending-no" />
            <span className="font-serif-display text-lg">Regretfully decline</span>
          </label>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-xs tracking-[0.25em] uppercase text-[#857F76]">A note for the couple <span className="lowercase tracking-normal">(optional)</span></Label>
        <Textarea id="message" value={form.message} onChange={(e) => update("message")(e.target.value)} placeholder="Send your love, well-wishes, or song requests…" rows={4} className="bg-white border-[#E5E1D8] focus-visible:ring-[#C87C5B] resize-none" data-testid="rsvp-input-message" />
      </div>
      <Button type="submit" disabled={submitting} className="w-full h-12 bg-[#C87C5B] hover:bg-[#B36B4D] text-white tracking-[0.25em] uppercase text-xs font-medium rounded-sm transition-all duration-300" data-testid="rsvp-submit-button">
        {submitting ? "Sending…" : "Send your reply"}
      </Button>
      <p className="text-center text-xs text-[#857F76] italic">Kindly respond by May 25, 2026</p>
    </form>
  );
};

export default RSVPForm;
