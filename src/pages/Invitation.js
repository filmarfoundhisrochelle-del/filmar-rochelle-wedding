import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, Heart } from "lucide-react";
import Monogram from "../components/Monogram";
import Countdown from "../components/Countdown";
import RSVPForm from "../components/RSVPForm";
import RSVPCounter from "../components/RSVPCounter";
import SaveTheDate from "../components/SaveTheDate";
import { WEDDING } from "../lib/wedding";

const HERO_BG = "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1600";
const COUPLE_PHOTO = "/couple.jpg";
const TABLE_2 = "https://images.pexels.com/photos/13591097/pexels-photo-13591097.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const fadeUp = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:0.9,ease:"easeOut"}} };

const Section = ({id,children,className=""}) => (<section id={id} className={`w-full ${className}`}><div className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32">{children}</div></section>);
const Eyebrow = ({children,testid}) => (<div className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-[#857F76]" data-testid={testid}><span className="h-px w-8 bg-[#C87C5B]"/>{children}<span className="h-px w-8 bg-[#C87C5B]"/></div>);

export default function Invitation() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <main className="bg-[#FDFBF7] text-[#2B2824] font-body paper-grain min-h-screen" data-testid="invitation-page">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0" style={{backgroundImage:`url(${HERO_BG})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
        <div className="absolute inset-0 bg-[#FDFBF7]/60 backdrop-blur-[2px]"/>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#FDFBF7]"/>
        <motion.div initial="hidden" animate="visible" variants={{visible:{transition:{staggerChildren:0.18}}}} className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div variants={fadeUp} className="flex justify-center"><Monogram size={70}/></motion.div>
          <motion.div variants={fadeUp} className="mt-8"><Eyebrow testid="hero-eyebrow">Together with their families</Eyebrow></motion.div>
          <motion.h1 variants={fadeUp} className="font-serif-display text-5xl sm:text-7xl lg:text-8xl text-[#2B2824] mt-8 leading-[0.95] tracking-tight" data-testid="couple-names">
            {WEDDING.groom}<span className="font-script text-[#C87C5B] mx-2 sm:mx-4 text-6xl sm:text-8xl lg:text-9xl italic">&amp;</span>{WEDDING.bride}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-8 text-[#4A463F] italic font-serif-display text-xl sm:text-2xl">invite you to celebrate their wedding reception</motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-2">
            <div className="divider-ornament w-72"><Heart size={14} strokeWidth={1.2}/></div>
            <p className="font-serif-display text-3xl sm:text-4xl text-[#2B2824]" data-testid="hero-date">{WEDDING.dayLabel}, {WEDDING.dateLabel}</p>
            <p className="text-xs tracking-[0.35em] uppercase text-[#857F76] mt-1">Six o'clock in the evening</p>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12"><Countdown targetISO={WEDDING.dateISO}/></motion.div>
          <motion.div variants={fadeUp} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#rsvp" className="inline-block px-8 sm:px-10 py-4 border border-[#C87C5B] bg-[#C87C5B] text-white text-xs tracking-[0.35em] uppercase hover:bg-[#B36B4D] transition-all duration-500" data-testid="hero-rsvp-cta">Reserve your seat</a>
            <SaveTheDate startISO={WEDDING.dateISO}/>
          </motion.div>
        </motion.div>
      </section>

      {/* NOTE */}
      <Section id="note" className="bg-[#F3F0E9]">
        <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}} variants={fadeUp} className="text-center max-w-2xl mx-auto" data-testid="reception-only-note">
          <Eyebrow>A note for our beloved guests</Eyebrow>
          <h2 className="font-serif-display text-3xl sm:text-5xl mt-6 leading-tight">Please join us for the<span className="italic text-[#C87C5B]"> reception only</span>.</h2>
          <p className="mt-6 text-[#4A463F] leading-relaxed max-w-xl mx-auto">The church ceremony will be an intimate family moment. We'd be honoured to celebrate with you at the reception that follows — where the real feast begins.</p>
        </motion.div>
      </Section>

      {/* DETAILS */}
      <Section id="details">
        <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.2}} variants={fadeUp} className="text-center mb-16">
          <Eyebrow>The Celebration</Eyebrow>
          <h2 className="font-serif-display text-4xl sm:text-6xl mt-6">The Reception</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="md:col-span-2 border border-[#E5E1D8] bg-white p-8 flex flex-col justify-between" data-testid="detail-card-date">
            <Calendar size={22} strokeWidth={1.2} className="text-[#C87C5B]"/>
            <div><p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76]">The Date</p><p className="font-serif-display text-3xl mt-2 leading-tight">June 12<sup className="text-base">th</sup>, 2026</p><p className="text-sm text-[#857F76] mt-1 italic">Friday evening</p></div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="md:col-span-2 border border-[#E5E1D8] bg-[#FFF6F0] p-8 flex flex-col justify-between" data-testid="detail-card-time">
            <Clock size={22} strokeWidth={1.2} className="text-[#C87C5B]"/>
            <div><p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76]">The Hour</p><p className="font-serif-display text-3xl mt-2 leading-tight">6:00 PM</p><p className="text-sm text-[#857F76] mt-1 italic">Arrival from 5:30 PM</p></div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="md:col-span-2 md:row-span-2 overflow-hidden border border-[#E5E1D8] bg-[#E2DAC6]">
            <img src={COUPLE_PHOTO} alt="Filmar and Rochelle" className="w-full h-full object-cover"/>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="md:col-span-4 border border-[#E5E1D8] bg-white p-8 flex flex-col justify-between" data-testid="detail-card-venue">
            <MapPin size={22} strokeWidth={1.2} className="text-[#C87C5B]"/>
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76]">The Venue</p>
              <p className="font-serif-display text-3xl sm:text-4xl mt-2 leading-tight">{WEDDING.receptionVenue}</p>
              <p className="text-base sm:text-lg text-[#4A463F] mt-2">{WEDDING.receptionHotel}</p>
              <p className="text-sm text-[#857F76] mt-1 italic">{WEDDING.receptionAddress}</p>
            </div>
            <a href="https://maps.google.com/?q=Ibis+Styles+Manila+Araneta+City" target="_blank" rel="noreferrer" className="text-xs tracking-[0.3em] uppercase text-[#C87C5B] hover:text-[#2B2824] transition-colors" data-testid="venue-map-link">View on map →</a>
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:1}} className="mt-6 border border-[#E5E1D8] bg-white overflow-hidden" data-testid="venue-map-embed">
          <iframe title="Venue map" src="https://www.google.com/maps?q=Ibis+Styles+Manila+Araneta+City&t=&z=16&ie=UTF8&iwloc=&output=embed" width="100%" height="380" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block w-full border-0"/>
          <div className="px-6 py-4 border-t border-[#E5E1D8] bg-[#FBF7F2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div><p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76]">Find us at</p><p className="font-serif-display text-lg text-[#2B2824] mt-1">Ibis Styles Manila Araneta City · Bardot Room</p></div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=Ibis+Styles+Manila+Araneta+City" target="_blank" rel="noreferrer" className="text-xs tracking-[0.3em] uppercase border border-[#C87C5B] text-[#C87C5B] px-4 py-2 hover:bg-[#C87C5B] hover:text-white transition-colors" data-testid="venue-directions-google">Get directions</a>
          </div>
        </motion.div>
      </Section>

      {/* DRESS CODE */}
      <Section id="dress-code" className="bg-[#FBF7F2]">
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:1}} className="max-w-4xl mx-auto text-center" data-testid="dress-code-content">
          <Eyebrow>Dress Code</Eyebrow>
          <h2 className="font-serif-display text-4xl sm:text-6xl mt-6 mb-10">Semi-Formal Attire</h2>
          <p className="font-serif-display italic text-xl text-[#4A463F] mb-8">Think refined, romantic, and polished.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-10">
            <div className="border border-[#E5E1D8] bg-white p-8"><p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76] mb-4">Ladies</p><p className="text-[#4A463F] leading-relaxed">Long or midi dresses, dressy coordinates, elegant jumpsuits, or flowy silhouettes. Opt for soft fabrics, playful prints, and refined details.</p></div>
            <div className="border border-[#E5E1D8] bg-white p-8"><p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76] mb-4">Gentlemen</p><p className="text-[#4A463F] leading-relaxed">Cotton pants or slacks with an elegant sweater top. A refined and modern alternative to the classic suit.</p></div>
          </div>
          <div className="border border-[#E5E1D8] bg-white p-8">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76] mb-6">Wedding Color Palette</p>
            <div className="flex flex-wrap justify-center gap-6">
              {[["#c2673d","Terracotta"],["#5b6b3a","Olive"],["#8a9e72","Sage"],["#c47880","Dusty Rose"],["#6e2232","Wine"],["#d4b483","Champagne"],["#1e3558","Midnight Blue"]].map(([color,name]) => (
                <div key={name} className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full border border-black/10" style={{background:color}}/><span className="text-[9px] tracking-[2px] uppercase text-[#857F76]">{name}</span></div>
              ))}
            </div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#857F76] mt-8 mb-4">Kindly avoid</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Jeans","T-shirts","Rubber shoes","Athletic wear","Bright / neon colors"].map(item => (<span key={item} className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 text-xs tracking-wide rounded-full">✕ {item}</span>))}
            </div>
          </div>
        </motion.div>
      </Section>

      <RSVPCounter refreshKey={refreshKey}/>

      {/* RSVP */}
      <Section id="rsvp">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}} variants={fadeUp} className="lg:col-span-2 lg:sticky lg:top-24">
            <Eyebrow>Kindly reply</Eyebrow>
            <h2 className="font-serif-display text-4xl sm:text-5xl mt-6 leading-tight">Will you be joining us at the table?</h2>
            <p className="mt-6 text-[#4A463F] leading-relaxed">We've reserved seats just for you. Kindly confirm whether you'll be joining us so we can prepare the perfect place setting for you and your family.</p>
            <p className="mt-4 text-sm text-[#857F76] italic">Kindly respond by {WEDDING.rsvpDeadline}.</p>
            <div className="mt-10 hidden lg:block"><div className="aspect-[4/3] overflow-hidden border border-[#E5E1D8]"><img src={COUPLE_PHOTO} alt="Filmar and Rochelle" className="w-full h-full object-cover"/></div></div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.2}} variants={fadeUp} className="lg:col-span-3">
            <div className="bg-white border border-[#E5E1D8] p-8 sm:p-12"><RSVPForm onSubmitted={() => setRefreshKey((k) => k+1)}/></div>
          </motion.div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E1D8] bg-[#F3F0E9]" data-testid="footer">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="font-script text-5xl text-[#C87C5B]">Filmar &amp; Rochelle</p>
          <p className="mt-4 text-xs tracking-[0.35em] uppercase text-[#857F76]">06 · 12 · 2026 — Quezon City</p>
          <p className="mt-8 font-serif-display italic text-lg text-[#4A463F]">{WEDDING.hashtag}</p>
          <p className="mt-8 text-xs text-[#857F76]">With love, from the Filmar &amp; Rochelle family</p>
        </div>
      </footer>
    </main>
  );
}
