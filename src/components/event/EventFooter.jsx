import React from "react";
import { GlobalShapersLogo } from "./EventNav";

const socials = [
  { label: "Twitter/X", href: "https://twitter.com/globalshapers", icon: "𝕏" },
  { label: "Instagram", href: "https://instagram.com/globalshapersmombasa", icon: "📸" },
  { label: "LinkedIn", href: "https://linkedin.com/company/global-shapers", icon: "in" },
  { label: "Facebook", href: "https://facebook.com/globalshapers", icon: "f" },
];

export default function EventFooter() {
  return (
    <footer className="bg-gray-950 text-white px-5 pt-14 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://media.base44.com/images/public/6a15990fc9795a8e869417b1/39ee02184_GSC_Hub_Mombasa1.jpg" alt="Global Shapers Community Mombasa" className="h-12 w-auto object-contain bg-white rounded-lg p-1" />
              <div>
                <div className="text-sm font-black text-white">TATU CITY RIDERS 2026</div>
                <div className="text-xs text-gray-400 font-semibold">Pedal for the Planet</div>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              A charity cycling event by Global Shapers Mombasa Hub, empowering young leaders to drive climate action across Kenya.
            </p>
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-[#0075E1] transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Quick Links</h4>
            <div className="space-y-2">
              {["#about", "#route", "#register", "#schedule", "#sponsors", "#faq", "#contact"].map(href => (
                <button key={href} onClick={() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })}
                  className="block text-sm text-gray-400 hover:text-white transition-colors capitalize">
                  {href.replace("#", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Event info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Event Info</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div><span className="text-white font-semibold">Date:</span> Saturday, 26 September 2026</div>
              <div><span className="text-white font-semibold">Time:</span> 5:30 AM – 2:00 PM EAT</div>
              <div><span className="text-white font-semibold">Venue:</span> Tatu City, Kiambu, Kenya</div>
              <div><span className="text-white font-semibold">Distances:</span> 5 km · 16 km · 25 km</div>
              <div><span className="text-white font-semibold">Email:</span>{" "}
                <a href="mailto:info@globalshapermombasa.org" className="text-[#0075E1] hover:underline">info@globalshapermombasa.org</a>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <a href="/ride" className="text-xs text-blue-400 font-semibold hover:text-white">📱 Open Rider App</a>
              <span className="text-gray-600">·</span>
              <a href="/admin" className="text-xs text-gray-500 font-semibold hover:text-white">⚙️ Admin</a>
            </div>
          </div>
        </div>

        {/* Sponsors acknowledgment */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <p className="text-center text-xs text-gray-500 font-semibold">
            Proudly supported by our partners — <a href="#sponsors" className="text-[#0075E1] hover:underline" onClick={e => { e.preventDefault(); document.getElementById("sponsors")?.scrollIntoView({ behavior: "smooth" }); }}>become a sponsor</a>
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© 2026 Global Shapers Mombasa Hub. All rights reserved.</span>
          <span><a href="https://globalshapers.org" target="_blank" rel="noopener noreferrer" className="text-[#0075E1] hover:underline">globalshapers.org</a></span>
        </div>
      </div>
    </footer>
  );
}