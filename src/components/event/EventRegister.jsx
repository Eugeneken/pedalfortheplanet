import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const tiers = [
  {
    name: "Individual",
    color: "#0075E1",
    featured: true,
    price: "KES 1,500",
    perks: ["Rider bib", "Finisher medal", "Water at aid stations", "Event t-shirt"],
  },
  {
    name: "Family of 4",
    color: "#2E7D32",
    price: "KES 5,000",
    perks: ["4 rider bibs", "4 finisher medals", "Water at aid stations", "4 event t-shirts"],
  },
];

export default function EventRegister() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", route: "16", tier: "Individual", tshirt_size: "M" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^(\+254|07|01)\d{8,9}$/)) e.phone = "Valid Kenyan phone required (e.g. 0712345678)";
    return e;
  };

  const TIER_PRICES = { "Individual": 1500, "Family of 4": 5000 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setPaymentError(null);

    // 1. Create registration record
    const registration = await base44.entities.Registration.create({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      route_km: form.route,
      tier: form.tier,
      tshirt_size: form.tshirt_size,
      payment_status: "pending",
    });

    // 2. Create Pesapal payment order
    try {
      const res = await base44.functions.invoke("mpesaPayment", {
        phone: form.phone.trim(),
        amount: TIER_PRICES[form.tier],
        description: `Tatu City Riders 2026 — ${form.tier} (${form.route}km)`,
        registrationId: registration.id,
        email: form.email.trim(),
        name: form.name.trim(),
        callbackUrl: `${window.location.origin}/?payment=success`,
      });

      if (res.data?.success && res.data?.redirect_url) {
        setPaymentUrl(res.data.redirect_url);
        // Redirect to Pesapal payment page
        window.location.href = res.data.redirect_url;
      } else {
        setPaymentError(res.data?.message || "Payment request failed. Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Payment request failed. Please try again.";
      setPaymentError(msg);
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="py-20 md:py-28 bg-gradient-to-br from-[#003A8C] to-[#0075E1] px-5" id="register">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-blue-200 uppercase">Join the Ride</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4">Register & Pay</h2>
          <p className="text-blue-100 max-w-xl mx-auto">Secure your spot today. Payments via M-PESA or card through Pesapal.</p>
        </motion.div>

        {/* Pricing tiers */}
        <div className="grid md:grid-cols-2 gap-5 mb-8 max-w-2xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`rounded-3xl p-6 ${t.featured ? "bg-white shadow-2xl ring-4 ring-white/30" : "bg-white/10 backdrop-blur-sm border border-white/20"}`}>
              <h3 className={`text-xl font-black mb-1 ${t.featured ? "text-gray-900" : "text-white"}`}>{t.name}</h3>
              <div className="text-3xl font-black my-3" style={{ color: t.featured ? t.color : "white" }}>{t.price}</div>
              <div className="space-y-1.5">
                {t.perks.map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.color }} />
                    <span className={`text-xs ${t.featured ? "text-gray-600" : "text-blue-100"}`}>{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Day-of registration notice */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-start gap-3 bg-yellow-400/20 border border-yellow-300/40 rounded-2xl px-5 py-4 mb-8 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-100 leading-relaxed">
            <span className="font-black">Day-of registration is strongly discouraged.</span> Pre-register online to guarantee your spot. In the event that capacity is reached, registration at the venue will be closed with no exceptions.
          </p>
        </motion.div>

        {/* Registration form */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 md:p-10 max-w-xl mx-auto shadow-2xl">
          {submitted ? (
            <div className="text-center py-8">
              {paymentError ? (
                <>
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">You're registered!</h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left mt-3">
                    <p className="text-red-700 text-xs font-semibold mb-1">⚠️ Payment page could not be loaded</p>
                    <p className="text-red-600 text-xs">{paymentError}</p>
                    <p className="text-gray-500 text-xs mt-2">Your registration is saved. Please contact us to complete payment.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">💳</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Redirecting to payment…</h3>
                  <p className="text-gray-600 text-sm mb-4">You'll be taken to Pesapal to complete payment of <strong>KES {TIER_PRICES[form.tier].toLocaleString()}</strong> via M-Pesa or card.</p>
                  {paymentUrl && (
                    <a href={paymentUrl} className="inline-flex items-center gap-2 bg-[#0075E1] text-white font-bold px-6 py-3 rounded-2xl text-sm hover:bg-blue-700 transition-colors">
                      <ExternalLink className="w-4 h-4" /> Open Payment Page
                    </a>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-xl font-black text-gray-900 mb-6">Complete Registration</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Wanjiru" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1] focus:border-transparent" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1] focus:border-transparent" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Phone (M-PESA) *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="0712 345 678" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1] focus:border-transparent" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Distance *</label>
                    <select value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1]">
                      <option value="5">5 km — Fun Ride</option>
                      <option value="16">16 km — Explorer</option>
                      <option value="25">25 km — Adventure</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">T-Shirt Size *</label>
                    <select value={form.tshirt_size} onChange={e => setForm({ ...form, tshirt_size: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1]">
                      <option>XS</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>XXL</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Package</label>
                  <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075E1]">
                    <option>Individual</option>
                    <option>Family of 4</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CreditCard className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-green-700 font-semibold">You'll be redirected to Pesapal to pay securely via M-Pesa or card</span>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-[#0075E1] hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating payment…</> : <><CreditCard className="w-5 h-5" /> Register &amp; Pay via Pesapal</>}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}