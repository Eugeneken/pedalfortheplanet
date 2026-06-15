import React from "react";
import { motion } from "framer-motion";
import { Leaf, Users, Heart } from "lucide-react";

const pillars = [
  {
    icon: <Leaf className="w-7 h-7" />,
    color: "#2E7D32",
    bg: "#2E7D3210",
    title: "Climate Action",
    desc: "Every pedal stroke powers real impact. Funds raised support tree planting across Kiambu County, youth climate education programs, and community renewable energy projects.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    color: "#0075E1",
    bg: "#0075E110",
    title: "Community",
    desc: "From Mombasa to Nairobi, riders of all ages and abilities come together. Families, students, professionals — united by a shared commitment to Kenya's future.",
  },
  {
    icon: <Heart className="w-7 h-7" />,
    color: "#E53935",
    bg: "#E5393510",
    title: "Connection",
    desc: "From local communities to global movements — this event connects riders and change-makers who believe climate action starts at home, one pedal stroke at a time.",
  },
];

export default function EventAbout() {
  return (
    <div className="py-20 md:py-28 bg-white px-5">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#0075E1] uppercase">Why We Ride</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">More than a race.</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Tatu City Riders 2026 is a charity cycling event organized by the <strong>Global Shapers Mombasa Hub</strong> — 
            empowering young Kenyans to drive positive change across the continent.
          </p>
        </motion.div>

        {/* Three columns */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div key={p.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              style={{ backgroundColor: p.bg }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: p.color + "18", color: p.color }}>
                {p.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{p.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3">
            <img src="https://media.base44.com/images/public/6a15990fc9795a8e869417b1/39ee02184_GSC_Hub_Mombasa1.jpg" alt="Global Shapers Mombasa" className="w-8 h-8 rounded-full object-cover bg-white" />
            <span className="text-sm text-gray-600 font-semibold">Proudly organized by <span className="text-[#0075E1] font-black">Global Shapers Mombasa Hub</span></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}