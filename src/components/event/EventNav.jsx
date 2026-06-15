import React, { useState, useEffect } from "react";
import { Menu, X, Bike } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Route", href: "#route" },
  { label: "Register", href: "#register" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function EventNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleNav("#hero"); }} className="flex items-center gap-2.5">
          <img src="https://media.base44.com/images/public/6a15990fc9795a8e869417b1/39ee02184_GSC_Hub_Mombasa1.jpg" alt="Global Shapers Community Mombasa" className="h-9 w-auto object-contain" />
          <div className="hidden sm:block">
            <div className="text-[13px] font-black text-[#0075E1] leading-tight">TATU CITY RIDERS</div>
            <div className="text-[10px] font-semibold text-gray-500 leading-tight tracking-wide">2026</div>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <button key={l.label} onClick={() => handleNav(l.href)}
              className="text-sm font-semibold text-gray-700 hover:text-[#0075E1] transition-colors">
              {l.label}
            </button>
          ))}
          <button onClick={() => handleNav("#register")}
            className="bg-[#0075E1] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            Register Now
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-3">
          {links.map(l => (
            <button key={l.label} onClick={() => handleNav(l.href)}
              className="block w-full text-left text-sm font-semibold text-gray-700 py-2 hover:text-[#0075E1]">
              {l.label}
            </button>
          ))}
          <button onClick={() => handleNav("#register")}
            className="w-full bg-[#0075E1] text-white text-sm font-bold py-3 rounded-xl mt-2">
            Register Now
          </button>
        </div>
      )}
    </nav>
  );
}

export function GlobalShapersLogo({ size = 40, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="48" fill="#0075E1" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeWidth="1.5" />
      {/* Globe lines */}
      <ellipse cx="50" cy="50" rx="20" ry="44" fill="none" stroke="white" strokeWidth="1.2" />
      <line x1="6" y1="50" x2="94" y2="50" stroke="white" strokeWidth="1.2" />
      <path d="M 15 30 Q 50 22 85 30" fill="none" stroke="white" strokeWidth="1.2" />
      <path d="M 15 70 Q 50 78 85 70" fill="none" stroke="white" strokeWidth="1.2" />
      {/* Skyline */}
      <rect x="28" y="58" width="5" height="10" fill="white" />
      <rect x="35" y="53" width="5" height="15" fill="white" />
      <rect x="42" y="56" width="6" height="12" fill="white" />
      <rect x="50" y="50" width="5" height="18" fill="white" />
      <rect x="57" y="54" width="5" height="14" fill="white" />
      <rect x="64" y="58" width="5" height="10" fill="white" />
      <rect x="26" y="68" width="48" height="2" fill="white" />
    </svg>
  );
}