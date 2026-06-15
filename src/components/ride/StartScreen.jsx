import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Bike, TreePine, ChevronRight, Calendar, Navigation, User } from "lucide-react";
import { ROUTE_CONFIG, EVENT_NAME, EVENT_TAGLINE, EVENT_DATE, EVENT_LOCATION } from "@/lib/routeData";
import { base44 } from "@/api/base44Client";

const routeIcons = { red: "🔴", blue: "🔵", green: "🟢" };

// Map route_km from registration to ROUTE_CONFIG key
const KM_TO_ROUTE = { "5": "red", "16": "blue", "25": "green" };

export default function StartScreen({ onSelectRoute }) {
  const routes = ["red", "blue", "green"].map(id => ROUTE_CONFIG[id]);
  const [registration, setRegistration] = useState(null);
  const [phone, setPhone] = useState("");
  const [lookupInput, setLookupInput] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [looking, setLooking] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLooking(true);
    setNotFound(false);
    const results = await base44.entities.Registration.filter({ phone: lookupInput.trim() });
    if (results.length > 0) {
      setRegistration(results[0]);
    } else {
      setNotFound(true);
    }
    setLooking(false);
  };

  const handleSelectRoute = (routeId) => {
    onSelectRoute(routeId, registration);
  };

  const suggestedRouteId = registration ? KM_TO_ROUTE[registration.route_km] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary to-blue-900 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-white/5" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-white/5" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative z-10 pt-12 pb-6 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
          <Calendar className="w-3.5 h-3.5 text-white/80" />
          <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">{EVENT_DATE}</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <Bike className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
          {EVENT_NAME.split("–")[0].trim()}
        </h1>
        <p className="text-lg font-bold text-white/90 mt-1">{EVENT_TAGLINE}</p>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-white/70">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{EVENT_LOCATION}</span>
        </div>
      </motion.div>

      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 flex-1 bg-white rounded-t-[2rem] px-5 pt-7 pb-8">

        {/* Rider lookup */}
        {!registration ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Find Your Registration</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Enter your registered phone number to load your route</p>
            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="tel"
                value={lookupInput}
                onChange={e => setLookupInput(e.target.value)}
                placeholder="e.g. 0712 345 678"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" disabled={looking}
                className="bg-primary text-white font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-60">
                {looking ? "…" : "Find"}
              </button>
            </form>
            {notFound && <p className="text-red-500 text-xs mt-2">No registration found. You can still pick a route below.</p>}
          </div>
        ) : (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-green-800">👋 Welcome, {registration.name.split(" ")[0]}!</p>
              <p className="text-xs text-green-600 mt-0.5">Your registered route: <strong>{registration.route_km} km</strong> · {registration.tier}</p>
            </div>
            <button onClick={() => setRegistration(null)} className="text-xs text-green-500 font-semibold underline">Change</button>
          </div>
        )}

        {/* Route selection */}
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            {registration ? "Your Route" : "Choose Your Route"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          {registration ? "Your registered route is highlighted below" : "Select a trail to begin your ride"}
        </p>

        <div className="space-y-3">
          {routes.map((route, index) => {
            const isRecommended = suggestedRouteId === route.id;
            return (
              <motion.button
                key={route.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                onClick={() => handleSelectRoute(route.id)}
                className="w-full group">
                <div
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${isRecommended ? "border-primary shadow-md" : ""}`}
                  style={{ borderColor: isRecommended ? undefined : route.color + "40", backgroundColor: route.color + "08" }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: route.color + "18" }}>
                    <span className="text-2xl">{routeIcons[route.id]}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-foreground">{route.name}</span>
                      {isRecommended && (
                        <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-full">YOUR ROUTE</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{route.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: route.color + "18", color: route.color }}>
                        {route.distance} km
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {route.waypoints.filter(w => w.type === "checkpoint").length} checkpoints
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 flex-shrink-0 transition-transform group-active:translate-x-1"
                    style={{ color: route.color }} />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-muted-foreground">
            <TreePine className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Trail managed by Limitless Kenya</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}