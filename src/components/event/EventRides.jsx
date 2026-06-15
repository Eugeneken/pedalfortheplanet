import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, MapPin } from "lucide-react";

const rides = [
  {
    km: 5,
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FCA5A5",
    name: "Kids Fun Ride",
    emoji: "🚲",
    elevation: "~40m",
    difficulty: "Easy",
    diffColor: "text-green-600 bg-green-50",
    duration: "~20–30 min",
    audience: "Families, beginners, and kids 8+",
    desc: "A joyful loop through Tatu City's lush coffee plantations, with sweeping views of the surrounding savannah. Perfect for young riders and families experiencing the magic of Kenyan nature together.",
    scenery: ["☕ Coffee Plantation", "🌾 Savannah Views"],
  },
  {
    km: 16,
    color: "#0075E1",
    bg: "#EFF6FF",
    border: "#93C5FD",
    name: "The Explorer",
    emoji: "🌍",
    elevation: "~200m",
    difficulty: "Moderate",
    diffColor: "text-blue-600 bg-blue-50",
    duration: "~1h–1h 30m",
    audience: "Regular cyclists & active participants",
    desc: "Wind through coffee farms and open savannah before rolling into verdant greenlands. A richly varied route that showcases the best of Tatu City's landscape.",
    scenery: ["☕ Coffee Plantation", "🌾 Savannah", "🌿 Greenlands"],
    featured: true,
  },
  {
    km: 25,
    color: "#2E7D32",
    bg: "#F0FDF4",
    border: "#86EFAC",
    name: "The Adventure",
    emoji: "🌿",
    elevation: "~450m",
    difficulty: "Challenging",
    diffColor: "text-orange-600 bg-orange-50",
    duration: "~2–2h 30m",
    audience: "Experienced & endurance cyclists",
    desc: "The full experience — coffee farms, open savannah, rolling greenlands, and panoramic city views over Tatu City. A non-competitive personal challenge with unforgettable scenery.",
    scenery: ["☕ Coffee Plantation", "🌾 Savannah", "🌿 Greenlands", "🏙️ City Views"],
  },
];

export default function EventRides() {
  return (
    <div className="py-20 md:py-28 bg-gray-50 px-5" id="route">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#0075E1] uppercase">The Ride</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Choose your distance</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">Three routes, one mission. This is a non-competitive, community ride — choose the distance that works for you and enjoy every pedal stroke.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {rides.map((r, i) => (
            <motion.div key={r.km}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className={`rounded-3xl border-2 overflow-hidden flex flex-col relative ${r.featured ? "shadow-2xl scale-[1.02]" : "shadow-sm"}`}
              style={{ backgroundColor: r.bg, borderColor: r.border }}>
              {r.featured && (
                <div className="absolute top-4 right-4 bg-[#0075E1] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="p-6 flex-1">
                <div className="text-3xl mb-3">{r.emoji}</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black" style={{ color: r.color }}>{r.km}</span>
                  <span className="text-xl font-bold text-gray-500">km</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{r.name}</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{r.desc}</p>

                {/* Scenery tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {r.scenery.map(s => (
                    <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600">{s}</span>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" style={{ color: r.color }} />
                    <span>Elevation: <strong>{r.elevation}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" style={{ color: r.color }} />
                    <span>Est. time: <strong>{r.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" style={{ color: r.color }} />
                    <span className="text-xs">{r.audience}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.diffColor}`}>{r.difficulty}</span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: r.color, color: "white" }}>
                  Register for this route
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map — Tatu City */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
          <div className="bg-white px-6 py-4 flex items-center gap-2 border-b border-gray-100">
            <MapPin className="w-4 h-4 text-[#0075E1]" />
            <span className="font-black text-gray-800 text-sm">Tatu City, Kiambu County, Kenya</span>
          </div>
          <iframe
            title="Tatu City Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.282!2d36.8597!3d-1.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3f7d7a5f5a5f%3A0x1a1a1a1a1a1a1a1a!2sTatu%20City!5e0!3m2!1sen!2ske!4v1680000000000"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </div>
  );
}