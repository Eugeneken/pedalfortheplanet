import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const schedule = [
  { time: "6:00 AM", title: "Gates Open & Check-in", desc: "Rider registration, bike checks, and bib collection at Tatu City main gate", icon: "🚪" },
  { time: "6:45 AM", title: "Opening Ceremony & Warm-Up", desc: "Welcome address by Global Shapers Mombasa Hub and Tatu City representatives, followed by a group warm-up and stretching session led by our fitness coaches", icon: "🎤" },
  { time: "7:00 AM", title: "5 km Start — Kids Fun Ride", desc: "Our youngest and newest riders set off through the coffee plantation. Safety marshals at every turn.", icon: "🚲" },
  { time: "8:00 AM", title: "16 km Start — The Explorer", desc: "The Explorer category departs through coffee farms, savannah, and greenlands.", icon: "🌍" },
  { time: "8:30 AM", title: "25 km Start — The Adventure", desc: "Our most experienced riders head out on the full route — coffee, savannah, greenlands, and city views.", icon: "🌿" },
  { time: "10:00 AM", title: "Aid Stations Active", desc: "Water stations along all routes remain active to support riders", icon: "💧" },
  { time: "11:30 AM", title: "Finishers Begin Arriving", desc: "Riders start crossing the finish line — every finisher receives their medal and bib", icon: "🎯" },
  { time: "1:00 PM", title: "Festivities & Music", desc: "Live music, sponsor activations, and community celebration at the finish area", icon: "🎶" },
  { time: "2:00 PM", title: "Medal Ceremony", desc: "All finishers celebrated. Medals awarded to every participant who completes their route.", icon: "🏅" },
  { time: "3:00 PM", title: "Closing Ceremony", desc: "Impact report: trees to be planted, funds raised, and community beneficiaries announced", icon: "🌍" },
];

export default function EventSchedule() {
  return (
    <div className="py-20 md:py-28 bg-white px-5">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#0075E1] uppercase">Race Day</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Event Schedule</h2>
          <p className="text-gray-500">Saturday, 26 September 2026 · Tatu City, Kiambu</p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[52px] top-0 bottom-0 w-0.5 bg-gray-100" />

          <div className="space-y-2">
            {schedule.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex gap-4 group">
                {/* Time */}
                <div className="w-[80px] flex-shrink-0 text-right pt-3">
                  <span className="text-xs font-black text-[#0075E1] tabular-nums">{item.time}</span>
                </div>

                {/* Dot */}
                <div className="flex-shrink-0 relative flex items-start pt-3.5">
                  <div className="w-4 h-4 rounded-full bg-[#0075E1] border-4 border-white shadow ring-1 ring-blue-200 relative z-10" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-gray-50 rounded-2xl px-4 py-3 group-hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}