import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronDown } from "lucide-react";

const TARGET = new Date("2026-09-26T06:00:00+03:00");

function useCountdown() {
  const [t, setT] = useState(getTime());
  function getTime() {
    const diff = Math.max(0, TARGET - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  }
  useEffect(() => {
    const id = setInterval(() => setT(getTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function CountUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-4 py-3 min-w-[64px] text-center">
        <span className="text-3xl md:text-4xl font-black text-white tabular-nums">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-[11px] font-bold text-white/70 mt-1.5 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function EventHero() {
  const { days, hours, mins, secs } = useCountdown();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#003A8C] via-[#0075E1] to-[#1A9A5C]">
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1600&q=80"
          alt="Cyclists riding through Kenya landscape"
          className="w-full h-full object-cover opacity-20"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#003A8C]/60 via-[#0075E1]/50 to-[#1A9A5C]/70" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#2E7D32]/20 pointer-events-none" />

      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
          <span className="text-xs font-bold text-white/90 tracking-widest uppercase">Global Shapers Mombasa Hub</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-2">
          TATU CITY<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">RIDERS</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="text-xl md:text-2xl font-bold text-white/85 mb-2">
          Pedal for the Planet
        </motion.p>

        {/* Event meta */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8 text-white/75">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Calendar className="w-4 h-4" /> Saturday, 26 September 2026
          </span>
          <span className="text-white/40">·</span>
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <MapPin className="w-4 h-4" /> Tatu City, Kiambu, Kenya
          </span>
        </motion.div>

        {/* Countdown */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="flex items-start justify-center gap-3 md:gap-5 mb-10">
          <CountUnit value={days} label="Days" />
          <span className="text-3xl font-black text-white/50 mt-3">:</span>
          <CountUnit value={hours} label="Hours" />
          <span className="text-3xl font-black text-white/50 mt-3">:</span>
          <CountUnit value={mins} label="Mins" />
          <span className="text-3xl font-black text-white/50 mt-3">:</span>
          <CountUnit value={secs} label="Secs" />
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-[#0075E1] font-black text-base px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-colors w-full sm:w-auto">
            🚴 Register Now
          </button>
          <button
            onClick={() => document.getElementById("sponsors")?.scrollIntoView({ behavior: "smooth" })}
            className="border-2 border-white/50 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors w-full sm:w-auto">
            Become a Sponsor
          </button>
        </motion.div>

        {/* Distances pill row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          className="flex items-center justify-center gap-3 mt-8">
          {[{ d: "5 km", label: "Fun Ride", color: "bg-red-500" }, { d: "16 km", label: "Explorer", color: "bg-blue-500" }, { d: "25 km", label: "Adventure", color: "bg-green-600" }].map(r => (
            <div key={r.d} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
              <span className={`w-2 h-2 rounded-full ${r.color}`} />
              <span className="text-xs font-bold text-white">{r.d}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
        <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </div>
  );
}