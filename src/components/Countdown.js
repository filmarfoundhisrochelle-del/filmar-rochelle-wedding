import React, { useEffect, useState } from "react";

const calc = (target) => {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000*60*60*24)),
    hours: Math.floor((diff / (1000*60*60)) % 24),
    minutes: Math.floor((diff / (1000*60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

export const Countdown = ({ targetISO }) => {
  const target = new Date(targetISO).getTime();
  const [t, setT] = useState(() => calc(target));
  useEffect(() => {
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const Box = ({ value, label, testid }) => (
    <div className="flex flex-col items-center px-3 sm:px-6 py-3 min-w-[64px] sm:min-w-[88px] border border-[#E5E1D8] bg-white/60 backdrop-blur-sm rounded-sm" data-testid={testid}>
      <span className="font-serif-display text-3xl sm:text-5xl text-[#C87C5B] leading-none">{String(value).padStart(2,"0")}</span>
      <span className="mt-2 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#857F76]">{label}</span>
    </div>
  );

  return (
    <div className="flex items-stretch justify-center gap-2 sm:gap-4" data-testid="wedding-countdown">
      <Box value={t.days} label="Days" testid="countdown-days" />
      <Box value={t.hours} label="Hours" testid="countdown-hours" />
      <Box value={t.minutes} label="Minutes" testid="countdown-minutes" />
      <Box value={t.seconds} label="Seconds" testid="countdown-seconds" />
    </div>
  );
};

export default Countdown;
