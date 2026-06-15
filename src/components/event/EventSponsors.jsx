import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const sponsors = [
  { name: "Tatu City", logo: "/tatu-city-logo.png" },
  { name: "Your Logo Here", color: "#0075E1" },
  { name: "Your Logo Here", color: "#2E7D32" },
  { name: "Your Logo Here", color: "#7C3AED" },
  { name: "Your Logo Here", color: "#F59E0B" },
  { name: "Your Logo Here", color: "#EF4444" },
  { name: "Your Logo Here", color: "#0075E1" },
  { name: "Your Logo Here", color: "#2E7D32" },
];

const SPONSORSHIP_EMAIL = "info@globalshapermombasa.org";
const SPONSORSHIP_SUBJECT = "Tatu City Riders 2026 — Sponsorship Inquiry";
const SPONSORSHIP_BODY = `Dear Global Shapers Mombasa Hub Team,

I am interested in sponsoring the Tatu City Riders 2026 event and would like to learn more about the available partnership opportunities.

Organisation / Company Name: 
Contact Person: 
Phone Number: 
Budget Range: 

Please send me the full sponsorship prospectus and available packages.

Looking forward to hearing from you.

Kind regards,`;

function SponsorLogo({ sponsor }) {
  if (sponsor.logo) {
    return (
      <div className="h-20 w-40 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden flex-shrink-0">
        <img src={sponsor.logo} alt={sponsor.name} className="h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="h-20 w-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl px-4 bg-white flex-shrink-0">
      <span className="text-xs font-bold text-gray-400 text-center">{sponsor.name}</span>
    </div>
  );
}

export default function EventSponsors() {
  const sponsorMailto = `mailto:${SPONSORSHIP_EMAIL}?subject=${encodeURIComponent(SPONSORSHIP_SUBJECT)}&body=${encodeURIComponent(SPONSORSHIP_BODY)}`;

  return (
    <div className="py-20 md:py-28 bg-gray-50 px-5" id="sponsors">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#0075E1] uppercase">Partners</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Our Sponsors</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Sponsoring Tatu City Riders means investing in Kenya's climate future. Partner with us to put your brand at the forefront of Africa's youth-led climate action.</p>
        </motion.div>

        {/* Scrolling belt */}
        <div className="overflow-hidden relative mb-12">
          <div className="flex gap-5 animate-[scroll_20s_linear_infinite] w-max">
            {[...sponsors, ...sponsors].map((s, i) => (
              <SponsorLogo key={i} sponsor={s} />
            ))}
          </div>
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />
        </div>

        {/* Become a sponsor CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="bg-[#0075E1] rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-black mb-2">Become a Sponsor</h3>
          <p className="text-blue-100 mb-6 text-sm max-w-md mx-auto">
            Reach 500+ cyclists, families, and spectators. Associate your brand with Kenya's largest youth-led climate cycling event.
          </p>
          <a href={sponsorMailto}
            className="inline-flex items-center gap-2 bg-white text-[#0075E1] font-black px-6 py-3 rounded-2xl hover:bg-blue-50 transition-colors">
            <Mail className="w-4 h-4" /> Email Us About Sponsorship
          </a>
        </motion.div>
      </div>
    </div>
  );
}