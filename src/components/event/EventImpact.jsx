import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { icon: "🌳", target: 5000, suffix: "+", label: "Trees to be planted", desc: "Across Kiambu and Mombasa counties with local community groups", color: "#2E7D32" },
  { icon: "♻️", target: 12, suffix: " tonnes", label: "CO₂ offset target", desc: "Through reforestation, education, and sustainable transport initiatives", color: "#0075E1" },
  { icon: "👥", target: 2000, suffix: "+", label: "Community beneficiaries", desc: "Youth climate education programs reaching schools and villages", color: "#7C3AED" },
  { icon: "🚴", target: 500, suffix: "+", label: "Riders expected", desc: "From across Kenya and the East Africa region", color: "#EF4444" },
];

export default function EventImpact() {
  return (
    <div className="py-20 md:py-28 bg-white px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#2E7D32] uppercase">Why it Matters</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Our Impact Goals</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Every shilling raised goes directly to verified climate and community projects in Kenya.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center rounded-3xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: s.color }}>
                <CountUp target={s.target} suffix={s.suffix} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{s.label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>


      </div>
    </div>
  );
}