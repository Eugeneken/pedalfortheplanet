import React from "react";
import { motion } from "framer-motion";
import { formatTime, formatSpeed, formatPace } from "@/lib/geoUtils";
import { Timer, Gauge, TrendingUp, MapPin, Route } from "lucide-react";

export default function StatsPanel({ stats, routeColor, routeDistance }) {
  const { distanceCovered, currentSpeed, elapsedTime, averageSpeed } = stats;

  const distanceRemaining = Math.max(0, (routeDistance * 1000) - distanceCovered);
  const avgSpeedMps = elapsedTime > 0 ? distanceCovered / elapsedTime : 0;

  const statItems = [
    {
      icon: Route,
      label: "Distance",
      value: (distanceCovered / 1000).toFixed(1),
      unit: "km",
    },
    {
      icon: Gauge,
      label: "Speed",
      value: formatSpeed(currentSpeed),
      unit: "km/h",
    },
    {
      icon: TrendingUp,
      label: "Pace",
      value: formatPace(avgSpeedMps),
      unit: "min/km",
    },
    {
      icon: Timer,
      label: "Time",
      value: formatTime(elapsedTime),
      unit: "",
    },
    {
      icon: MapPin,
      label: "Remaining",
      value: distanceRemaining < 1000
        ? Math.round(distanceRemaining).toString()
        : (distanceRemaining / 1000).toFixed(1),
      unit: distanceRemaining < 1000 ? "m" : "km",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-0 left-0 right-0 z-[1000] safe-bottom"
    >
      <div className="mx-3 mb-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-muted">
          <motion.div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              backgroundColor: routeColor,
              width: `${Math.min(100, (distanceCovered / (routeDistance * 1000)) * 100)}%`,
            }}
          />
        </div>

        {/* Stats grid */}
        <div className="flex items-center justify-between px-2 py-3 hide-scrollbar">
          {statItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center px-1.5 min-w-0">
              <item.icon
                className="w-3.5 h-3.5 mb-0.5"
                style={{ color: routeColor }}
                strokeWidth={2.5}
              />
              <span className="text-[17px] font-black text-foreground leading-none tabular-nums">
                {item.value}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                {item.unit || item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}