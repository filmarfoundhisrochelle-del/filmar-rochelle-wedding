import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const RSVPCounter = ({ refreshKey }) => {
  const [stats, setStats] = useState({ total_responses:0, attending_responses:0, total_guests:0 });
  useEffect(() => {
    let active = true;
    axios.get(`${API}/rsvp/stats`).then((res) => { if (active && res.data) setStats(res.data); }).catch(()=>{});
    return () => { active = false; };
  }, [refreshKey]);

  const Stat = ({ value, label, testid }) => (
    <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="flex flex-col items-center" data-testid={testid}>
      <span className="font-serif-display text-5xl sm:text-6xl text-[#C87C5B] leading-none">{value}</span>
      <span className="mt-3 text-[10px] tracking-[0.35em] uppercase text-[#857F76]">{label}</span>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-12 py-8 px-6 border-y border-[#E5E1D8] bg-[#FBF7F2]" data-testid="rsvp-counter">
      <Stat value={stats.attending_responses} label="Responses · Joyful" testid="stat-attending" />
      <Stat value={stats.total_guests} label="Seats Reserved" testid="stat-total-guests" />
      <Stat value={stats.total_responses} label="Total Replies" testid="stat-total-responses" />
    </div>
  );
};

export default RSVPCounter;
