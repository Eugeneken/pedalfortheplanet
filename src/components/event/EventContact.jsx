import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

export default function EventContact() {
  const [form, setForm] = useState({ email: "", message: "" });
  const [newsletter, setNewsletter] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [msgDone, setMsgDone] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!validateEmail(newsletter)) { setErrors({ nl: "Please enter a valid email" }); return; }
    setNewsletterDone(true);
    setErrors({});
  };

  const handleMessage = (e) => {
    e.preventDefault();
    const errs = {};
    if (!validateEmail(form.email)) errs.email = "Valid email required";
    if (!form.message.trim()) errs.message = "Message cannot be empty";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setMsgDone(true);
    setErrors({});
  };

  return (
    <div className="py-20 md:py-28 bg-white px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#0075E1] uppercase">Get in Touch</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">Contact Us</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info + message */}
          <div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#0075E1]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">General Enquiries</div>
                  <a href="mailto:info@globalshapermombasa.org" className="text-sm font-bold text-[#0075E1]">info@globalshapermombasa.org</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">Event Venue</div>
                  <div className="text-sm font-bold text-gray-800">Tatu City, Kiambu County, Kenya</div>
                </div>
              </div>
            </div>

            {/* Message form */}
            {msgDone ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-green-700">Message sent! We'll get back to you within 48 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleMessage} className="space-y-3">
                <div>
                  <input type="email" placeholder="Your email address" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1]" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <textarea placeholder="Your message…" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1] resize-none" />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit"
                  className="w-full bg-[#0075E1] text-white font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-[#003A8C] to-[#0075E1] rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">📩</div>
              <h3 className="text-xl font-black text-white mb-2">Stay in the loop</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Get updates on route releases, sponsor announcements, and early bird deadline reminders — straight to your inbox.
              </p>
            </div>
            {newsletterDone ? (
              <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-4">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm font-bold text-white">You're subscribed! 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-3">
                <input type="email" placeholder="Enter your email" value={newsletter}
                  onChange={e => setNewsletter(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/15 border border-white/25 text-white placeholder-white/50" />
                {errors.nl && <p className="text-red-300 text-xs">{errors.nl}</p>}
                <button type="submit"
                  className="w-full bg-white text-[#0075E1] font-black py-3 rounded-2xl text-sm hover:bg-blue-50 transition-colors">
                  Subscribe to Updates
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}