import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SosButton({ riderPosition, route, registration }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const lat = riderPosition ? riderPosition[0] : null;
    const lng = riderPosition ? riderPosition[1] : null;
    const mapsUrl = lat && lng ? `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}` : null;

    // Save SOS alert to DB
    await base44.entities.SosAlert.create({
      rider_name: registration?.name || "Unknown Rider",
      rider_phone: registration?.phone || null,
      route_km: registration?.route_km || route?.distance?.toString() || null,
      route_name: route?.name || "Unknown Route",
      lat: lat || null,
      lng: lng || null,
      maps_url: mapsUrl || null,
      status: "active",
    });

    // Also trigger SMS
    const message =
      `🚨 EMERGENCY ALERT — Tatu City Riders 2026\n\n` +
      `Rider needs assistance!\n` +
      `👤 Name: ${registration?.name || "Unknown"}\n` +
      `📞 Phone: ${registration?.phone || "Unknown"}\n` +
      `📍 GPS: ${lat?.toFixed(6) ?? "unknown"}, ${lng?.toFixed(6) ?? "unknown"}\n` +
      `🗺️ Map: ${mapsUrl || "unavailable"}\n` +
      `🚴 Route: ${route?.name ?? "Unknown"}\n\n` +
      `Sent via TCR 2026 Race App`;

    window.location.href = `sms:+254700000000?body=${encodeURIComponent(message)}`;

    setSent(true);
    setTimeout(() => {
      setShowConfirm(false);
      setSent(false);
    }, 3000);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute bottom-36 right-3 z-[1000] w-14 h-14 rounded-2xl bg-red-600 shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-transform border-2 border-red-400"
        style={{ boxShadow: "0 0 0 4px rgba(239,68,68,0.25), 0 4px 20px rgba(239,68,68,0.4)" }}>
        <AlertTriangle className="w-6 h-6 text-white" strokeWidth={3} />
        <span className="text-white text-[9px] font-black tracking-widest mt-0.5">SOS</span>
      </button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-end justify-center pb-8 px-4">
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-red-600 px-6 pt-6 pb-5 text-center">
                <AlertTriangle className="w-10 h-10 text-white mx-auto mb-2" strokeWidth={2.5} />
                <h2 className="text-white text-xl font-black">Emergency Alert</h2>
                <p className="text-red-100 text-sm mt-1">This will alert race marshals with your location</p>
              </div>

              <div className="px-6 py-4 space-y-2">
                {registration?.name && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Rider</span>
                    <span className="font-bold text-foreground">{registration.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Route</span>
                  <span className="font-bold text-foreground">{route?.name ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">GPS</span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {riderPosition
                      ? `${riderPosition[0].toFixed(5)}, ${riderPosition[1].toFixed(5)}`
                      : "Acquiring…"}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 h-12 rounded-2xl border-2 border-border font-bold text-foreground flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={handleSend} disabled={sent}
                  className="flex-[2] h-12 rounded-2xl bg-red-600 font-black text-white flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70">
                  {sent ? <span>✓ Alert Sent!</span> : <><Phone className="w-4 h-4" /> Send SOS</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}